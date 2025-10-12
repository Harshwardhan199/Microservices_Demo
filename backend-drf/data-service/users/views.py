from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import AccessToken
from bson import ObjectId
from .auth_utils import users_collection  # your Mongo collection

class DataView(APIView):
    permission_classes = []  # Public if you handle JWT manually

    def post(self, request):
        token_str = request.data.get("accessToken")
        if not token_str:
            return Response({"error": "Token missing"}, status=400)

        try:
            # Decode JWT
            access_token = AccessToken(token_str)
            user_id = access_token["user_id"]  # we stored str(_id) in token

            # Fetch user from MongoDB
            user = users_collection.find_one({"_id": ObjectId(user_id)})
            if not user:
                return Response({"error": "User not found"}, status=404)

            return Response({"email": user["email"]})

        except Exception as e:
            return Response({"error": "Invalid token"}, status=401)
