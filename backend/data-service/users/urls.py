from django.urls import path
from .views import DataView

urlpatterns = [
    path("getData/", DataView.as_view(), name="getData"),
]
