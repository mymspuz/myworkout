import {Navigate} from 'react-router-dom'
import React, {useContext} from 'react'
import {AccountContext} from '../hooks'

function PrivateRoute({ children }: { children: JSX.Element }) {
    const { getCurrentAccount } = useContext(AccountContext)

    if (getCurrentAccount) {
        return getCurrentAccount().access ? (
            children
        ) : (
            <Navigate to='/login' />
        )
    } else {
        return null
    }
}

export default PrivateRoute