
def crop_text_to_limit(text: str, max_length: int, verbose_logging: bool = False) -> tuple[str, bool]:
    """
    Crop text to fit within the specified character limit.
    
    Args:
        text (str): The input text to crop.
        max_length (int): Maximum allowed character length.
        verbose_logging (bool): Whether to log cropping details.
    
    Returns:
        tuple[str, bool]: A tuple containing (cropped_text, was_cropped)
    """
    if not text or len(text) <= max_length:
        return text, False
    
    original_length = len(text)
    
    # Find the last complete word within the limit
    cropped_text = text[:max_length]
    last_space_index = cropped_text.rfind(' ')
    
    if last_space_index > max_length * 0.8:  # If we can find a good word boundary
        final_text = cropped_text[:last_space_index].strip()
    else:
        # If no good word boundary, just cut at the limit
        final_text = cropped_text.strip()
    
    if verbose_logging:
        print(f"Text automatically cropped from {original_length} to {len(final_text)} characters")
        print(f"Original: {text[:100]}{'...' if len(text) > 100 else ''}")
        print(f"Cropped: {final_text[:100]}{'...' if len(final_text) > 100 else ''}")
    
    return final_text, True

def validate_and_crop_text(text: str, max_length: int, verbose_logging: bool = False) -> tuple[str, bool]:
    """
    Validate text input and crop if necessary.
    
    Args:
        text (str): The input text to validate and potentially crop.
        max_length (int): Maximum allowed character length.
        verbose_logging (bool): Whether to log cropping details.
    
    Returns:
        tuple[str, bool]: A tuple containing (processed_text, was_cropped)
    
    Raises:
        ValueError: If text is empty or None.
    """
    if not text or not text.strip():
        raise ValueError("Text input cannot be empty")
    
    return crop_text_to_limit(text.strip(), max_length, verbose_logging)
