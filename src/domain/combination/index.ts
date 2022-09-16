import {RemoteCombinationModel} from '../models'

export interface ICombination {
    get(): Promise<RemoteCombinationModel[]>
}