FROM ghcr.io/home-assistant/base-python:3.14-alpine3.24

COPY frontend /app/frontend

CMD ["python3", "-m", "http.server", "8765", "--directory", "/app/frontend"]
