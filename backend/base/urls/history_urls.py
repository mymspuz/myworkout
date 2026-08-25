from django.urls import path

from ..views import history_views as views


urlpatterns = [
    path('', views.getHistory, name='history'),
    path('remove/', views.removeApproach, name='remove_history'),
]
