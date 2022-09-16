import {RemoteExercise} from '../../../data/exercise'
import {makeApiUrl, makeAxiosHttpClient, makeHeaderAuthorization} from '../http'
import {URL_EXERCISES} from '../../../config'

export const makeExercise = (token: string): RemoteExercise => {
    return new RemoteExercise(
        makeApiUrl(URL_EXERCISES),
        makeAxiosHttpClient(),
        makeHeaderAuthorization(token)
    )
}