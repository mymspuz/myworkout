import {HttpHeader} from '../../../../data/protocols/http'

export const makeHeaderAuthorization = (token: string): HttpHeader => {
    return {
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    }
}