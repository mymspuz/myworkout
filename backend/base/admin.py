from django.contrib import admin
from .models import *


class CombinationsAdmin(admin.ModelAdmin):
    list_display = ('exercise', 'grip', 'arm_width', 'equipment', )


class ApproachAdmin(admin.ModelAdmin):
    date_hierarchy = 'approach_date'
    list_display = ('approach_date',
                    'get_exercise',
                    'get_grip',
                    'get_arm_width',
                    'get_equipment',
                    'approach_value',
                    'approach_weight',
                    'user',
                    )

    @admin.display(description='Exercise')
    def get_exercise(self, obj):
        temp = obj.combination.__str__()
        temp = temp.split('/')[0].split(':')[1]
        return temp

    @admin.display(description='Grip')
    def get_grip(self, obj):
        temp = obj.combination.__str__()
        temp = temp.split('/')[1].split(':')[1]
        return temp

    @admin.display(description='arm_width')
    def get_arm_width(self, obj):
        temp = obj.combination.__str__()
        temp = temp.split('/')[2].split(':')[1]
        return temp

    @admin.display(description='equipment')
    def get_equipment(self, obj):
        temp = obj.combination.__str__()
        temp = temp.split('/')[3].strip()
        if temp == 'None':
            temp = '-'
        else:
            temp = temp.split(':')[1]
        return temp


class WeightAdmin(admin.ModelAdmin):
    list_display = ('weight_date', 'weight_value', 'user', )


class GoalAdmin(admin.ModelAdmin):
    list_display = ('goal_year', 'goal_month', 'exercise', 'goal_value', 'user', )


admin.site.register(Exercises)
admin.site.register(Grip)
admin.site.register(ArmWidth)
admin.site.register(Equipment)
admin.site.register(Combinations, CombinationsAdmin)
admin.site.register(Weight, WeightAdmin)
admin.site.register(Approach, ApproachAdmin)
admin.site.register(Goal, GoalAdmin)

