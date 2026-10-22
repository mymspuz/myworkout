import { RemoteGoalModel, TAddGoal, TRemoveGoal } from 'domain/models'

export interface IGoal {
    get(): Promise<RemoteGoalModel>
    add(params: TAddGoal): Promise<void>
    remove(params: TRemoveGoal): Promise<void>
}
