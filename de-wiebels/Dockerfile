FROM ghcr.io/home-assistant/base-python:3.14-alpine3.24

COPY frontend /app/frontend
COPY backend /app/backend

CMD ["python3", "/app/backend/server.py"]
