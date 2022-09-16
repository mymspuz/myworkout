import {CombinationContext, FormContext} from '../../hooks';
import {ButtonSubmit, FormLoaderStatus, Input} from '../index';
import React, {useContext, useEffect, useState} from 'react';
import {IValidation} from '../../protocols/validation';
import {toast} from 'react-toastify';
import {RemoteCombination} from '../../../data/combination';

type FormCombinationsProps = {
    validation: IValidation
    remoteCombinations: RemoteCombination
}

const FormCombinations: React.FC<FormCombinationsProps> = ({ validation, remoteCombinations }: FormCombinationsProps) => {
    const [state, setState] = useState({
        isLoading: false,
        isFormInvalid: true,
        isVisible: false,
        mainError: '',
        repeats: 0,
        repeatsError: '',
        weighting: 0,
        weightingError: ''
    })

    const { currentCombination } = useContext(CombinationContext)

    useEffect(() => {
        setState({...state, isVisible: currentCombination.id > 0})
    }, [currentCombination])

    useEffect(() => {
        const { repeats, weighting } = state
        const formData = { repeats, weighting }
        const repeatsError = validation.validate('repeats', formData)
        const weightingError = validation.validate('weighting', formData)

        setState({
            ...state,
            repeatsError: repeatsError ? repeatsError : '',
            weightingError: weightingError ? weightingError : '',
            isFormInvalid: !!repeatsError || !!weightingError
        })
    }, [state.repeats, state.weighting])

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

            await remoteCombinations.add({
                id: currentCombination.id,
                repeats: state.repeats,
                weighting: state.weighting
            })

            setState({
                ...state,
                isLoading: false,
                mainError: '',
                repeatsError: '',
                weightingError: '',
                repeats: 0,
                weighting: 0
            })
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
        <div className="row">
            {state.isVisible &&
            <FormContext.Provider value={{state, setState}}>
                <form
                    onSubmit={handleSubmit}
                >
                    <div className="input-field col s4 offset-s4 m5">
                        <Input
                            autoComplete='off'
                            className='validate center'
                            title='Repeats'
                            type='text'
                            name='repeats'
                            style={{fontSize: '3rem'}}
                            value={state.repeats ? state.repeats : ''}
                        />
                    </div>
                    <div className="input-field col s4 offset-s4 m5">
                        <Input
                            autoComplete='off'
                            className='validate center'
                            title='Weighting'
                            type='text'
                            name='weighting'
                            style={{fontSize: '3rem'}}
                            value={state.weighting ? state.weighting : ''}
                        />
                    </div>
                    <div className="col s12 m2 center">
                        <ButtonSubmit
                            className='btn-floating btn-large waves-effect waves-light red'
                            type='submit'
                            disabled={state.isFormInvalid}
                            title='ADD'
                            data-testid='weightButton'
                        />
                    </div>
                    <FormLoaderStatus/>
                </form>
            </FormContext.Provider>
            }
        </div>
    )
}

export default FormCombinations