from pathlib import Path
from datetime import timedelta

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = "replace-this-with-a-strong-secret"
DEBUG = True
ALLOWED_HOSTS = ["*"]   # or restrict in prod

# Installed apps
INSTALLED_APPS = [
    "django.contrib.auth",         # Required for JWT (AbstractBaseUser, Permissions)
    "django.contrib.contenttypes",  # Required for DRF + auth
    "rest_framework",          # Django REST Framework
    "corsheaders",
]

# Middleware (minimal, since no sessions/CSRF if pure API + JWT)
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
]

CORS_ALLOW_ALL_ORIGINS = True  # for development

ROOT_URLCONF = "data_service.urls"

# Templates (still needed for admin/docs, but minimal setup is fine)
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [],
        },
    },
]

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
}

WSGI_APPLICATION = "data_service.wsgi.application"

# No Django ORM DB since MongoDB is external
DATABASES = {}

# DRF + JWT setup
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
}

# Internationalization (safe to leave defaults)
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# Static files (needed if serving static assets)
STATIC_URL = "static/"