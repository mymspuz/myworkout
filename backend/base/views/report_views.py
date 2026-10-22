from django.db.models import Sum
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..models import *
from ..serializers import ReportCurrentDaySerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getReportCurrentDay(request):
    user = request.user
    exercises = Exercises.objects.all()
    approach = Approach.objects\
        .values('combination__exercise')\
        .filter(user=user)\
        .filter(approach_date__date=timezone.localdate())\
        .annotate(total=Sum('approach_value'))
    result = []
    for e in exercises:
        temp = {'id': e.id, 'name': e.name, 'total': 0}
        for a in approach:
            if e.id == a['combination__exercise']:
                temp['total'] = a['total']
        result.append(temp)

    serializer = ReportCurrentDaySerializer(result, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getReportSum(request, id_exercise):
    user = request.user

    result = {
        'all': 0,
        'bestMonth': {'month': 0, 'year': 0, 'total': 0},
        'bestDay': {'day': 0, 'month': 0, 'year': 0, 'total': 0},
        'currentMonth': 0
    }

    approach_year = Approach.objects \
        .values('combination__exercise__id') \
        .filter(user=user)\
        .filter(combination__exercise=id_exercise)\
        .annotate(total=Sum('approach_value'))
    if approach_year:
        result['all'] = approach_year[0]['total']

    approach_best_month = Approach.objects \
        .values('approach_date__year', 'approach_date__month') \
        .filter(user=user) \
        .filter(combination__exercise=id_exercise) \
        .annotate(total=Sum('approach_value'))\
        .order_by('-total')
    if approach_best_month:
        result['bestMonth']['month'] = approach_best_month[0]['approach_date__month']
        result['bestMonth']['year'] = approach_best_month[0]['approach_date__year']
        result['bestMonth']['total'] = approach_best_month[0]['total']

    approach_best_day = Approach.objects \
        .values('approach_date__year', 'approach_date__month', 'approach_date__day') \
        .filter(user=user) \
        .filter(combination__exercise=id_exercise) \
        .annotate(total=Sum('approach_value'))\
        .order_by('-total')
    if approach_best_day:
        result['bestDay']['day'] = approach_best_day[0]['approach_date__day']
        result['bestDay']['month'] = approach_best_day[0]['approach_date__month']
        result['bestDay']['year'] = approach_best_day[0]['approach_date__year']
        result['bestDay']['total'] = approach_best_day[0]['total']

    approach_current_month = Approach.objects \
        .values('combination__exercise__id') \
        .filter(user=user)\
        .filter(combination__exercise=id_exercise)\
        .filter(approach_date__year=timezone.localdate().year, approach_date__month=timezone.localdate().month)\
        .annotate(total=Sum('approach_value'))
    if approach_current_month:
        result['currentMonth'] = approach_current_month[0]['total']

    return Response(result)
