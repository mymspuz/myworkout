import { RemoteGoal } from 'data/goal'
import { ButtonSubmit, CollectionGoals, Footer, FormLoaderStatus, Header, Input } from 'presentation/components'
import FloatingActionButton from 'presentation/components/Buttons/FloatingActionButton'
import Spinner from 'presentation/components/FormLoaderStatus/Spinner'
import React, { useEffect, useRef, useState } from 'react'
import M from 'materialize-css'
import { toast } from 'react-toastify'
import { ExerciseModel, IGoalItem, RemoteGoalModel, TRemoveGoal } from 'domain/models'
import { IValidation } from 'presentation/protocols/validation'
import { FormContext } from 'presentation/hooks'

type GoalsProps = {
    validation: IValidation
    remoteGoal: RemoteGoal
}

interface stateGoals {
    isLoading: boolean
    isFormInvalid: boolean
    mainError: string
    value: number
    valueError: string
}

const Goals: React.FC<GoalsProps> = ({validation, remoteGoal}: GoalsProps) => {

    const [state, setState] = useState<stateGoals>({
        isLoading: false,
        isFormInvalid: true,
        mainError: '',
        value: 0,
        valueError: ''
    })

    const [exercises, setExercises] = useState<ExerciseModel[]>([])
    const [goals, setGoals] = useState<IGoalItem[]>([])
    const [exerciseId, setExerciseId] = useState<number>(0)

    const selectRef = useRef<HTMLSelectElement>(null)

    // Цель всегда на текущий месяц - показываем, на какой
    const currentMonth = new Date().toLocaleString('ru', {month: 'long', year: 'numeric'})

    const removeGoal = async (params: TRemoveGoal): Promise<void> => {
        try {
            setState({...state, isLoading: true})

            await remoteGoal.remove(params)

            setGoals(goals.filter(g => g.id !== params.id))
            setState({...state, isLoading: false})
            toast.success('Success remove', {theme: 'colored'})
        } catch (error: any) {
            setState({
                ...state,
                isLoading: false,
                mainError: error.message
            })
        }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()
        try {
            if (state.isLoading || state.isFormInvalid) {
                return
            }
            setState({...state, isLoading: true})

            await remoteGoal.add({exercise: exerciseId, value: Number(state.value)})
            // Прогресс считает сервер - после добавления берём список заново
            const response: RemoteGoalModel = await remoteGoal.get()
            setGoals(response.goals)

            setState({...state, isLoading: false, mainError: '', valueError: '', value: 0})
            toast.success('Success add', {theme: 'colored'})
        } catch (error: any) {
            setState({
                ...state,
                isLoading: false,
                mainError: error.message
            })
        }
    }

    useEffect(() => {
        setState({...state, isLoading: true})
        remoteGoal.get()
            .then((response: RemoteGoalModel) => {
                setExercises(response.exercises)
                setGoals(response.goals)
                setState({...state, isLoading: false, mainError: ''})
            })
            .catch((e: Error) => {
                setState({...state, isLoading: false, mainError: e.message})
            })
    }, [])

    // Materialize подменяет select своей разметкой, поэтому выбор слушаем на самом элементе
    // и инициализируем после того, как появились варианты
    useEffect(() => {
        const select = selectRef.current
        if (!select || !exercises.length) {
            return
        }
        const instance = M.FormSelect.init(select, {})
        const handleChange = () => setExerciseId(Number(select.value) || 0)
        select.addEventListener('change', handleChange)
        return () => {
            select.removeEventListener('change', handleChange)
            instance.destroy()
        }
    }, [exercises])

    useEffect(() => {
        const { value } = state
        const formData = { value }
        const valueError = validation.validate('value', formData)

        setState({
            ...state,
            valueError: valueError ? valueError : '',
            isFormInvalid: !!valueError || !exerciseId
        })
    }, [state.value, exerciseId])

    useEffect(() => {
        if (state.mainError) {
            toast.error(state.mainError, {theme: 'colored'})
        }
    }, [state.mainError])

    return (
        <div className="content">
            <Header title='GOALS' icon='flag' />
            <main>
                <div className="container">
                    <div className="row">
                        <div className="col s12 center">
                            <h5>{currentMonth}</h5>
                        </div>
                    </div>
                    <div className="row">
                        {state.isLoading && <Spinner />}
                        <CollectionGoals arrayGoals={goals} removeGoal={removeGoal} />
                    </div>
                    <div className="row">
                        <FormContext.Provider value={{ state, setState }}>
                            <form
                                className="col s12 m10 offset-m1"
                                onSubmit={handleSubmit}
                            >
                                <div className="input-field col s12 m6">
                                    <select ref={selectRef} className="no-autoinit" defaultValue="DEFAULT">
                                        <option value="DEFAULT" disabled>Выберите упражнение</option>
                                        {exercises.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                    </select>
                                    <label>Упражнение</label>
                                </div>
                                <div className="col s8 m4">
                                    <Input
                                        autoComplete='off'
                                        className='validate center'
                                        title='Times per month'
                                        type='number'
                                        name='value'
                                        value={state.value ? state.value : ''}
                                    />
                                </div>
                                <div className="col s4 m2 center">
                                    <ButtonSubmit
                                        className='btn-floating btn-large waves-effect waves-light red'
                                        type='submit'
                                        disabled={state.isFormInvalid}
                                        title='ADD'
                                        data-testid='goalButton'
                                    />
                                </div>
                                <FormLoaderStatus />
                            </form>
                        </FormContext.Provider>
                    </div>
                </div>
            </main>

            <FloatingActionButton />

            <Footer />
        </div>
    )
}

export default Goals
