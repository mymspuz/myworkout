import { CombinationContext, FormContext } from 'presentation/hooks'
import { ButtonSubmit, FormLoaderStatus, Input } from 'presentation/components'
import React, { useContext, useEffect, useState } from 'react'
import { IValidation } from 'presentation/protocols/validation'
import { toast } from 'react-toastify'
import M from 'materialize-css'
import { RemoteCombination } from 'data/combination'

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
        weightingError: '',
        // Строкой: валидатор минимума работает со строкой из поля ввода
        rounds: '1',
        roundsError: ''
    })

    const { currentCombination } = useContext(CombinationContext)

    useEffect(() => {
        setState({...state, isVisible: currentCombination.id > 0})
    }, [currentCombination])

    useEffect(() => {
        const { repeats, weighting, rounds } = state
        const formData = { repeats, weighting, rounds }
        const repeatsError = validation.validate('repeats', formData)
        const weightingError = validation.validate('weighting', formData)
        const roundsError = validation.validate('rounds', formData)

        setState({
            ...state,
            repeatsError: repeatsError ? repeatsError : '',
            weightingError: weightingError ? weightingError : '',
            roundsError: roundsError ? roundsError : '',
            isFormInvalid: !!repeatsError || !!weightingError || !!roundsError
        })
    }, [state.repeats, state.weighting, state.rounds])

    // Поле кругов заполнено сразу - поднимаем подпись, иначе она лежит поверх значения
    useEffect(() => {
        if (state.isVisible) {
            M.updateTextFields()
        }
    }, [state.isVisible, state.rounds])

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

            const rounds = Number(state.rounds)
            await remoteCombinations.add({
                id: currentCombination.id,
                repeats: state.repeats,
                weighting: state.weighting,
                rounds
            })

            // Круги сбрасываем в 1: оставшееся 3 тихо утроило бы следующий подход
            setState({
                ...state,
                isLoading: false,
                mainError: '',
                repeatsError: '',
                weightingError: '',
                roundsError: '',
                repeats: 0,
                weighting: 0,
                rounds: '1'
            })
            toast.success(rounds > 1 ? `Success add x${rounds}` : 'Success add', {theme: 'colored'})
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
                            type='number'
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
                            type='number'
                            step='any'
                            name='weighting'
                            style={{fontSize: '3rem'}}
                            value={state.weighting ? state.weighting : ''}
                        />
                    </div>
                    <div className="input-field col s4 offset-s4 m5">
                        <Input
                            autoComplete='off'
                            className='validate center'
                            title='Rounds'
                            type='number'
                            name='rounds'
                            style={{fontSize: '3rem'}}
                            value={state.rounds}
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