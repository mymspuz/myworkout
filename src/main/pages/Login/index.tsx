import React, {useContext} from 'react'
import {makeLoginValidation} from './LoginValidation'
import {makeAuthentication} from '../../factories/auth'
import Login from '../../../presentation/pages/Login'
import M from 'materialize-css'
import {AccountContext} from '../../../presentation/hooks'
import {Navigate} from 'react-router-dom'

const MakeLogin: React.FC = () => {
    const validationComposite = makeLoginValidation()
    const remoteAuthentication = makeAuthentication()

    M.AutoInit()

    const { getCurrentAccount } = useContext(AccountContext)

    return !(getCurrentAccount) || getCurrentAccount().access ? (
            <Navigate to='/' />
        ) : (
            <Login
                validation={validationComposite}
                authentication={remoteAuthentication}
            />
        )
}

export default MakeLogin