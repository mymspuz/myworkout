import React, {useEffect} from 'react'
import Spinner from '../../../presentation/components/FormLoaderStatus/Spinner'
import {useLocation, useNavigate} from 'react-router-dom'
import {makeLocalStorageAdapter} from '../../factories/cache/LocalStorageAdapter';

const MakeLogout: React.FC = () => {

    const navigate = useNavigate()

    useEffect(() => {
        makeLocalStorageAdapter().set('account', {})
        navigate('/login', {replace: true})
    }, [])

    return (
        <Spinner />
    )
}
export default MakeLogout