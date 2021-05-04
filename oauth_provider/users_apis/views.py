from django.shortcuts import render
from django.http.response import JsonResponse,HttpResponse,HttpResponsePermanentRedirect
from oauth2_provider.decorators import protected_resource
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings 
from .models import User
import requests
import json
import base64



@csrf_exempt
# @login_required()
def login_page(request, *args, **kwargs):
    if request. method == "GET":
        return HttpResponsePermanentRedirect(settings.OAUTH_LOGIN_REDIRECT_URL)
    else:
        return HttpResponse(settings.OAUTH_LOGIN_REDIRECT_URL_FOR_APIS, status=200)


@csrf_exempt
def retrive_token(request, *args, **kwargs):
    req_body=""
    try:
        req_body=json.loads(request.body.decode())
    except:
        pass
    if "code" in request.GET or "code" in req_body:
        token=""
        redirect_uri=settings.REDIRECT_URL
        if request.method == "POST":
            token=req_body["code"]
            redirect_uri=settings.API_REDIRECT_URL
        else:
            token=request.GET["code"]
        try:
            req_data = {
                "code": token,
                "grant_type":"authorization_code",
                "client_id":settings.OAUTH_CLIENT_ID,
                "client_secret":settings.OAUTH_SECRET,
                "redirect_uri":redirect_uri
            }
            headers = {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
            response = requests.post(settings.OAUTH_FETCH_TOKEN_URL, data=req_data, headers=headers)
            response=json.loads(response.text)
            print("response",response)
            if "error" not in response:
                return JsonResponse(response)
            else:
                return  JsonResponse(response, status=401)

        except Exception as e:
            print("Exception",str(e))
            return HttpResponse("Exception occurred", status=400)

        
    if "error" in request.GET:
        return HttpResponse(request.GET["error"], status=401)
    else:
        return HttpResponse("Oauth didn't sent token", status=400)


@csrf_exempt
@protected_resource()
def is_login(request, *args, **kwargs):
    return HttpResponse('yes', status=200)


@csrf_exempt
@protected_resource()
def secret_page(request, *args, **kwargs):
    return HttpResponse(str(request.user),status=200)
    # return JsonResponse({
    #     "username":request.user.username,
    #     "email":request.user.email
    # }, status=200)


@csrf_exempt
@protected_resource()
def logout(request, *args, **kwargs):   
    if request.method == "POST" and "token" in request.POST:
        token=request.POST["token"]
        try:
            req_data = {
                "token": token,
                "client_id":settings.OAUTH_CLIENT_ID,
                "client_secret":settings.OAUTH_SECRET
            }
            headers = {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
            response = requests.post(f"http://{request.get_host()}/o/revoke_token/", data=req_data, headers=headers)
            if response.status_code==200:
                return HttpResponse("success",status=200)
            else:
                return HttpResponse("failed", status=403)

        except Exception as e:
            print("Exception",str(e))
            return HttpResponse("Exception occurred", status=400)

    return HttpResponse("Invalid request",status=405)