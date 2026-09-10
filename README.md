\# Aura — Multilingual Voice AI Assistant



\*\*DataForge 2026 — Rime Track\*\*



Aura (SwitchVoice) is a voice-native AI assistant designed for natural English–Hindi conversations. The system automatically detects the language being spoken and can switch its response language during the same conversation without requiring the user to manually select a language.



The project focuses on \*\*multilingual voice interaction and natural language switching\*\* using real-time speech-to-text, conversational AI, and streaming text-to-speech.



\---



\## Key Features



\* 🎙️ \*\*Voice-first interaction\*\* using LiveKit WebRTC

\* 🌐 \*\*English and Hindi support\*\*

\* 🔄 \*\*Automatic language switching\*\*

\* 🧠 \*\*Conversation context preservation\*\*

\* 🎧 \*\*Real-time speech-to-text\*\*

\* 🔊 \*\*Streaming AI voice responses\*\*

\* 🗣️ \*\*Different Rime voices for English and Hindi\*\*

\* 🚫 \*\*No manual language selection required\*\*

\* ⚡ \*\*Real-time conversational interaction\*\*

\* 💻 \*\*Web-based frontend\*\*



\---



\## Problem



Most voice assistants require the user to select a language before starting a conversation or work best when the user remains in a single language.



Real conversations are different.



Users may naturally move between English and Hindi during the same conversation, for example:



> "Hey Aura, can you explain machine learning?"



followed by:



> "Ab mujhe supervised learning samjhao."



Aura is designed to handle this type of language switching naturally while maintaining the conversation context.



\---



\## Solution



Aura uses a real-time voice pipeline that connects speech recognition, language detection, conversational AI, and voice synthesis.



The system detects the language associated with the user's speech and updates the voice response configuration accordingly.



For the current English/Hindi implementation:



```text

User Voice

&#x20;   ↓

LiveKit WebRTC

&#x20;   ↓

Deepgram Multilingual STT

&#x20;   ↓

Language Detection

&#x20;   ↓

OpenAI LLM

&#x20;   ↓

Language-aware Response

&#x20;   ↓

Rime TTS

&#x20;   ↓

Voice Response

```



\---



\## Technology Stack



\### Frontend



\* React

\* Vite

\* LiveKit Client

\* LiveKit React Components

\* JavaScript

\* CSS



\### Backend



\* Python

\* LiveKit Agents

\* Deepgram

\* OpenAI

\* Rime TTS

\* python-dotenv



\### Communication



\* WebRTC

\* LiveKit Cloud



\---



\## Voice Pipeline



\### 1. User speaks



The user speaks naturally through the browser microphone.



No language button or manual language selection is required.



\### 2. LiveKit handles real-time audio



LiveKit provides the real-time WebRTC connection between the browser and the voice agent.



\### 3. Deepgram processes speech



The backend uses Deepgram's multilingual Flux model:



```text

flux-general-multi

```



The current implementation provides English and Hindi as the expected languages:



```text

language\_hint = \["en", "hi"]

```



The multilingual model can detect the spoken language while processing the audio.



\### 4. Language state is updated



The backend receives the transcription event and its detected language.



The agent maintains the current language state for the conversation.



For example:



```text

English

&#x20;  ↓

Hindi

&#x20;  ↓

English

```



When the detected language changes, the backend updates the corresponding Rime TTS configuration.



\### 5. OpenAI generates the response



The detected conversational context is passed through the AI agent, which generates a natural response while maintaining the conversation context.



\### 6. Rime generates speech



Rime Coda is used for voice synthesis.



Current voice configuration:



| Language | Rime language | Speaker   |

| -------- | ------------- | --------- |

| English  | `eng`         | `celeste` |

| Hindi    | `hin`         | `nadi`    |



Rime WebSocket streaming is enabled:



```text

use\_websocket=True

```



This allows the application to use streaming voice synthesis rather than waiting for the entire response before starting audio playback.



\---



\## Language Switching



