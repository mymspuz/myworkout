import {HttpHeader, HttpStatusCode, IHttpClient} from '../protocols/http'
import { IExercise } from '../../domain/exercise'
import {InvalidCredentialsError, UnexpectedError} from '../../domain/errors'
import {ExerciseModel} from '../../domain/models'

export class RemoteExercise implements IExercise {
    constructor(
        private readonly url: string,
        private readonly httpGetClient: IHttpClient<ExerciseModel[]>,
        private readonly headerAuthorization: HttpHeader
    ) {}

    async getAll(): Promise<ExerciseModel[]> {
        const httpResponse = await this.httpGetClient.request({
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
}