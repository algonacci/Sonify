# Use Python 3.12 slim image
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency files
COPY pyproject.toml uv.lock ./

# Install uv and dependencies
RUN pip install uv && \
    uv pip install --system -r pyproject.toml

# Copy application code
COPY app.py helpers.py ./
COPY templates/ ./templates/
COPY static/ ./static/

# Create directories for generated files
RUN mkdir -p static/audio

# Expose port
EXPOSE 8081

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8081', timeout=2)" || exit 1

# Run with gunicorn for production
CMD ["gunicorn", "--bind", "0.0.0.0:8081", "--workers", "2", "--threads", "4", "--timeout", "120", "--access-logfile", "-", "--error-logfile", "-", "app:app"]
