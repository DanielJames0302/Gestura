"""
Caption Formatting Utility Module

This module provides utility functions for processing and formatting captions
extracted from videos. It handles timestamp processing and text cleaning
operations to improve caption quality and readability.

The module includes functions for:
- Processing timestamps to remove milliseconds and concatenate words
- Cleaning repeated words to improve caption flow
- Formatting captions for optimal display

"""

import datetime

def process_timestamps(input_dict: dict) -> dict:
    """
    Processes timestamps in a caption dictionary to remove milliseconds and concatenate words.
    
    This function takes a dictionary with timestamps as keys and words as values,
    removes milliseconds from the timestamps, and concatenates words that occur
    at the same second.
    
    Args:
        input_dict (dict): Dictionary with timestamps as keys and words as values.
            Format: {"HH:MM:SS.mmm": "word", ...}
            
    Returns:
        dict: Processed dictionary with cleaned timestamps and concatenated words.
            Format: {"HH:MM:SS": "word1 word2", ...}
    """
    # Step 1: Remove milliseconds from the keys and concatenate words
    processed_dict = {}
    for timestamp, word in input_dict.items():
        # Parse the timestamp and remove milliseconds
        time_obj = datetime.datetime.strptime(timestamp, '%H:%M:%S.%f')
        time_str = time_obj.strftime('%H:%M:%S')
        
        # Concatenate the words with a space if they are different
        if time_str in processed_dict:
            if word not in processed_dict[time_str].split():  # Avoid duplicate words
                processed_dict[time_str] += ' ' + word
        else:
            processed_dict[time_str] = word

    return processed_dict

def clean_repeated_words(input_dict: dict) -> dict:
    """
    Cleans repeated words from captions to improve readability.
    
    This function processes a dictionary of captions and removes repeated words
    that appear at the beginning of one caption and the end of the previous caption.
    This helps create smoother, more natural caption flow.
    
    Args:
        input_dict (dict): Dictionary with timestamps as keys and caption text as values.
            Format: {"HH:MM:SS": "caption text", ...}
            
    Returns:
        dict: Cleaned dictionary with repeated words removed.
            Format: {"HH:MM:SS": "cleaned caption text", ...}
    """
    # Sort the input dictionary by timestamps
    sorted_keys = sorted(input_dict.keys())
    cleaned_dict = {}
    prev_word = None
    
    for key in sorted_keys:
        words = input_dict[key].split()
        
        # Check if the first word is the same as the last word of the previous entry
        if prev_word and words[0] == prev_word:
            words = words[1:]  # Remove the first word
        
        # Join the words back together
        cleaned_dict[key] = ' '.join(words)
        
        # Update prev_word to the last word of the current entry
        if words:
            prev_word = words[-1]
        else:
            prev_word = None
    
    return cleaned_dict