import os

class Settings:
    NVIDIA_API_KEY: str = os.getenv("NVIDIA_API_KEY", "")

settings = Settings()
