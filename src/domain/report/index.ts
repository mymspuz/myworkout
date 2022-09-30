import { ReportCurrentDayModel, ReportSumModel } from '../../domain/models/ReportModel'

export interface IReport {
    getCurrentDay(): Promise<ReportCurrentDayModel[]>
    getBest(id: number): Promise<ReportSumModel>
}