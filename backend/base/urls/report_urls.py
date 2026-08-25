from django.urls import path

from ..views import report_views as views


urlpatterns = [
    path('', views.getReportCurrentDay, name='report_current_day'),
    path('<int:id_exercise>', views.getReportSum, name='report_sum'),
]
