import { RemoteHistoryModel, TRemoveApproach } from 'domain/models'

export interface IHistory {
    get(): Promise<RemoteHistoryModel>
    remove(params: TRemoveApproach): Promise<void>
}