# -----------------------------------------------------------------------
# Append/merge these into config/settings.py -- kept as a separate file
# here so you can diff it against your generated settings.py cleanly
# instead of me overwriting Django's boilerplate.
# -----------------------------------------------------------------------
import dj_database_url
from decouple import config, Csv

# django-admin startproject hardcodes these three directly in settings.py --
# REPLACE those generated lines with these (don't just append; you'll end
# up with two conflicting SECRET_KEY/DEBUG/ALLOWED_HOSTS definitions).
SECRET_KEY = config("SECRET_KEY")
DEBUG = config("DEBUG", default=False, cast=bool)
ALLOWED_HOSTS = config("ALLOWED_HOSTS", default="localhost,127.0.0.1", cast=Csv())

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # third-party
    "rest_framework",
    "corsheaders",
    "django_filters",
    "django_ratelimit",
    "cloudinary_storage",
    "cloudinary",
    # local
    "catalog",
    "inquiries",
    "portfolio_app",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",  # serves Django's own static files (admin CSS/JS) on Render
    "corsheaders.middleware.CorsMiddleware",  # must sit above CommonMiddleware
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    config("FRONTEND_URL", default="http://localhost:3000"),
]
CSRF_TRUSTED_ORIGINS = CORS_ALLOWED_ORIGINS

REST_FRAMEWORK = {
    "DEFAULT_FILTER_BACKENDS": ["django_filters.rest_framework.DjangoFilterBackend"],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
}

# django-ratelimit reads/writes counters through Django's cache framework --
# it needs the SAME cache backend configured below to actually enforce
# limits across requests (locmem is per-process, fine for local dev; a
# single free Render instance is one process too, so it still works there --
# swap LOCATION for an Upstash Redis URL only if you scale to multiple
# workers/instances later).
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "hiroshyma-cache",
    }
}
RATELIMIT_USE_CACHE = "default"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"  # noqa: F821 -- BASE_DIR defined earlier in real settings.py

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"  # noqa: F821
STORAGES = {
    "staticfiles": {"BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage"},
}

# --- Database -----------------------------------------------------------
# Local dev falls back to individual DB_* vars from .env; production
# (Render) sets a single DATABASE_URL from Neon instead.
if config("DATABASE_URL", default=None):
    DATABASES = {
        "default": dj_database_url.config(
            default=config("DATABASE_URL"),
            conn_max_age=600,
            ssl_require=not DEBUG,  # noqa: F821 -- DEBUG defined earlier in real settings.py
        )
    }

# --- Cloudinary (image storage) -----------------------------------------
CLOUDINARY_STORAGE = {
    "CLOUD_NAME": config("CLOUDINARY_CLOUD_NAME", default=""),
    "API_KEY": config("CLOUDINARY_API_KEY", default=""),
    "API_SECRET": config("CLOUDINARY_API_SECRET", default=""),
}
if config("CLOUDINARY_CLOUD_NAME", default=""):
    DEFAULT_FILE_STORAGE = "cloudinary_storage.storage.MediaCloudinaryStorage"

# --- Production-only hardening -------------------------------------------
if not config("DEBUG", default=True, cast=bool):
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = "DENY"
