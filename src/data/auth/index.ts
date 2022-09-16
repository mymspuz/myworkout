import {Authentication, IAuthentication} from '../../domain/auth'
import {HttpStatusCode, IHttpClient} from '../protocols/http'
import {InvalidCredentialsError, UnexpectedError} from '../../domain/errors'

export class RemoteAuthentication implements IAuthentication {
    constructor(
        private readonly url: string,
        private readonly httpPostClient: IHttpClient<Authentication.Model>
    ) {}

    async auth(params: Authentication.Params): Promise<Authentication.Model> {
        const httpResponse = await this.httpPostClient.request({
            url: this.url,
            method: 'post',
            body: params
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
}