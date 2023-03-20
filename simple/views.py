import json

from django.contrib.auth import login, logout
from django.shortcuts import render
from rest_framework import permissions, views
from rest_framework.response import Response
from rest_framework import status

from django.http import HttpResponseRedirect
from simple import serializers


def home(request, template_name='home.html'):
    context = {}

    return render(request, template_name, context)

def sign_up(request, template_name="sign up.html"):
    context = {}

    return render(request, template_name, context)

def logout_request(request):
    logout(request)
    return HttpResponseRedirect('/')

def sign_in(request, template_name="sign in.html"):
    context = {}
    if request.user.is_authenticated:
        return HttpResponseRedirect('/')

    return render(request, template_name, context)

class LoginView(views.APIView):
    # This view should be accessible also for unauthenticated users.
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = serializers.LoginSerializer(data=self.request.data,
            context={ 'request': self.request })
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        if not request.data['remember_me']:
            request.session.set_expiry(0)
        return Response(None, status=status.HTTP_202_ACCEPTED)
    
class SignUpView(views.APIView):
    # This view should be accessible also for unauthenticated users.
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = serializers.RegisterSerializer(data=self.request.data,
            context={ 'request': self.request })
        serializer.is_valid(raise_exception=True)
        serializer.save()
        print(dir(serializer))
        user = serializer.instance
        login(request, user)
        return Response(None, status=status.HTTP_202_ACCEPTED)
