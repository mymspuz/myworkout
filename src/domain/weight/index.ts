import {WeightModel} from '../models'

export interface IWeight {
    get(): Promise<WeightModel>
    add(params: number): Promise<void>
}