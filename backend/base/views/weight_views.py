from django.db.models import Min, Max
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status

from ..models import Weight
from ..serializers import WeightRangeSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getWeightRange(request):
    user = request.user

    weight_range = Weight.objects.all()\
        .filter(user__id=user.id)\
        .aggregate(weight_min=Min('weight_value'), weight_max=Max('weight_value'))
    serializer = WeightRangeSerializer(weight_range, many=False)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addWeightItems(request):
    user = request.user
    data = request.data
    try:
        Weight.objects.create(
            weight_value=data,
            user=user
        )
        return Response({'error': None}, status=status.HTTP_201_CREATED)
    except Exception:
        return Response({'error': 'Error create.'}, status=status.HTTP_400_BAD_REQUEST)
