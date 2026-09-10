import sys

if sys.stdout is not None:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

if sys.stderr is not None:
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

import logging
from dataclasses import dataclass

from dotenv import load_dotenv

from livekit.agents import (
    Agent,
    AgentServer,
    AgentSession,
    JobContext,
    UserInputTranscribedEvent,
    TurnHandlingOptions,
    cli,
)

from livekit.plugins import deepgram, rime


# ============================================================
# LOAD ENVIRONMENT
# ============================================================

load_dotenv(".env.local")


# ============================================================
# LOGGING
# ============================================================

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)

logger = logging.getLogger("switchvoice")


# ============================================================
# LIVEKIT SERVER
# ============================================================

server = AgentServer()


# ============================================================
# LANGUAGE CONFIGURATION
# ============================================================

DEFAULT_LANGUAGE = "eng"


@dataclass
class LanguageConfig:
    language: str
    speaker: str


LANGUAGE_CONFIGS = {
    "eng": LanguageConfig(
        language="eng",
        speaker="celeste",
    ),
    "hin": LanguageConfig(
        language="hin",
        speaker="nadi",
    ),
}


# Deepgram language code -> Rime language code
STT_TO_RIME = {
    "en": "eng",
    "hi": "hin",
}


# ============================================================
# AURA AGENT
# ============================================================

class SwitchVoiceAgent(Agent):

    def __init__(self):

        super().__init__(
            instructions="""
You are Aura, a friendly multilingual voice AI assistant.

You support English and Hindi.

The user can naturally switch between English and Hindi
during the same conversation.

Always respond according to the language the user is
currently speaking.

If the user speaks English, respond in English.

If the user speaks Hindi, respond in Hindi.

If the user switches from English to Hindi, continue
in Hindi.

If the user switches from Hindi to English, continue
in English.

Preserve the conversation context when the language changes.

Do not ask the user to manually select a language.

Keep responses:
- short
- natural
- clear
- conversational
- suitable for voice

Do not mention internal language detection,
Deepgram, Rime, LiveKit, or system processing
unless the user specifically asks about the technology.
"""
        )


# ============================================================
# LIVEKIT SESSION
# ============================================================

@server.rtc_session(agent_name="switchvoice")
async def entrypoint(ctx: JobContext):

    logger.info("==============================================")
    logger.info("SWITCHVOICE STARTING")
    logger.info("==============================================")

    # --------------------------------------------------------
    # Current conversation language
    # --------------------------------------------------------

    current_language = DEFAULT_LANGUAGE

    # --------------------------------------------------------
    # DEEPGRAM FLUX MULTILINGUAL STT
    # --------------------------------------------------------

    stt = deepgram.STTv2(
        model="flux-general-multi",
        language_hint=["en", "hi"],
        eager_eot_threshold=0.4,
        eot_threshold=0.7,
    )

    # --------------------------------------------------------
    # RIME TTS
    # --------------------------------------------------------
    #
    # WebSocket mode is intentionally enabled.
    #

    tts = rime.TTS(
        model="coda",
        speaker="celeste",
        lang="eng",
        use_websocket=True,
    )

    # --------------------------------------------------------
    # AGENT SESSION
    # --------------------------------------------------------

    session = AgentSession(
        stt=stt,
        llm="openai/gpt-5.3-chat-latest",
        tts=tts,
        turn_handling=TurnHandlingOptions(
            turn_detection="stt",
        ),
    )

    # ========================================================
    # TRANSCRIPTION + LANGUAGE DETECTION
    # ========================================================

    @session.on("user_input_transcribed")
    def on_user_input_transcribed(
        event: UserInputTranscribedEvent,
    ):

        nonlocal current_language

        # ----------------------------------------------------
        # Ignore partial transcription
        # ----------------------------------------------------

        if not event.is_final:
            return

        transcript = event.transcript.strip()

        if not transcript:
            return

        detected_language = event.language

        # ----------------------------------------------------
        # TRANSCRIPTION LOG
        # ----------------------------------------------------

        logger.info(
            "TRANSCRIPTION EVENT | text='%s' | language='%s'",
            transcript,
            detected_language,
        )

        # ----------------------------------------------------
        # LANGUAGE DETECTION CHECK
        # ----------------------------------------------------

        if not detected_language:

            logger.warning(
                "NO LANGUAGE DETECTED | keeping=%s",
                current_language,
            )

            return

        # ----------------------------------------------------
        # Convert language code
        #
        # en     -> en
        # en-US  -> en
        # hi     -> hi
        # hi-IN  -> hi
        # ----------------------------------------------------

        base_language = (
            detected_language
            .replace("_", "-")
            .split("-")[0]
            .lower()
        )

        logger.info(
            "DETECTED LANGUAGE | %s",
            base_language,
        )

        # ----------------------------------------------------
        # Convert Deepgram language to Rime language
        # ----------------------------------------------------

        rime_language = STT_TO_RIME.get(base_language)

        if rime_language is None:

            logger.warning(
                "UNSUPPORTED LANGUAGE | detected=%s | keeping=%s",
                detected_language,
                current_language,
            )

            return

        # ----------------------------------------------------
        # LANGUAGE DID NOT CHANGE
        # ----------------------------------------------------

        if rime_language == current_language:

            logger.info(
                "LANGUAGE UNCHANGED | current=%s",
                current_language,
            )

            return

        # ----------------------------------------------------
        # GET RIME CONFIGURATION
        # ----------------------------------------------------

        config = LANGUAGE_CONFIGS.get(rime_language)

        if config is None:

            logger.error(
                "MISSING RIME CONFIG | language=%s",
                rime_language,
            )

            return

        previous_language = current_language

        # ----------------------------------------------------
        # LANGUAGE SWITCH
        # ----------------------------------------------------

        logger.info("----------------------------------------------")
        logger.info(
            "LANGUAGE SWITCH | %s -> %s",
            previous_language,
            rime_language,
        )

        logger.info(
            "RIME UPDATE | language=%s | speaker=%s",
            config.language,
            config.speaker,
        )

        # ----------------------------------------------------
        # UPDATE RIME
        # ----------------------------------------------------

        try:

            session.tts.update_options(
                lang=config.language,
                speaker=config.speaker,
            )

            current_language = rime_language

            logger.info(
                "RIME UPDATE SUCCESSFUL | current=%s",
                current_language,
            )

        except Exception as error:

            logger.error(
                "RIME UPDATE FAILED | %s",
                error,
            )

        logger.info("----------------------------------------------")


    # ========================================================
    # START SESSION
    # ========================================================

    await session.start(
        room=ctx.room,
        agent=SwitchVoiceAgent(),
    )

    # ========================================================
    # CONNECT TO LIVEKIT
    # ========================================================

    await ctx.connect()

    logger.info("SWITCHVOICE CONNECTED")
    logger.info("Waiting for user...")
    logger.info("==============================================")


# ============================================================
# START APPLICATION
# ============================================================

if __name__ == "__main__":
    cli.run_app(server)