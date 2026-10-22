from django.db import transaction
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from ..models import *
from ..serializers import ExercisesSerializer, CombinationsSerializer


# Больше кругов за раз - почти наверняка опечатка (300 вместо 3)
MAX_ROUNDS = 20


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getExercises(request):
    exercises = Exercises.objects.all().order_by('id')
    serializer = ExercisesSerializer(exercises, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCombinations(request):
    combinations = Combinations.objects.all()

    serializer = CombinationsSerializer(combinations, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCombinationsForExercises(request, id_exercise):
    combinations = Combinations.objects.filter(exercise=id_exercise)

    serializer = CombinationsSerializer(combinations, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addRepeats(request):
    user = request.user
    data = request.data

    try:
        combination = Combinations.objects.get(pk=data['id'])
        # Круги: одинаковые подходы подряд - по записи на каждый круг.
        # Старые клиенты rounds не передают - это один круг
        rounds = int(data.get('rounds', 1))
        if not 1 <= rounds <= MAX_ROUNDS:
            raise ValueError
        # Все круги или ни одного: при ошибке на середине не остаётся неполного набора
        with transaction.atomic():
            for _ in range(rounds):
                Approach.objects.create(
                    combination=combination,
                    approach_value=data['repeats'],
                    approach_weight=data['weighting'],
                    user=user
                )
        return Response({'error': None, 'created': rounds}, status=status.HTTP_201_CREATED)
    except Exception:
        return Response({'error': 'Error create.'}, status=status.HTTP_400_BAD_REQUEST)
