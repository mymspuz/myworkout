import { RemoteGoal } from 'data/goal'
import { makeApiUrl, makeAxiosHttpClient, makeHeaderAuthorization } from '../http'
import { URL_GOALS } from 'config'

export const makeGoal = (token: string, refresh: string): RemoteGoal => {
    return new RemoteGoal(
        makeApiUrl(URL_GOALS),
        makeAxiosHttpClient(),
        makeHeaderAuthorization(token, refresh)
    )
}
