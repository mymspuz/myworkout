import { RemoteHistory } from 'data/history'
import { makeApiUrl, makeAxiosHttpClient, makeHeaderAuthorization } from '../http'
import { URL_HISTORY } from 'config'

export const makeHistory = (token: string, refresh: string): RemoteHistory => {
    return new RemoteHistory(
        makeApiUrl(URL_HISTORY),
        makeAxiosHttpClient(),
        makeHeaderAuthorization(token, refresh)
    )
}