from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'is_staff']


class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'is_staff', 'token']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)


class ExercisesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercises
        fields = ['id', 'name']


class CombinationsSerializer(serializers.ModelSerializer):
    exercise = serializers.StringRelatedField(many=False)
    grip = serializers.StringRelatedField(many=False)
    arm_width = serializers.StringRelatedField(many=False)
    equipment = serializers.StringRelatedField(many=False)

    class Meta:
        model = Combinations
        fields = ['id', 'exercise', 'grip', 'arm_width', 'equipment']


class WeightSerializer(serializers.ModelSerializer):
    weight_date = serializers.StringRelatedField(many=False)
    weight_value = serializers.StringRelatedField(many=False)

    class Meta:
        model = Weight
        fields = ['weight_date', 'weight_value']


class WeightRangeSerializer(serializers.ModelSerializer):
    weight_min = serializers.FloatField()
    weight_max = serializers.FloatField()

    class Meta:
        model = Weight
        fields = ['weight_min', 'weight_max']


class ReportCurrentDaySerializer(serializers.ModelSerializer):
    total = serializers.IntegerField()

    class Meta:
        model = Exercises
        fields = ['id', 'name', 'total']


def history_combination(combination):
    # Комбинация в истории - части с id и названием (TCombination на фронтенде).
    # Словарём, а не вложенным сериализатором: в истории тысячи подходов
    return {
        'id': combination.id,
        'exercise': {'id': combination.exercise.id, 'name': combination.exercise.name},
        'grip': {'id': combination.grip.id, 'name': combination.grip.name},
        'arm': {'id': combination.arm_width.id, 'name': combination.arm_width.name},
        'equipment': {'id': combination.equipment.id, 'name': combination.equipment.name} if combination.equipment else None,
    }


class HistorySerializer(serializers.ModelSerializer):
    combination = serializers.SerializerMethodField(read_only=False)
    value = serializers.IntegerField(source='approach_value')
    weight = serializers.FloatField(source='approach_weight')
    date = serializers.SerializerMethodField(read_only=False)
    visible = serializers.SerializerMethodField(read_only=False)

    class Meta:
        model = Approach
        fields = ['id', 'date', 'value', 'weight', 'combination', 'visible']

    def get_combination(self, obj):
        return history_combination(obj.combination)

    def get_date(self, obj):
        return obj.approach_date.date()

    def get_visible(self, obj):
        return True


class GoalSerializer(serializers.ModelSerializer):
    """
    Цель с прогрессом за текущий месяц.
    В context ожидаются done - {id упражнения: сумма повторов за месяц}
    и month_part - доля месяца, прошедшая к концу сегодняшнего дня.
    """
    exercise = serializers.SerializerMethodField(read_only=True)
    value = serializers.IntegerField(source='goal_value')
    done = serializers.SerializerMethodField(read_only=True)
    plan = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Goal
        fields = ['id', 'exercise', 'value', 'done', 'plan']

    def get_exercise(self, obj):
        return {'id': obj.exercise.id, 'name': obj.exercise.name}

    def get_done(self, obj):
        return self.context['done'].get(obj.exercise.id, 0)

    def get_plan(self, obj):
        # Сколько должно быть сделано к концу сегодняшнего дня при равномерном темпе
        return round(obj.goal_value * self.context['month_part'])
