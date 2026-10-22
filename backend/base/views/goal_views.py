import calendar

from django.db.models import Sum
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from ..models import *
from ..serializers import GoalSerializer, ExercisesSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getGoals(request):
    user = request.user
    today = timezone.localdate()

    # Цель живёт только в своём месяце - прошедшие удаляем здесь, отдельная задача по расписанию не нужна
    Goal.objects \
        .filter(user=user) \
        .exclude(goal_year=today.year, goal_month=today.month) \
        .delete()

    goals = Goal.objects \
        .filter(user=user, goal_year=today.year, goal_month=today.month) \
        .select_related('exercise') \
        .order_by('exercise__id')

    approach_month = Approach.objects \
        .values('combination__exercise') \
        .filter(user=user) \
        .filter(approach_date__year=today.year, approach_date__month=today.month) \
        .annotate(total=Sum('approach_value'))
    done = {a['combination__exercise']: a['total'] for a in approach_month}

    days_in_month = calendar.monthrange(today.year, today.month)[1]

    exercises = Exercises.objects.all().order_by('id')
    serializer_ex = ExercisesSerializer(exercises, many=True)
    serializer_goals = GoalSerializer(goals, many=True, context={
        'done': done,
        'month_part': today.day / days_in_month
    })
    return Response({'exercises': serializer_ex.data, 'goals': serializer_goals.data})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addGoal(request):
    user = request.user
    data = request.data
    today = timezone.localdate()

    try:
        value = int(data['value'])
        if value < 1:
            raise ValueError
        exercise = Exercises.objects.get(pk=data['exercise'])
        # Одна цель на упражнение в месяц: повторная постановка меняет число
        Goal.objects.update_or_create(
            user=user,
            exercise=exercise,
            goal_year=today.year,
            goal_month=today.month,
            defaults={'goal_value': value}
        )
        return Response({'error': None}, status=status.HTTP_201_CREATED)
    except Exception:
        return Response({'error': 'Error create.'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def removeGoal(request):
    user = request.user
    data = request.data

    try:
        Goal.objects \
            .filter(pk=data['id'], user=user) \
            .delete()
        return Response({'error': None}, status=status.HTTP_200_OK)
    except Exception:
        return Response({'error': 'Error remove.'}, status=status.HTTP_400_BAD_REQUEST)
