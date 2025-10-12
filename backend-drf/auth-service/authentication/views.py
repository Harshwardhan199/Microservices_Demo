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

# class DataView(APIView):
#     permission_classes = []  # Public if you handle JWT manually

#     def post(self, request):
#         token_str = request.data.get("accessToken")
#         if not token_str:
#             return Response({"error": "Token missing"}, status=400)

#         try:
#             # Decode JWT
#             access_token = AccessToken(token_str)
#             user_id = access_token["user_id"]  # we stored str(_id) in token

#             # Fetch user from MongoDB
#             user = users_collection.find_one({"_id": ObjectId(user_id)})
#             if not user:
#                 return Response({"error": "User not found"}, status=404)

#             return Response({"email": user["email"]})

#         except Exception as e:
#             return Response({"error": "Invalid token"}, status=401)

