from django.contrib.auth.models import User
from django.db import models


class Exercises(models.Model):
    name = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return f'{self.pk}:{self.name}'

    class Meta:
        verbose_name = 'Упражнение'
        verbose_name_plural = 'Упражнения'


class Grip(models.Model):
    name = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return f'{self.pk}:{self.name}'

    class Meta:
        verbose_name = 'Хват'
        verbose_name_plural = 'Хваты'


class ArmWidth(models.Model):
    name = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return f'{self.pk}:{self.name}'

    class Meta:
        verbose_name = 'Ширина рук'
        verbose_name_plural = 'Ширины рук'


class Equipment(models.Model):
    name = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return f'{self.pk}:{self.name}'

    class Meta:
        verbose_name = 'Дополнительное оборудование'
        verbose_name_plural = 'Дополнительное оборудование'


class Combinations(models.Model):
    exercise = models.ForeignKey(Exercises, on_delete=models.PROTECT, related_name='exercise_name')
    grip = models.ForeignKey(Grip, on_delete=models.PROTECT, related_name='grips')
    arm_width = models.ForeignKey(ArmWidth, on_delete=models.PROTECT, related_name='arm_width_name')
    equipment = models.ForeignKey(Equipment, on_delete=models.PROTECT, related_name='equipment', null=True, blank=True)

    def __str__(self):
        return f'{self.exercise} / {self.grip} / {self.arm_width} / {self.equipment}'

    class Meta:
        verbose_name = 'Комбинация'
        verbose_name_plural = 'Комбинации'
        constraints = [
            models.UniqueConstraint(fields=['exercise', 'grip', 'arm_width', 'equipment'], name='All unique')
        ]


class Weight(models.Model):
    weight_value = models.FloatField(verbose_name='Значение веса')
    weight_date = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    user = models.ForeignKey(User, on_delete=models.PROTECT, verbose_name='Пользователь')

    def __str__(self):
        return str(self.weight_value)

    class Meta:
        verbose_name = 'Вес'
        verbose_name_plural = 'Веса'


class Approach(models.Model):
    combination = models.ForeignKey(Combinations, on_delete=models.PROTECT, related_name='combinations')
    approach_date = models.DateTimeField(auto_now_add=True, verbose_name='Дата подхода')
    approach_value = models.PositiveSmallIntegerField(verbose_name='Значение подхода')
    approach_weight = models.FloatField(verbose_name='Дополнительный вес')
    user = models.ForeignKey(User, on_delete=models.PROTECT, verbose_name='Пользователь')

    def __str__(self):
        return f'{self.combination} / {self.approach_value}'

    class Meta:
        verbose_name = 'Повтор'
        verbose_name_plural = 'Повторы'


class Goal(models.Model):
    # Цель действует только в своём месяце: даты нет, есть год и месяц.
    # Цели прошедших месяцев удаляются при запросе списка (goal_views.getGoals)
    exercise = models.ForeignKey(Exercises, on_delete=models.PROTECT, verbose_name='Упражнение')
    goal_value = models.PositiveIntegerField(verbose_name='Цель на месяц')
    goal_year = models.PositiveSmallIntegerField(verbose_name='Год')
    goal_month = models.PositiveSmallIntegerField(verbose_name='Месяц')
    user = models.ForeignKey(User, on_delete=models.PROTECT, verbose_name='Пользователь')

    def __str__(self):
        return f'{self.exercise} / {self.goal_value} ({self.goal_month}.{self.goal_year})'

    class Meta:
        verbose_name = 'Цель'
        verbose_name_plural = 'Цели'
        constraints = [
            models.UniqueConstraint(fields=['user', 'exercise', 'goal_year', 'goal_month'], name='One goal per month')
        ]
