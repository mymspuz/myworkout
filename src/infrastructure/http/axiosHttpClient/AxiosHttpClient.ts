import {HttpJWTRefresh, HttpRequest, HttpResponse, HttpStatusCode, IHttpClient} from '../../../data/protocols/http'
import axios, {AxiosResponse} from 'axios'
import jwt_decode from 'jwt-decode'
import {makeApiUrl} from '../../../main/factories/http';
import {makeLocalStorageAdapter} from '../../../main/factories/cache/LocalStorageAdapter';

export class AxiosHttpClient implements IHttpClient {
    private static async getResponse(data: HttpRequest): Promise<HttpResponse> {
        let axiosResponse: AxiosResponse
        try {
            axiosResponse = await axios.request({
                url: data.url,
                method: data.method,
                data: data.body,
                headers: data.headers
            })
        } catch (error: any) {
            axiosResponse = error.response
        }
        return {
            statusCode: axiosResponse.status,
            body: axiosResponse.data
        }
    }

    async request (data: HttpRequest): Promise<HttpResponse> {
        if (data?.headers?.Authorization) {
            const token = data.headers.Authorization.replace('Bearer ', '')
            const jwt: HttpJWTRefresh = jwt_decode(token)
            if (jwt.exp < Date.now() / 1000) {
                const refresh = await AxiosHttpClient.getResponse({
                    url: makeApiUrl('token/refresh/'),
                    method: 'post',
                    body: {'refresh': data.headers.refresh},
                    headers: data.headers
                })
                switch (refresh.statusCode) {
                    case HttpStatusCode.unauthorized:
                        makeLocalStorageAdapter().set('account', {})
                        return {
                            statusCode: refresh.statusCode,
                            body: refresh.body
                        }
                    case HttpStatusCode.ok:
                        data.headers.Authorization = `Bearer ${refresh.body.access}`
                        const oldLocalStorage = makeLocalStorageAdapter().get('account')
                        makeLocalStorageAdapter().set('account', {...oldLocalStorage, 'access': refresh.body.access})
                }
            }
        }

        return AxiosHttpClient.getResponse(data)
    }
}