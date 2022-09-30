export type ReportCurrentDayModel = {
    id: number
    name: string
    total: number
}

export type ReportSumModel = {
    all: number
    bestMonth: IReportBest
    bestDay: IReportBest
    currentMonth: number
}

export interface IReportBest {
    day?: number
    month: number
    year: number
    total: number
}