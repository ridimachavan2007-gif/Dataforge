# Rime TTS Evidence

## Project

**Project:** Aura / SwitchVoice  
**Hackathon:** DataForge 2026  
**Track:** Rime - Build a Voice-Native Product

## Rime Integration

Aura uses the official LiveKit Rime TTS plugin for voice generation.

Configuration used during testing:

- **TTS Provider:** Rime
- **Model:** `coda`
- **English Speaker:** `celeste`
- **Hindi Speaker:** `nadi`
- **Streaming:** WebSocket enabled
- **WebSocket:** `use_websocket=True`

Rime is used as the voice output layer of the LiveKit agent.

## Voice Pipeline

```text
User Microphone
      |
      v
LiveKit / WebRTC
      |
      v
Deepgram Speech-to-Text
      |
      v
Language Detection
      |
      v
OpenAI LLM
      |
      v
Rime TTS
      |
      v
Voice Response
```text

## Rime Testing

End-to-end testing confirmed that Rime generated spoken responses through the LiveKit voice pipeline.

English and Hindi/Hinglish conversations were tested.

The Hindi voice configuration uses the Rime nadi speaker, while English uses the celeste speaker.

The agent dynamically updates the Rime TTS language and speaker when the detected conversation language changes.

## Language Switching

Supported languages:

- English
- Hindi

Example conversation flow:

English -> Hindi -> English

