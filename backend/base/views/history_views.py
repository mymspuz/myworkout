import datetime

from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from ..models import *
from ..serializers import HistorySerializer, ExercisesSerializer, history_combination


COMBINATION_RELATED = ('exercise', 'grip', 'arm_width', 'equipment')


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getHistory(request):
    user = request.user
    exercises = Exercises.objects.all().order_by('id')
    serializer_ex = ExercisesSerializer(exercises, many=True)

    # HistorySerializer обращается к комбинации и всем её частям - без select_related
    # это несколько запросов на каждый подход (тысячи запросов и секунды на ответ)
    approaches = Approach.objects \
        .filter(user=user) \
        .select_related(*('combination__' + r for r in COMBINATION_RELATED)) \
        .order_by('-approach_date')

    # Все комбинации - для выбора варианта упражнения при редактировании подхода (их единицы)
    combinations = Combinations.objects \
        .select_related(*COMBINATION_RELATED) \
        .order_by('exercise__id', 'id')

    serializer_ap = HistorySerializer(approaches, many=True)
    return Response({
        'exercises': serializer_ex.data,
        'approaches': serializer_ap.data,
        'combinations': [history_combination(c) for c in combinations],
    })


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateApproach(request):
    user = request.user
    data = request.data

    try:
        approach = Approach.objects.get(pk=data['id'], user=user)
        combination = Combinations.objects.get(pk=data['combination'])
        value = int(data['value'])
        weight = float(str(data['weight']).replace(',', '.'))
        date = datetime.date.fromisoformat(data['date'])
        if value < 1 or weight < 0:
            raise ValueError

        approach.combination = combination
        approach.approach_value = value
        approach.approach_weight = weight
        # Меняется только день, время подхода остаётся прежним. День - в местном поясе,
        # как его показывает история: замена в UTC сдвинула бы ночные подходы на сутки
        local = timezone.localtime(approach.approach_date)
        approach.approach_date = local.replace(year=date.year, month=date.month, day=date.day)
        approach.save()

        approach = Approach.objects \
            .select_related(*('combination__' + r for r in COMBINATION_RELATED)) \
            .get(pk=approach.pk)
        return Response(HistorySerializer(approach).data, status=status.HTTP_200_OK)
    except Exception:
        return Response({'error': 'Error update.'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def removeApproach(request):
    user = request.user
    data = request.data

    try:
        Approach.objects \
            .filter(pk=data['id'], user=user) \
            .delete()
        return Response({'error': None}, status=status.HTTP_200_OK)
    except Exception:
        return Response({'error': 'Error remove.'}, status=status.HTTP_400_BAD_REQUEST)
