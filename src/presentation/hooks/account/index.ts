import {createContext} from 'react'
import {AccountModel} from '../../../domain/models'

type AccountProps = {
    setCurrentAccount?: (account: AccountModel) => void
    getCurrentAccount?: () => AccountModel
}

export default createContext<AccountProps>({})