export type HttpRequest = {
    url: string
    method: HttpMethod
    body?: any
    headers?: any
}

export type HttpResponse<T = any> = {
    statusCode: HttpStatusCode
    body?: T
}

export interface HttpHeader {
    headers: HttpHeaderContent
}

interface HttpHeaderContent {
    'Content-type': string
    Authorization: string
}

export type HttpMethod = 'post' | 'get' | 'put' | 'delete'

export interface IHttpClient<R = any> {
    request: (data: HttpRequest) => Promise<HttpResponse<R>>
}

export enum HttpStatusCode {
    ok = 200,
    created = 201,
    noContent = 204,
    badRequest = 400,
    unauthorized = 401,
    forbidden = 403,
    notFound = 404,
    serverError = 500,
}
