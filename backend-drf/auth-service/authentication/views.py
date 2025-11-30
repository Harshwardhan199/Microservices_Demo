from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import AccessToken
from bson import ObjectId
from .auth_utils import users_collection
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from .auth_utils import create_user, verify_user

class RegisterView(APIView):
    permission_classes = []  # Public

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not password or not email:
            return Response({"error": "Missing fields"}, status=400)

        # Store user in Mongo
        user = create_user( email, password)
        return Response({"msg": "User registered successfully"}, status=201)

class LoginView(APIView):
    permission_classes = []  # Public

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = verify_user(email, password)
        if not user:
            return Response({"error": "Invalid credentials"}, status=401)

        # Generate JWT tokens
        refresh = RefreshToken.for_user(type("User", (), {"id": str(user["_id"])})())

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        })