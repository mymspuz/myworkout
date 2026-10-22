from django.urls import path

from ..views import goal_views as views


urlpatterns = [
    path('', views.getGoals, name='goals'),
    path('add/', views.addGoal, name='goal_add'),
    path('remove/', views.removeGoal, name='goal_remove'),
]
