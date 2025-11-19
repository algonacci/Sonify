from dotenv import load_dotenv
load_dotenv()

from flask import Flask, render_template, request, send_file, url_for
from google import genai
import os
import uuid
from pathlib import Path

from helpers import generate_audio

app = Flask(__name__)

client = genai.Client(
    api_key=os.environ.get("GEMINI_API_KEY"),
)

MODEL = "gemini-2.5-flash-preview-tts"

# Ensure static/audio directory exists
AUDIO_DIR = Path(__file__).parent / "static" / "audio"
AUDIO_DIR.mkdir(parents=True, exist_ok=True)


@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        script = request.form.get("script", "").strip()
        num_speakers = int(request.form.get("num_speakers", "1"))

        if not script:
            return render_template(
                "index.html",
                error="Teks tidak boleh kosong",
                script=script,
                num_speakers=str(num_speakers)
            )

        # Generate audio
        audio_bytes, _ = generate_audio(client, script, num_speakers, MODEL)

        # Save to static folder with unique filename
        filename = f"sonify_{uuid.uuid4().hex[:8]}.wav"
        filepath = AUDIO_DIR / filename

        with open(filepath, "wb") as f:
            f.write(audio_bytes)

        # Return page with audio player
        audio_url = url_for('static', filename=f'audio/{filename}')
        return render_template(
            "index.html",
            audio_url=audio_url,
            script=script,
            num_speakers=str(num_speakers)
        )

    return render_template("index.html")


@app.route("/download/<filename>")
def download(filename):
    """Download audio file"""
    filepath = AUDIO_DIR / filename
    if filepath.exists():
        return send_file(
            filepath,
            mimetype="audio/wav",
            as_attachment=True,
            download_name=filename
        )
    return "File not found", 404
    

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8081, debug=False)
