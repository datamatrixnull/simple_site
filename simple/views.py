import json

from django.contrib.auth import login
from django.shortcuts import render
from rest_framework import permissions, views
from rest_framework.response import Response
from rest_framework import status

from simple import serializers


def home(request, template_name='home.html'):
    context = {}

    return render(request, template_name, context)

def sign_up(request, template_name="sign up.html"):
    context = {}

    return render(request, template_name, context)

def sign_in(request, template_name="sign in.html"):
    context = {}

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

        return Response(None, status=status.HTTP_202_ACCEPTED)
