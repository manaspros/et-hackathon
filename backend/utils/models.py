import streamlit as st
from sentence_transformers import SentenceTransformer
from transformers import pipeline

@st.cache_resource(show_spinner="Loading embedding model...")
def get_embedder():
    """all-MiniLM-L6-v2: 22M params, 3x faster than mpnet, perfect for demo"""
    return SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

@st.cache_resource(show_spinner="Loading FinBERT...")
def get_finbert():
    """Financial sentiment — positive/negative/neutral"""
    return pipeline("text-classification", model="ProsusAI/finbert",
                    top_k=None, truncation=True, max_length=512)
