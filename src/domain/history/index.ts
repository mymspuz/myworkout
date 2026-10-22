import { IApproach, RemoteHistoryModel, TRemoveApproach, TUpdateApproach } from 'domain/models'

export interface IHistory {
    get(): Promise<RemoteHistoryModel>
    update(params: TUpdateApproach): Promise<IApproach>
    remove(params: TRemoveApproach): Promise<void>
}