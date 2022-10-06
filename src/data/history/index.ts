import { HttpHeader, HttpStatusCode, IHttpClient } from 'data/protocols/http'
import { InvalidCredentialsError, UnexpectedError } from 'domain/errors'
import { IHistory } from 'domain/history'
import { RemoteHistoryModel, TRemoveApproach } from 'domain/models/HistoryModel'

export class RemoteHistory implements IHistory {
    constructor(
        private readonly url: string,
        private readonly httpHistoryClient: IHttpClient,
        private readonly headerAuthorization: HttpHeader
    ) {}

    async get(): Promise<RemoteHistoryModel> {
        const httpResponse = await this.httpHistoryClient.request({
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

    async remove(params: TRemoveApproach): Promise<void> {
        const httpResponse = await this.httpHistoryClient.request({
            url: `${this.url}remove/`,
            method: 'delete',
            body: params,
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