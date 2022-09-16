import {LocalStorageAdapter} from '../../../../infrastructure/cache/LocalStorageAdapter'

export const makeLocalStorageAdapter = (): LocalStorageAdapter =>
    new LocalStorageAdapter()