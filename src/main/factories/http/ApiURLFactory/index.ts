import {URL} from '../../../../config'

export const makeApiUrl = (path: string) => {
    return `${URL}${path}`
}