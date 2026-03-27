/**
 * useReadingBehavior — Real Reading Signal Collector
 * Collects behavioral signals every 200ms, scores via ML backend (with local fallback).
 * FIXED: tracks scroll on scrollContainerRef (fixed overlay), not window.
 */

import { useState, useEffect, useRef, useCallback } from 'react'

const SCORING_URL = 'http://localhost:8001/score'
const SIGNAL_INTERVAL_MS = 200

export default function useReadingBehavior({
  userId,
  articleId,
  articleRef,           // ref to the article content div
  scrollContainerRef,   // ref to the scrollable container (fixed overlay)
  hookDepth = 0.62
}) {
  const [probability,  setProbability]  = useState(0)
  const [shouldFire,   setShouldFire]   = useState(false)
  const [fireReason,   setFireReason]   = useState('')
  const [trend,        setTrend]        = useState('rising')
  const [pHistory,     setPHistory]     = useState([])
  const [signals,      setSignals]      = useState({})
  const [scrollDepth,  setScrollDepth]  = useState(0)

  const scrollDepthRef      = useRef(0)
  const lastScrollY         = useRef(0)
  const lastScrollTime      = useRef(Date.now())
  const velocityRef         = useRef(0)
  const scrollReversalsRef  = useRef(0)
  const lastDirection       = useRef('down')
  const pauseStartRef       = useRef(null)
  const totalPauseRef       = useRef(0)
  const dataHoverRef        = useRef(0)
  const paragraphDwellRef   = useRef(0)
  const paraEnterTimeRef    = useRef(Date.now())
  const currentParaRef      = useRef(null)
  const readingSpeedRef     = useRef(300)
  const wpmWindowRef        = useRef([])
  const firedRef            = useRef(false)

  // Scroll handler — uses scrollContainerRef instead of window
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef?.current
    if (!container || !articleRef?.current) return

    const now       = Date.now()
    const scrollTop = container.scrollTop
    const scrollMax = container.scrollHeight - container.clientHeight
    const depth     = scrollMax > 0 ? Math.max(0, Math.min(1, scrollTop / scrollMax)) : 0
    scrollDepthRef.current = depth
    setScrollDepth(depth)

    // Velocity
    const dy  = scrollTop - lastScrollY.current
    const dt  = (now - lastScrollTime.current) / 1000
    const vel = dt > 0 ? Math.abs(dy / dt) : 0
    velocityRef.current = vel

    // Direction change = re-read
    const dir = dy > 0 ? 'down' : dy < 0 ? 'up' : lastDirection.current
    if (dir === 'up' && lastDirection.current === 'down') {
      scrollReversalsRef.current += 1
    }
    lastDirection.current = dir

    // Pause detection
    if (vel < 10) {
      if (!pauseStartRef.current) pauseStartRef.current = now
    } else {
      if (pauseStartRef.current) {
        totalPauseRef.current += (now - pauseStartRef.current) / 1000
        pauseStartRef.current = null
      }
    }

    // Reading speed estimation
    const wordsScrolled = Math.abs(dy) / 3
    wpmWindowRef.current.push({ words: wordsScrolled, time: now })
    wpmWindowRef.current = wpmWindowRef.current.filter(w => now - w.time < 5000)
    const totalWords    = wpmWindowRef.current.reduce((s, w) => s + w.words, 0)
    readingSpeedRef.current = Math.min(600, Math.max(50, (totalWords / 5) * 60))

    lastScrollY.current   = scrollTop
    lastScrollTime.current = now
  }, [scrollContainerRef, articleRef])

  // Attach scroll listener to container
  useEffect(() => {
    const container = scrollContainerRef?.current
    if (!container) return
    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [handleScroll, scrollContainerRef])

  // Paragraph dwell via IntersectionObserver
  useEffect(() => {
    if (!articleRef?.current) return
    const paragraphs = articleRef.current.querySelectorAll('p, h2, blockquote')
    if (!paragraphs.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            if (currentParaRef.current !== entry.target) {
              const now = Date.now()
              if (currentParaRef.current) {
                paragraphDwellRef.current = (now - paraEnterTimeRef.current) / 1000
              }
              currentParaRef.current = entry.target
              paraEnterTimeRef.current = now
            }
          }
        })
      },
      { threshold: [0.5], root: scrollContainerRef?.current }
    )
    paragraphs.forEach(p => observer.observe(p))
    return () => observer.disconnect()
  }, [articleRef, scrollContainerRef])

  // Signal collection + scoring loop
  useEffect(() => {
    if (firedRef.current) return

    const interval = setInterval(async () => {
      if (firedRef.current) return

      if (currentParaRef.current) {
        paragraphDwellRef.current = (Date.now() - paraEnterTimeRef.current) / 1000
      }

      const currentSignals = {
        scroll_depth:       Math.round(scrollDepthRef.current * 1000) / 1000,
        scroll_velocity:    Math.round(velocityRef.current),
        scroll_reversals:   scrollReversalsRef.current,
        paragraph_dwell:    Math.round(paragraphDwellRef.current),
        reading_speed_wpm:  Math.round(readingSpeedRef.current),
        pause_duration:     Math.round(totalPauseRef.current),
        data_hover_count:   dataHoverRef.current,
        is_at_hook:         scrollDepthRef.current >= hookDepth ? 1 : 0,
      }
      setSignals(currentSignals)

      try {
        const res = await fetch(SCORING_URL, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ user_id: userId, article_id: articleId, signals: currentSignals })
        })
        if (!res.ok) throw new Error('Backend error')
        const data = await res.json()

        setProbability(data.p || 0)
        setTrend(data.trend || 'rising')
        setPHistory(data.p_history || [])

        if (data.fire && !firedRef.current) {
          firedRef.current = true
          setShouldFire(true)
          setFireReason(data.reason_human || data.reason || '')
        }
      } catch {
        // Local fallback when backend not running
        const p = localFallbackScore(currentSignals, userId)
        setProbability(p)
        setPHistory(prev => [...prev.slice(-19), p])

        const decision = localFallbackDecision(p, currentSignals, userId)
        setTrend(decision.trend || (p > (pHistoryRef.current || 0) ? 'rising' : 'falling'))
        if (decision.fire && !firedRef.current) {
          firedRef.current = true
          setShouldFire(true)
          setFireReason(decision.reason)
        }
        pHistoryRef.current = p
      }
    }, SIGNAL_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [userId, articleId, hookDepth])

  const pHistoryRef = useRef(0)

  const reset = useCallback(async () => {
    firedRef.current         = false
    scrollReversalsRef.current = 0
    totalPauseRef.current    = 0
    dataHoverRef.current     = 0
    paragraphDwellRef.current = 0
    setShouldFire(false)
    setFireReason('')
    setProbability(0)
    setPHistory([])
    setScrollDepth(0)
    try { await fetch(`http://localhost:8001/reset/${userId}`, { method: 'POST' }) } catch {}
  }, [userId])

  return { probability, shouldFire, fireReason, trend, pHistory, signals, scrollDepth, reset }
}

