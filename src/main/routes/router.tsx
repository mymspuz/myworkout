import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import {AccountContext} from 'presentation/hooks'
import {
            getCurrentAccountAdapter,
            setCurrentAccountAdapter
        } from '../adapters/CurrentAccountAdapter'
import M from 'materialize-css'

import PrivateRoute from 'presentation/routes/private.routes'
import MakeLogin from 'main/pages/Login'
import MakeMain from 'main/pages/Main'
import MakeLogout from 'main/pages/Logout'
import MakeWeight from 'main/pages/Weight'
import MakeCombination from 'main/pages/Combination'
import MakeReport from 'main/pages/Reports'
import MakeHistory from 'main/pages/History'

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
                        <Route path='/reports' element={<PrivateRoute><MakeReport /></PrivateRoute>} />
                        <Route path='/history' element={<PrivateRoute><MakeHistory /></PrivateRoute>} />
                        <Route path='/exercises/:exerciseId' element={<PrivateRoute><MakeCombination /></PrivateRoute>}/>
                    </Routes>
                </BrowserRouter>
            </AccountContext.Provider>

            <ToastContainer />
        </>
    )
}

export default MainRouter