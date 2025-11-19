# 🎵 Sonify - AI Voice Generator

Transform text into natural speech with AI using Google's Gemini TTS API.

![Sonify Banner](https://img.shields.io/badge/Powered%20by-Gemini%20TTS-4285F4?style=for-the-badge&logo=google)
![Python](https://img.shields.io/badge/Python-3.12+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

## ✨ Features

- 🎙️ **Multi-Speaker Support**: Generate conversations with 1-30 speakers
- 🌍 **Multi-Language**: Support for Japanese, English, Chinese, Indonesian & more
- 🎨 **30+ Voice Options**: Random voice selection from premium voice library
- 🔄 **Auto-Detection**: Automatically detects number of speakers from script
- 📱 **Modern UI**: Beautiful SaaS-style interface with glass morphism
- 🌐 **i18n Ready**: Interface available in English, Indonesian, and Chinese
- 💾 **Download & Play**: Listen in-browser or download generated audio
- 📊 **Usage Logging**: Track all generations for analytics

## 🚀 Quick Start

### Prerequisites

- Python 3.12+
- Google Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/Sonify.git
cd Sonify
```

2. **Set up environment**
```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your Gemini API key
# GEMINI_API_KEY=your_api_key_here
```

3. **Install dependencies**
```bash
# Using uv (recommended)
pip install uv
uv pip install -r pyproject.toml

# Or using pip
pip install -r pyproject.toml
```

4. **Run the application**
```bash
# Development mode
python app.py

# Production mode with gunicorn
gunicorn --bind 0.0.0.0:8000 --workers 2 app:app
```

5. **Access the app**
Open your browser and navigate to `http://localhost:8081`

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

1. **Set up environment**
```bash
cp .env.example .env
# Edit .env with your API key
```

2. **Build and run**
```bash
docker-compose up -d
```

3. **View logs**
```bash
docker-compose logs -f
```

4. **Stop the application**
```bash
docker-compose down
```

### Using Docker directly

```bash
# Build image
docker build -t sonify:latest .

# Run container
docker run -d \
  -p 8081:8081 \
  -e GEMINI_API_KEY=your_api_key_here \
  --name sonify \
  sonify:latest

# View logs
docker logs -f sonify

# Stop container
docker stop sonify
docker rm sonify
```

## 📖 Usage

### Single Speaker
```
Hello everyone! Welcome to my podcast about AI technology.
```

### Multiple Speakers
```
Speaker 1: こんにちは！今日は何をしますか？
Speaker 2: 映画を見に行きましょう！
Speaker 1: いいですね！何時に行きますか？
```

### Custom Speaker Count
Select "Custom" and enter any number from 1-30 speakers.

## 🏗️ Project Structure

```
Sonify/
├── app.py                 # Flask application & routes
├── helpers.py            # Audio generation utilities
├── static/
│   ├── script.js         # Client-side logic & i18n
│   └── audio/            # Generated audio files
├── templates/
│   └── index.html        # Modern SaaS UI
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker Compose setup
├── pyproject.toml        # Python dependencies
├── .env.example          # Environment template
└── README.md             # This file
```

## 🔧 Configuration

### Environment Variables

- `GEMINI_API_KEY`: Your Google Gemini API key (required)
- `FLASK_ENV`: Set to `production` for deployment

### Gunicorn Settings

Adjust in `Dockerfile` or command line:
- `--workers`: Number of worker processes (default: 2)
- `--threads`: Threads per worker (default: 4)
- `--timeout`: Request timeout in seconds (default: 120)

## 🌐 Deployment Options

### Cloud Platforms

#### Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### Render
1. Connect your GitHub repository
2. Set environment variable: `GEMINI_API_KEY`
3. Deploy with Docker

#### Google Cloud Run
```bash
# Build and push
gcloud builds submit --tag gcr.io/PROJECT_ID/sonify

# Deploy
gcloud run deploy sonify \
  --image gcr.io/PROJECT_ID/sonify \
  --platform managed \
  --set-env-vars GEMINI_API_KEY=your_key
```

#### Heroku
```bash
# Login
heroku login
heroku create your-app-name

# Set config
heroku config:set GEMINI_API_KEY=your_key

# Deploy
git push heroku main
```

## 🛠️ Tech Stack

- **Backend**: Flask (Python)
- **AI/ML**: Google Gemini 2.5 Flash TTS
- **Frontend**: Tailwind CSS, Vanilla JavaScript
- **Production**: Gunicorn WSGI Server
- **Containerization**: Docker & Docker Compose

## 📝 API Limits

Google Gemini API has the following limits:
- Free tier: 15 requests per minute
- Rate limits may vary based on your API plan

## 🔒 Security Notes

- Never commit your `.env` file
- Keep your `GEMINI_API_KEY` secret
- Generated audio files are stored locally (consider cleanup)
- Usage logs may contain sensitive information

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google Gemini API for powerful TTS capabilities
- Flask framework for simple web development
- Tailwind CSS for beautiful styling
- Inter font by Rasmus Andersson

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Made with ❤️ using Claude Code
