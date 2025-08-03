"""
Text Tokenization Utility Module

This module provides utility functions for text processing and tokenization.
It uses NLTK (Natural Language Toolkit) to break down text into individual
tokens for further processing.

The module includes:
- Text tokenization using NLTK's word_tokenize
- Automatic download of required NLTK data

"""

import nltk
nltk.download('punkt_tab')

def tokenize_text(text: str) -> list:
    """
    Tokenizes text into individual words using NLTK.
    
    This function breaks down input text into individual tokens (words)
    using NLTK's word_tokenize function. The text is converted to lowercase
    before tokenization.
    
    Args:
        text (str): The input text to tokenize.
        
    Returns:
        list: List of individual word tokens from the input text.
    """
    return nltk.word_tokenize(text.lower())