Aura currently focuses on:



```text

English ↔ Hindi

```



Example conversation:



```text

User:

"Hey Aura, what is machine learning?"



Aura:

"Machine learning is a part of AI..."



User:

"Mujhe supervised learning samjhao."



Aura:

"Supervised learning mein model labeled data se learn karta hai..."



User:

"Okay, give me an example."



Aura:

"Sure. For example..."

```



The user does not need to press an English/Hindi button.



The backend determines the language from the speech input.



\---



\## Current Backend Configuration



The main agent is:



```text

switchvoice

```



The agent is implemented using LiveKit Agents.



Current speech recognition configuration:



```text

Deepgram STTv2

Model: flux-general-multi

Language hints: en, hi

```



Current LLM configuration:



```text

OpenAI

Model: gpt-5.3-chat-latest

```



Current TTS configuration:



```text

Rime

Model: coda

WebSocket streaming: enabled

```



\---



\## Project Structure



```text

SwitchVoice/

│

├── frontend/

│   ├── src/

│   │   ├── components/

│   │   │   ├── ConnectScreen.jsx

│   │   │   ├── ControlBar.jsx

│   │   │   ├── Transcript.jsx

│   │   │   └── VoiceOrb.jsx

│   │   │

│   │   ├── App.jsx

│   │   ├── config.js

│   │   ├── main.jsx

│   │   └── styles/

│   │       └── index.css

│   │

│   ├── .env.example

│   ├── package.json

│   └── vite.config.js

│

├── src/

│   └── switchvoice/

│       ├── \_\_init\_\_.py

│       ├── agent.py

│       ├── language\_detector.py

│       └── segment\_detector.py

│

├── .gitignore

├── pyproject.toml

├── uv.lock

└── README.md

```



\---



\## Frontend



The frontend provides:



\* Aura branding

\* Voice connection screen

\* Microphone controls

\* Voice activity visualization

\* Conversation transcript area

\* LiveKit audio playback

\* End-call control



The frontend connects to the LiveKit agent named:



```text

switchvoice

```



The current frontend uses LiveKit's session management APIs to establish the voice session and communicate with the agent.



\---



\## Backend



The backend is implemented as a LiveKit Agent.



The main backend file is:



```text

src/switchvoice/agent.py

```



The backend is responsible for:



1\. Starting the LiveKit agent

2\. Connecting to the LiveKit room

3\. Receiving microphone audio

4\. Sending audio to Deepgram

5\. Receiving transcription and language information

6\. Maintaining the current language state

7\. Generating responses with the LLM

8\. Updating Rime's language and speaker

9\. Returning the generated voice response



\---



\## Environment Variables



Real API keys and credentials must \*\*never be committed to GitHub\*\*.



The project uses environment variables for:



```text

LIVEKIT\_URL

LIVEKIT\_API\_KEY

LIVEKIT\_API\_SECRET

DEEPGRAM\_API\_KEY

OPENAI\_API\_KEY

RIME\_API\_KEY

```



The frontend uses its own Vite environment configuration.



Example:



```text

VITE\_LIVEKIT\_TOKEN\_SERVER\_ID=

```



or, when a custom token endpoint is available:



```text

VITE\_LIVEKIT\_TOKEN\_ENDPOINT=

```



Only placeholder values belong in `.env.example`.



\---



\## Local Setup



\### Requirements



Install the following:



\* Python 3.13+

\* uv

\* Node.js

\* npm

\* LiveKit CLI



\---



\### Backend Setup



From the project root:



```powershell

cd C:\\Users\\HP\\SwitchVoice

```



Create/activate the Python environment using `uv` and install the project dependencies.



Create:



```text

.env.local

```



in the project root and add the required credentials.



\*\*Never commit `.env.local`.\*\*



\---



\### Run the LiveKit Agent



Use:



```powershell

lk agent dev src\\switchvoice\\agent.py --log-level DEBUG

```



The agent should register with the LiveKit project and wait for a job.



\---



