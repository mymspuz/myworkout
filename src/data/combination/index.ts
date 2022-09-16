import {ICombination} from '../../domain/combination'
import {HttpHeader, HttpStatusCode, IHttpClient} from '../protocols/http';
import {RemoteCombinationModel} from '../../domain/models';
import {InvalidCredentialsError, UnexpectedError} from '../../domain/errors';

type addParams = {
    id: number
    repeats: number
    weighting: number
}
export class RemoteCombination implements ICombination {
    constructor(
        private readonly url: string,
        private readonly id: number,
        private readonly httpCombinationClient: IHttpClient<RemoteCombinationModel>,
        private readonly headerAuthorization: HttpHeader
    ) {}

    async get(): Promise<RemoteCombinationModel[]> {
        const httpResponse = await this.httpCombinationClient.request({
            url: `${this.url}${this.id}`,
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

    async add(params: addParams): Promise<void> {
        const httpResponse = await this.httpCombinationClient.request({
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