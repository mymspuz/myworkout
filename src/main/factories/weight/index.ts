import {RemoteWeight} from '../../../data/weight'
import {makeApiUrl, makeAxiosHttpClient, makeHeaderAuthorization} from '../http'
import {URL_WEIGHT} from '../../../config'

export const makeWeight = (token: string, refresh: string): RemoteWeight => {
    return new RemoteWeight(
        makeApiUrl(URL_WEIGHT),
        makeAxiosHttpClient(),
        makeHeaderAuthorization(token, refresh)
    )
}