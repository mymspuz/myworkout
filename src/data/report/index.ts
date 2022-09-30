import { HttpHeader, HttpStatusCode, IHttpClient } from 'data/protocols/http'
import { ReportCurrentDayModel, ReportSumModel } from 'domain/models/ReportModel'
import { IReport } from 'domain/report'
import { InvalidCredentialsError, UnexpectedError } from 'domain/errors'

export class RemoteReport implements IReport {
    constructor(
        private readonly url: string,
        private readonly httpReportClient: IHttpClient,
        private readonly headerAuthorization: HttpHeader
    ) {}

    async getCurrentDay(): Promise<ReportCurrentDayModel[]> {
        const httpResponse = await this.httpReportClient.request({
            url: this.url,
            method: 'get',
            headers: this.headerAuthorization.headers
        })

        switch (httpResponse.statusCode) {
            case HttpStatusCode.ok:
                return httpResponse.body
            case HttpStatusCode.unauthorized:
                throw new InvalidCredentialsError()
            default:
                throw new UnexpectedError()
        }
    }

    async getBest(id: number): Promise<ReportSumModel> {
        const httpResponse = await this.httpReportClient.request({
            url: `${this.url}${id}`,
            method: 'get',
            headers: this.headerAuthorization.headers
        })
        switch (httpResponse.statusCode) {
            case HttpStatusCode.ok:
                return httpResponse.body
            case HttpStatusCode.unauthorized:
                throw new InvalidCredentialsError()
            default:
                throw new UnexpectedError()
        }
    }

}