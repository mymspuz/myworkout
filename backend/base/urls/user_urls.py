from django.urls import path

from ..views import user_views as views


urlpatterns = [
    path('login/', views.MyTokenObtainPairView.as_view(), name='login'),
]
