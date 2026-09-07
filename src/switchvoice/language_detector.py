import fasttext

MODEL_PATH = "models/model.bin"

model = fasttext.load_model(MODEL_PATH)

LANGUAGE_MAP = {
    "eng_Latn": "en",
    "hin_Deva": "hi",
}


def detect_language(text):
    labels, probabilities = model.predict(text)

    raw_language = labels[0].replace("__label__", "")
    confidence = float(probabilities[0])

    language = LANGUAGE_MAP.get(raw_language, raw_language)

    return language, confidence


# Test different sentence types
tests = [
    "Hello, how are you?",
    "मुझे मशीन लर्निंग समझाओ",
    "Hey Aura mujhe machine learning samjhao",
    "Hey Aura, mujhe weather batao in simple English",
    "Aaj weather is very good",
]


for text in tests:
    language, confidence = detect_language(text)

    print("\nText:", text)
    print("Language:", language)
    print("Confidence:", confidence)