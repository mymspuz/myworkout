import React, {useEffect, useState} from 'react'
import {RemoteWeight} from '../../../data/weight'
import {WeightModel} from '../../../domain/models'
import {toast} from 'react-toastify'
import {Header, Footer, FormLoaderStatus, ButtonSubmit, Input} from '../../components'
import FloatingActionButton from '../../components/Buttons/FloatingActionButton'
import Spinner from '../../components/FormLoaderStatus/Spinner'
import {IValidation} from '../../protocols/validation'
import {FormContext} from '../../../presentation/hooks'

type WeightProps = {
    validation: IValidation
    remoteWeight: RemoteWeight
}

const Weight: React.FC<WeightProps> = ({ validation, remoteWeight }: WeightProps) => {

    const [state, setState] = useState({
        isLoading: false,
        isFormInvalid: true,
        mainError: '',
        weight: 0,
        weightError: ''
    })

    const [weight, setWeight] = useState<WeightModel>({weight_min: 0, weight_max: 0})

    useEffect(() => {
        setState({...state, isLoading: true})
        remoteWeight.get()
            .then((response) => {
                setWeight({...weight, weight_min: response.weight_min, weight_max: response.weight_max})
                setState({...state, isLoading: false, mainError: ''})
            })
            .catch((e: Error) => {
                setState({...state, isLoading: false, mainError: e.message})
            })
    }, [])

    useEffect(() => {
        const { weight } = state
        const formData = { weight }
        const weightError = validation.validate('weight', formData)

        setState({
            ...state,
            weightError: weightError ? weightError : '',
            isFormInvalid: !!weightError
        })
    }, [state.weight])

    useEffect(() => {
        if (state.mainError) {
            toast.error(state.mainError, {theme: 'colored'})
        }
    }, [state.mainError])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()
        try {
            if (state.isLoading || state.isFormInvalid) {
                return
            }
            setState({...state, isLoading: true})

            await remoteWeight.add(state.weight)

            if (state.weight > weight.weight_max) {
                setWeight({...weight, weight_max: Number(state.weight)})
                toast.info('New MAX', {theme: 'dark', position: 'bottom-center'})
            }

            if (state.weight < weight.weight_min) {
                setWeight({...weight, weight_min: Number(state.weight)})
                toast.info('New MIN', {theme: 'dark', position: 'bottom-center'})
            }

            setState({...state, isLoading: false, mainError: '', weightError: '', weight: 0})
            toast.success('Success add', {theme: 'colored'})
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
            <Header title='WEIGHT' icon='cake' />
            <main>
                <div className="container">
                    <div className="row">
                        {state.isLoading && <Spinner />}
                        <div className="col s12">
                            <h1 className="center-align red-text">{weight.weight_max}</h1>
                        </div>
                    </div>
                    <div className="row">
                        <FormContext.Provider value={{ state, setState }}>
                            <form
                                className="col s6 m2 offset-s3 offset-m5"
                                onSubmit={handleSubmit}
                            >
                                <div className="row">
                                    <Input
                                        autoComplete='off'
                                        className='validate center'
                                        title='Weight'
                                        type='text'
                                        name='weight'
                                        style={{fontSize: '3rem'}}
                                        value={state.weight}
                                    />
                                    <div className="center">
                                        <ButtonSubmit
                                            className='btn-floating btn-large waves-effect waves-light red'
                                            type='submit'
                                            disabled={state.isFormInvalid}
                                            title='ADD'
                                            data-testid='weightButton'
                                        />
                                    </div>
                                </div>
                                <FormLoaderStatus />
                            </form>
                        </FormContext.Provider>
                    </div>
                    <div className="row">
                        <div className="col s12">
                            <h1 className="center-align green-text">{weight.weight_min}</h1>
                        </div>
                    </div>
                </div>
            </main>

            <FloatingActionButton />

            <Footer />
        </div>
    )
}

export default Weight