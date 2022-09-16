import {AxiosHttpClient} from '../../../../infrastructure/http/axiosHttpClient/AxiosHttpClient'

export const makeAxiosHttpClient = (): AxiosHttpClient => {
    return new AxiosHttpClient()
}