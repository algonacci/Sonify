import struct
import random
from datetime import datetime
from google import genai
from google.genai import types

# List semua 30 voice options dari Gemini TTS
AVAILABLE_VOICES = [
    "Zephyr",        # Bright
    "Puck",          # Upbeat
    "Charon",        # Informative
    "Kore",          # Firm
    "Fenrir",        # Excitable
    "Leda",          # Youthful
    "Orus",          # Firm
    "Aoede",         # Breezy
    "Callirrhoe",    # Easy-going
    "Autonoe",       # Bright
    "Enceladus",     # Breathy
    "Iapetus",       # Clear
    "Umbriel",       # Easy-going
    "Algieba",       # Smooth
    "Despina",       # Smooth
    "Erinome",       # Clear
    "Algenib",       # Gravelly
    "Rasalgethi",    # Informative
    "Laomedeia",     # Upbeat
    "Achernar",      # Soft
    "Alnilam",       # Firm
    "Schedar",       # Even
    "Gacrux",        # Mature
    "Pulcherrima",   # Forward
    "Achird",        # Friendly
    "Zubenelgenubi", # Casual
    "Vindemiatrix",  # Gentle
    "Sadachbia",     # Lively
    "Sadaltager",    # Knowledgeable
    "Sulafat",       # Warm
]


def parse_audio_mime_type(mime_type: str) -> dict[str, int]:
    """Parses bits per sample and rate from an audio MIME type string.

    Assumes bits per sample is encoded like "L16" and rate as "rate=xxxxx".

    Args:
        mime_type: The audio MIME type string (e.g., "audio/L16;rate=24000").

    Returns:
        A dictionary with "bits_per_sample" and "rate" keys.
    """
    bits_per_sample = 16
    rate = 24000

    parts = mime_type.split(";")
    for param in parts:
        param = param.strip()
        if param.lower().startswith("rate="):
            try:
                rate = int(param.split("=", 1)[1])
            except Exception:
                pass
        elif param.startswith("audio/L"):
            try:
                bits_per_sample = int(param.split("L", 1)[1])
            except Exception:
                pass

    return {"bits_per_sample": bits_per_sample, "rate": rate}


def convert_to_wav(audio_data: bytes, mime_type: str) -> bytes:
    """Generates a WAV file header for the given audio data and parameters.

    Args:
        audio_data: The raw audio data as a bytes object.
        mime_type: Mime type of the audio data.

    Returns:
        A bytes object representing the WAV file with header.
    """
    parameters = parse_audio_mime_type(mime_type)
    bits_per_sample = parameters["bits_per_sample"]
    sample_rate = parameters["rate"]

    num_channels = 1
    data_size = len(audio_data)
    bytes_per_sample = bits_per_sample // 8
    block_align = num_channels * bytes_per_sample
    byte_rate = sample_rate * block_align
    chunk_size = 36 + data_size

    header = struct.pack(
        "<4sI4s4sIHHIIHH4sI",
        b"RIFF",
        chunk_size,
        b"WAVE",
        b"fmt ",
        16,
        1,
        num_channels,
        sample_rate,
        byte_rate,
        block_align,
        bits_per_sample,
        b"data",
        data_size,
    )
    return header + audio_data


def log_input(script: str, num_speakers: int, voices: list[str], log_file: str = "usage_logs.txt"):
    """Log input to text file for tracking.

    Args:
        script: The input script
        num_speakers: Number of speakers used
        voices: List of voices selected
        log_file: Path to log file
    """
    try:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        with open(log_file, "a", encoding="utf-8") as f:
            f.write(f"\n{'='*80}\n")
            f.write(f"Timestamp: {timestamp}\n")
            f.write(f"Speakers: {num_speakers}\n")
            f.write(f"Voices: {', '.join(voices)}\n")
            f.write(f"Script Length: {len(script)} characters\n")
            f.write(f"Script:\n{script}\n")
            f.write(f"{'='*80}\n")
    except Exception as e:
        print(f"Error logging: {e}")


def generate_audio(client: genai.Client, script: str, num_speakers: int = 1, model: str = "gemini-2.5-flash-preview-tts") -> tuple[bytes, str]:
    """Generate audio from script using Gemini TTS.

    Args:
        client: Gemini API client
        script: The text script to convert to audio
        num_speakers: Number of speakers (1-30)
        model: Gemini model to use

    Returns:
        Tuple of (audio_bytes, mime_type)
    """
    # Pilih voices secara random dari list
    selected_voices = random.sample(AVAILABLE_VOICES, min(num_speakers, len(AVAILABLE_VOICES)))

    # Log the input
    log_input(script, num_speakers, selected_voices)

    contents = [
        types.Content(
            role="user",
            parts=[types.Part.from_text(text=script)],
        )
    ]

    # Tentukan speech_config berdasarkan jumlah speaker
    if num_speakers == 1:
        # Single speaker - pakai voice_config dengan random voice
        speech_config = types.SpeechConfig(
            voice_config=types.VoiceConfig(
                prebuilt_voice_config=types.PrebuiltVoiceConfig(
                    voice_name=selected_voices[0]
                )
            )
        )
    else:
        # Multiple speakers - pakai multi_speaker_voice_config dengan random voices
        speaker_voice_configs = []
        for i in range(num_speakers):
            speaker_voice_configs.append(
                types.SpeakerVoiceConfig(
                    speaker=f"Speaker {i + 1}",
                    voice_config=types.VoiceConfig(
                        prebuilt_voice_config=types.PrebuiltVoiceConfig(
                            voice_name=selected_voices[i]
                        )
                    ),
                )
            )

        speech_config = types.SpeechConfig(
            multi_speaker_voice_config=types.MultiSpeakerVoiceConfig(
                speaker_voice_configs=speaker_voice_configs
            )
        )

    generate_content_config = types.GenerateContentConfig(
        temperature=1,
        response_modalities=["audio"],
        speech_config=speech_config,
    )

    audio_bytes = b""
    mime_type = None

    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        if (
            not chunk.candidates
            or not chunk.candidates[0].content
            or not chunk.candidates[0].content.parts
        ):
            continue

        part = chunk.candidates[0].content.parts[0]
        if getattr(part, "inline_data", None) and part.inline_data.data:
            if mime_type is None:
                mime_type = part.inline_data.mime_type
            audio_bytes += part.inline_data.data

    if not mime_type:
        # fallback
        mime_type = "audio/wav"
        audio_bytes = convert_to_wav(audio_bytes, mime_type)

    # kalau ternyata bukan wav, paksa ke wav
    if not mime_type.endswith("wav"):
        audio_bytes = convert_to_wav(audio_bytes, mime_type)
        mime_type = "audio/wav"

    return audio_bytes, mime_type
