import React, {useContext, useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {IValidation} from '../../protocols/validation'
import {IAuthentication} from '../../../domain/auth'
import {AccountContext, FormContext} from '../../../presentation/hooks'
import {Input, ButtonSubmit, Header, Footer, FormLoaderStatus} from '../../../presentation/components'
import {toast} from 'react-toastify'

type LoginProps = {
    validation: IValidation
    authentication: IAuthentication
}

const Login: React.FC<LoginProps> = ({
    validation,
    authentication
}: LoginProps) => {
    const { setCurrentAccount } = useContext(AccountContext)
    const navigate = useNavigate()
    const [state, setState] = useState({
        isLoading: false,
        isFormInvalid: true,
        username: '',
        password: '',
        usernameError: '',
        passwordError: '',
        mainError: ''
    })

    useEffect(() => {
        const { username, password } = state
        const formData = { username, password }
        const usernameError = validation.validate('username', formData)
        const passwordError = validation.validate('password', formData)

        setState({
            ...state,
            usernameError: usernameError ? usernameError : '',
            passwordError: passwordError ? passwordError : '',
            isFormInvalid: !!usernameError || !!passwordError
        })
    }, [state.username, state.password])

    useEffect(() => {
        if (state.mainError) {
            toast.error(state.mainError)
        }
    }, [state.mainError])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()
        try {
            if (state.isLoading || state.isFormInvalid) {
                return
            }
            setState({...state, isLoading: true})

            const account = await authentication.auth({
                username: state.username,
                password: state.password
            })
            if (setCurrentAccount) {
                setCurrentAccount(account)
                navigate('/')
            }
        } catch (error: any) {
            setState({
                ...state,
                isLoading: false,
                mainError: error.message
            })
        }
    }

    return (
        <div className="content">
            <Header title='LOGIN' icon='person' />
            <main>
                <div className="container">
                    <div className="row">
                        <div className="col m6 s10 offset-s1 offset-m3">
                            <div className="card">
                                <div className="card-content">
                                    <span className="card-title center">LOGIN</span>
                                    <FormContext.Provider value={{ state, setState }}>
                                        <form onSubmit={handleSubmit}>
                                            <Input
                                                autoComplete='off'
                                                className='validate'
                                                title='Username'
                                                type='text'
                                                name='username'

                                            />
                                            <Input
                                                autoComplete='off'
                                                className='validate'
                                                title='Password'
                                                type='password'
                                                name='password'

                                            />
                                            <div className="center">
                                                <ButtonSubmit
                                                    className='btn'
                                                    type='submit'
                                                    disabled={state.isFormInvalid}
                                                    title='Login'
                                                    data-testid='loginButton'
                                                />
                                            </div>
                                            <FormLoaderStatus />
                                        </form>
                                    </FormContext.Provider>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default Login