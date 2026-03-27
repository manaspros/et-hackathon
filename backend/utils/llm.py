import os
from groq import Groq
import anthropic
from dotenv import load_dotenv
load_dotenv()

# Groq: 750 tokens/sec — use for ALL real-time demo outputs
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def ask_groq(prompt: str, max_tokens: int = 300) -> str:
    """Fastest LLM call — use for demo UI responses"""
    stream = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=max_tokens,
        stream=True
    )
    return "".join(chunk.choices[0].delta.content or "" for chunk in stream)

def ask_claude(prompt: str, max_tokens: int = 300) -> str:
    """Higher quality — use for complex tasks (not real-time UI)"""
    client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    msg = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=max_tokens,
        messages=[{"role": "user", "content": prompt}]
    )
    return msg.content[0].text

def stream_to_streamlit(prompt: str, placeholder):
    """Stream Groq output directly into a Streamlit placeholder"""
    import streamlit as st
    stream = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=200, stream=True
    )
    full = ""
    for chunk in stream:
        token = chunk.choices[0].delta.content or ""
        full += token
        placeholder.markdown(full + "▌")
    placeholder.markdown(full)
    return full
