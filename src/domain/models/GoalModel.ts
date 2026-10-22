import { ExerciseModel } from './ExerciseModel'

export interface IGoalItem {
    id: number
    exercise: ExerciseModel
    value: number
    // сделано за текущий месяц
    done: number
    // сколько должно быть сделано к концу сегодняшнего дня при равномерном темпе
    plan: number
}

export interface RemoteGoalModel {
    exercises: ExerciseModel[]
    goals: IGoalItem[]
}

export type TAddGoal = {
    exercise: number
    value: number
}

export type TRemoveGoal = {
    id: number
}
