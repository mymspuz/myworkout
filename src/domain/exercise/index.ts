import { ExerciseModel } from '../models'

export interface IExercise {
    getAll(): Promise<ExerciseModel[]>
}