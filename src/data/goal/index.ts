import { HttpHeader, HttpStatusCode, IHttpClient } from 'data/protocols/http'
import { InvalidCredentialsError, UnexpectedError } from 'domain/errors'
import { IGoal } from 'domain/goal'
import { RemoteGoalModel, TAddGoal, TRemoveGoal } from 'domain/models/GoalModel'

export class RemoteGoal implements IGoal {
    constructor(
        private readonly url: string,
        private readonly httpGoalClient: IHttpClient,
        private readonly headerAuthorization: HttpHeader
    ) {}

    async get(): Promise<RemoteGoalModel> {
        const httpResponse = await this.httpGoalClient.request({
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

    async add(params: TAddGoal): Promise<void> {
        const httpResponse = await this.httpGoalClient.request({
            url: `${this.url}add/`,
            method: 'post',
            body: params,
            headers: this.headerAuthorization.headers
        })

        switch (httpResponse.statusCode) {
            case HttpStatusCode.created:
                return httpResponse.body
            case HttpStatusCode.unauthorized:
                throw new InvalidCredentialsError()
            default:
                throw new UnexpectedError()
        }
    }

    async remove(params: TRemoveGoal): Promise<void> {
        const httpResponse = await this.httpGoalClient.request({
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
