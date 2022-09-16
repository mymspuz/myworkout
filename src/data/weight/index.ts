import {IWeight} from '../../domain/weight'
import {HttpHeader, HttpStatusCode, IHttpClient} from '../protocols/http'
import {WeightModel} from '../../domain/models'
import {InvalidCredentialsError, UnexpectedError} from '../../domain/errors'

export class RemoteWeight implements IWeight {
    constructor(
        private readonly url: string,
        private readonly httpWeightClient: IHttpClient<WeightModel>,
        private readonly headerAuthorization: HttpHeader
    ) {}

    async get(): Promise<WeightModel> {
        const httpResponse = await this.httpWeightClient.request({
            url: this.url,
            method: 'get',
            headers: this.headerAuthorization.headers
        })

        switch (httpResponse.statusCode) {
            case HttpStatusCode.ok:
                // @ts-ignore
                return httpResponse.body
            case HttpStatusCode.unauthorized:
                throw new InvalidCredentialsError()
            default:
                throw new UnexpectedError()
        }
    }

    async add(params: number): Promise<void> {
        const httpResponse = await this.httpWeightClient.request({
            url: `${this.url}add/`,
            method: 'post',
            body: params,
            headers: this.headerAuthorization.headers
        })

        switch (httpResponse.statusCode) {
            case HttpStatusCode.created:
                // @ts-ignore
                return httpResponse.body
            case HttpStatusCode.unauthorized:
                throw new InvalidCredentialsError()
            default:
                throw new UnexpectedError()
        }
    }
}