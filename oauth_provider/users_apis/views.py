from django.shortcuts import render
from django.http.response import JsonResponse,HttpResponse,HttpResponsePermanentRedirect
from oauth2_provider.decorators import protected_resource
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings 
import requests
import json
import base64



@csrf_exempt
# @login_required()
def login_page(request, *args, **kwargs):
    return HttpResponsePermanentRedirect(settings.OAUTH_LOGIN_REDIRECT_URL)

@csrf_exempt
def retrive_token(request, *args, **kwargs):
    if "code" in request.GET:
        token=request.GET["code"]
        try:
            req_data = {
                "code": token,
                "grant_type":"authorization_code",
                "client_id":settings.OAUTH_CLIENT_ID,
                "client_secret":settings.OAUTH_SECRET
            }
            headers = {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
            response = requests.post(settings.OAUTH_FETCH_TOKEN_URL, data=req_data, headers=headers)
            print(response.text)

        except Exception as e:
            print(str(e))
            return HttpResponse("Exception occurred", status=400)

        return JsonResponse(json.loads(response.text))
    if "error" in request.GET:
        return HttpResponse(request.GET["error"], status=401)
    else:
        return HttpResponse("Oauth didn't sent token", status=400)


@csrf_exempt
@protected_resource()
def secret_page(request, *args, **kwargs):
    return HttpResponse('Secret contents!', status=200)