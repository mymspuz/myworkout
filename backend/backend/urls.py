from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.views.generic import TemplateView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', TemplateView.as_view(template_name='index.html')),
    path('api/users/', include('base.urls.user_urls')),
    path('api/exercises/', include('base.urls.exercise_urls')),
    path('api/weights/', include('base.urls.weight_urls')),
    path('api/reports/', include('base.urls.report_urls')),
	path('api/history/', include('base.urls.history_urls')),
    path('api/goals/', include('base.urls.goal_urls')),

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
