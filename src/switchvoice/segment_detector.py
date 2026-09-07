import re
from language_detector import detect_language


def split_into_windows(text, window_size=4):
    """
    Create overlapping groups of words.
    """

    words = text.split()

    windows = []

    for i in range(0, len(words), window_size):
        window = " ".join(words[i:i + window_size])

        if window:
            windows.append(window)

    return windows


def detect_segments(text):
    """
    Detect language for each small window
    and merge consecutive windows with the same language.
    """

    windows = split_into_windows(text)

    segments = []

    for window in windows:
        language, confidence = detect_language(window)

        segments.append({
            "text": window,
            "lang": language,
            "confidence": confidence
        })

    return segments


# TEST
text = "Hey Aura mujhe machine learning samjhao in simple English"

segments = detect_segments(text)

print("\nDetected segments:")

for segment in segments:
    print(segment)