import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import {AccountContext} from '../../presentation/hooks'
import {
            getCurrentAccountAdapter,
            setCurrentAccountAdapter
        } from '../adapters/CurrentAccountAdapter'
import M from 'materialize-css'

import PrivateRoute from '../../presentation/routes/private.routes'
import MakeLogin from '../../main/pages/Login'
import MakeMain from '../pages/Main'
import MakeLogout from '../pages/Logout'
import MakeWeight from '../pages/Weight'
import MakeCombination from '../pages/Combination'

const MainRouter: React.FC = () => {

    M.AutoInit()

    return (
        <>
            <AccountContext.Provider
                value={{
                    setCurrentAccount: setCurrentAccountAdapter,
                    getCurrentAccount: getCurrentAccountAdapter
                }}
            >
                <BrowserRouter>
                    <Routes>
                        <Route path='/login' element={<MakeLogin />} />
                        <Route path='/logout' element={<MakeLogout />} />
                        <Route path='/' element={<PrivateRoute><MakeMain /></PrivateRoute>} />
                        <Route path='/weights' element={<PrivateRoute><MakeWeight /></PrivateRoute>} />
                        <Route path='/exercises/:exerciseId' element={<PrivateRoute><MakeCombination /></PrivateRoute>}/>
                    </Routes>
                </BrowserRouter>
            </AccountContext.Provider>

            <ToastContainer />
        </>
    )
}

export default MainRouter