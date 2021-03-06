"""
Django settings for oauth_client project.

Generated by 'django-admin startproject' using Django 3.0.5.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.0/ref/settings/
"""

import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'o(usvf8fb^to092uvd0)2l-_up0t&@k!@6n^c&*vl2_&e_%4!='

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True
CORS_ORIGIN_ALLOW_ALL = True
ALLOWED_HOSTS = []

# LOGIN_URL='http://127.0.0.1:8000/o/authorize/?response_type=code&client_id=aaaa&redirect_uri=http://localhost:8000/secret_page/'
OAUTH_FETCH_TOKEN_URL="http://127.0.0.1:8000/o/token/"
OAUTH_CLIENT_ID="aaaa"
OAUTH_SECRET="bbbb"
OAUTH_HOST="http://127.0.0.1:8000"
REDIRECT_URL="http://localhost:7000/retrive_token/"
API_REDIRECT_URL="http://localhost:3000/"
OAUTH_LOGIN_REDIRECT_URL=f"{OAUTH_HOST}/o/authorize/?response_type=code&client_id={OAUTH_CLIENT_ID}&redirect_uri={REDIRECT_URL}"
OAUTH_LOGIN_REDIRECT_URL_FOR_APIS=f"{OAUTH_HOST}/o/authorize/?response_type=code&client_id={OAUTH_CLIENT_ID}&redirect_uri={API_REDIRECT_URL}"



# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'oauth2_provider',
    "demo"
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'oauth2_provider.middleware.OAuth2TokenMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]



OAUTH2_PROVIDER = {
    'RESOURCE_SERVER_INTROSPECTION_URL': f'{OAUTH_HOST}/o/introspect/',
    'RESOURCE_SERVER_INTROSPECTION_CREDENTIALS': (OAUTH_CLIENT_ID,OAUTH_SECRET),
    "OIDC_ENABLED": True,
    "SCOPES": {
        "openid": "OpenID Connect scope",
    },
}






ROOT_URLCONF = 'oauth_client.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'oauth_client.wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}


# Password validation
# https://docs.djangoproject.com/en/3.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/

STATIC_URL = '/static/'