\### Frontend Setup



Open another terminal:



```powershell

cd C:\\Users\\HP\\SwitchVoice\\frontend

```



Install dependencies:



```powershell

npm install

```



Create:



```text

.env.local

```



from:



```text

.env.example

```



Fill in the required LiveKit development configuration.



Then start the frontend:



```powershell

npm run dev

```



Open the local Vite URL shown in the terminal.



\---



\## Testing



The following end-to-end functionality has been tested during development:



\### English conversation



```text

User speech

&#x20;   ↓

LiveKit

&#x20;   ↓

Deepgram

&#x20;   ↓

OpenAI

&#x20;   ↓

Rime

&#x20;   ↓

English voice response

```



\### Hindi conversation



```text

User speech

&#x20;   ↓

LiveKit

&#x20;   ↓

Deepgram

&#x20;   ↓

Language detection

&#x20;   ↓

OpenAI

&#x20;   ↓

Rime Hindi voice

```



\### Language switching



The backend has been tested receiving detected language events and updating the Rime configuration from:



```text

English → Hindi

```



The agent has also been tested with natural English/Hindi conversational inputs while maintaining the conversation context.



\---



\## Development Notes



The project originally included experimental language detection approaches using local language-identification models.



Those experiments were not used as the final real-time voice detection mechanism.



The final voice pipeline relies on the real-time multilingual speech recognition provided by the Deepgram/LiveKit integration.



This keeps language detection closer to the actual speech signal rather than attempting to classify an entire text message after transcription.



\---



\## Security



The following files and directories must not be committed:



```text

.env.local

models/

\_\_pycache\_\_/

\*.pyc

```



API keys must never be placed directly inside Python or JavaScript source files.



Before submitting the repository, verify that:



```powershell

git ls-files .env.local

```



returns no output.



Also verify that no API key appears in tracked files.



\---



\## Current Scope



The current implementation intentionally focuses on:



\* English

\* Hindi

\* Real-time voice conversation

\* Automatic language detection

\* Language switching

\* Context preservation

\* Rime voice output

\* LiveKit WebRTC communication



The project does \*\*not\*\* attempt to support every Indian language or every possible multilingual combination.



This keeps the implementation focused on the core Rime challenge.



\---



\## Future Improvements



Possible future improvements include:



\* More Indian languages

\* Improved segment-level language visualization

\* More detailed language-switch history

\* Better confidence handling for ambiguous language detection

\* Conversation analytics

\* Measured latency dashboards

\* Production token-server deployment

\* Production deployment of the LiveKit agent

\* More Rime voice options

\* Improved transcript visualization



\---



\## Hackathon Focus



\### Rime Track



Aura is designed around the idea that \*\*voice is the primary interface\*\*, not simply an audio version of a text chatbot.



The key challenge addressed by the project is:



> \*\*Natural multilingual voice interaction with automatic English/Hindi switching during a conversation.\*\*



The system combines:



```text

Real-time audio

\+

Multilingual speech recognition

\+

Language detection

\+

Context-aware AI

\+

Streaming voice synthesis

```



to create a voice-native conversational experience.



\---



\## Status



\### Working



\* LiveKit project connection

\* LiveKit Agent registration

\* Browser-to-agent voice connection

\* Microphone input

\* Deepgram speech recognition

\* English/Hindi language detection events

\* OpenAI response generation

\* Rime text-to-speech

\* English/Hindi Rime configuration switching

\* React/Vite frontend

\* Production frontend build



\### Still to document/measure



\* Formal repeatable latency measurements

\* Final Rime evidence measurements

\* Production deployment configuration

\* Final demo recording



\---



\## Team



\*\*Project:\*\* Aura / SwitchVoice



\*\*Hackathon:\*\* DataForge 2026



\*\*Track:\*\* Rime — Build a Voice-Native Product



\*\*Repository:\*\* DataForge / SwitchVoice



\---



\## License



This project was developed as a hackathon project for DataForge 2026.



