import { makeApiUrl, makeAxiosHttpClient, makeHeaderAuthorization } from "../http"
import { URL_REPORT } from 'config'
import { RemoteReport } from 'data/report'

export const makeReport = (token: string, refresh: string): RemoteReport => {
    return new RemoteReport(
        makeApiUrl(URL_REPORT),
        makeAxiosHttpClient(),
        makeHeaderAuthorization(token, refresh)
    )
}