// Local fallback scoring
const WEIGHTS = {
  scroll_depth: 2.1, scroll_velocity: -0.8, scroll_reversals: 1.8,
  paragraph_dwell: 1.2, reading_speed_wpm: -0.6, pause_duration: 0.9,
  data_hover_count: 1.4, is_at_hook: 1.6,
}
const USER_BASE = { priya_001: -1.2, rahul_002: -1.0, sneha_003: -0.8 }

function localFallbackScore(signals, userId) {
  let z = USER_BASE[userId] || -1.0
  z += WEIGHTS.scroll_depth * signals.scroll_depth
  z += WEIGHTS.scroll_velocity * Math.min(1, signals.scroll_velocity / 400)
  z += WEIGHTS.scroll_reversals * Math.min(3, signals.scroll_reversals) / 3
  z += WEIGHTS.paragraph_dwell * Math.min(1, signals.paragraph_dwell / 60)
  z += WEIGHTS.reading_speed_wpm * Math.min(1, signals.reading_speed_wpm / 400)
  z += WEIGHTS.pause_duration * Math.min(1, signals.pause_duration / 60)
  z += WEIGHTS.data_hover_count * Math.min(1, signals.data_hover_count / 3)
  z += WEIGHTS.is_at_hook * signals.is_at_hook
  return Math.round(1 / (1 + Math.exp(-z)) * 1000) / 1000
}

const THRESHOLDS = { priya_001: 0.28, rahul_002: 0.32, sneha_003: 0.22 }

function localFallbackDecision(p, signals, userId) {
  const threshold = THRESHOLDS[userId] || 0.30
  if (signals.scroll_reversals >= 2 && p >= threshold * 0.8)
    return { fire: true, reason: `Re-read ${signals.scroll_reversals}× — deep engagement detected`, trend: 'peak' }
  if (signals.paragraph_dwell >= 60 && p >= threshold)
    return { fire: true, reason: `Reading for ${Math.round(signals.paragraph_dwell)}s — maximum engagement`, trend: 'peak' }
  if (signals.is_at_hook && signals.scroll_velocity < 120 && p >= threshold)
    return { fire: true, reason: 'Natural breakpoint + slow reading — optimal moment (Piano Analytics)', trend: 'peak' }
  return { fire: false, reason: '', trend: p > 0.2 ? 'rising' : 'plateau' }
}
