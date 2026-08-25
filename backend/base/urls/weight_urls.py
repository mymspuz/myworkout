from django.urls import path

from ..views import weight_views as views


urlpatterns = [
    path('', views.getWeightRange, name='weight'),
    path('add/', views.addWeightItems, name='weight_add')
]
