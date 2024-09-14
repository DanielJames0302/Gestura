import nltk
nltk.download('punkt_tab')

def tokenize_text(text):
    return nltk.word_tokenize(text.lower())