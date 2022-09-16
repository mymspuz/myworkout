import {IAuthentication} from '../../../domain/auth'
import {RemoteAuthentication} from '../../../data/auth'
import {makeApiUrl, makeAxiosHttpClient} from '../http'
import {URL_USERS} from '../../../config'

export const makeAuthentication = (): IAuthentication => {
    return new RemoteAuthentication(
        makeApiUrl(URL_USERS),
        makeAxiosHttpClient()
    )
}