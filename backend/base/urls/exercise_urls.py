from django.urls import path

from ..views import exercise_views as views


urlpatterns = [
    path('', views.getExercises, name='exercises'),
    path('<int:id_exercise>', views.getCombinationsForExercises, name='combinations_for_exercises'),
    path('add/', views.addRepeats, name='add_repeats')
]
