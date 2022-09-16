import {RemoteCombination} from '../../../data/combination'
import {makeApiUrl, makeAxiosHttpClient, makeHeaderAuthorization} from '../http'
import {URL_EXERCISES} from '../../../config'

export const makeCombination = (token: string, id: number): RemoteCombination => {
    return new RemoteCombination(
        makeApiUrl(URL_EXERCISES),
        id,
        makeAxiosHttpClient(),
        makeHeaderAuthorization(token)
    )
}