import datetime

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from ..models import *
from ..serializers import HistorySerializer, ExercisesSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getHistory(request):
    user = request.user
    exercises = Exercises.objects.all().order_by('id')
    serializer_ex = ExercisesSerializer(exercises, many=True)

    approaches = Approach.objects \
        .filter(user=user) \
        .order_by('-approach_date')

    serializer_ap = HistorySerializer(approaches, many=True)
    return Response({'exercises': serializer_ex.data, 'approaches': serializer_ap.data})


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
