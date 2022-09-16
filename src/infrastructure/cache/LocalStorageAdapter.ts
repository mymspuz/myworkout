import { IGetStorage, ISetStorage } from '../../data/protocols/cache'
import {Authentication} from '../../domain/auth'

export class LocalStorageAdapter implements IGetStorage, ISetStorage {
    set(key: string, value: object): void {
        if (Object.keys(value).length !== 0) {
            localStorage.setItem(key, JSON.stringify(value))
        } else {
            localStorage.removeItem(key)
        }
    }

    get(key: string): Authentication.Model {
        const candidate = JSON.parse(String(localStorage.getItem(key)))
        const temp: Authentication.Model = {
            access: "",
            email: "",
            token: "",
            is_staff: false,
            refresh: "",
            username: ""
        }
        if (candidate)
            return candidate
        else
            return temp
    }
}