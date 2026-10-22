import { IApproach, TCombination, TItem, TUpdateApproach } from 'domain/models'
import { FormContext } from 'presentation/hooks'
import { IValidation } from 'presentation/protocols/validation'
import React, { useEffect, useRef, useState } from 'react'
import M from 'materialize-css'
import { ButtonSubmit, Input } from '..'

type ModalHistoryProps = {
    approache: IApproach
    arrayExercises: TItem[]
    arrayCombinations: TCombination[]
    validation: IValidation
    updateApproach(params: TUpdateApproach): Promise<boolean>
}

interface stateModal {
    isLoading: boolean
    isFormInvalid: boolean
    date: string
    exercise: number
    combination: number
    repeats: string
    repeatsError: string
    weighting: string
    weightingError: string
}

const combinationTitle = (c: TCombination): string => {
    return c.grip.name + ' / ' + c.arm.name + (c.equipment ? ' (' + c.equipment.name + ')' : '')
}

const ModalHistory: React.FC<ModalHistoryProps> = ({
    approache,
    arrayExercises,
    arrayCombinations,
    validation,
    updateApproach
}: ModalHistoryProps) => {
    // Числа держим строками: валидаторы работают со строкой из поля ввода
    const [state, setState] = useState<stateModal>({
        isLoading: false,
        isFormInvalid: false,
        date: approache.date,
        exercise: approache.combination.exercise.id,
        combination: approache.combination.id,
        repeats: String(approache.value),
        repeatsError: '',
        weighting: String(approache.weight),
        weightingError: ''
    })

    const dateRef = useRef<HTMLInputElement>(null)
    const exerciseRef = useRef<HTMLSelectElement>(null)
    const combinationRef = useRef<HTMLSelectElement>(null)

    const combinations = arrayCombinations.filter(c => c.exercise.id === state.exercise)

    // Календарь и выбор упражнения - один раз на открытие окна.
    // Materialize меняет значения сам, поэтому слушаем события на элементах, а состояние обновляем функционально
    useEffect(() => {
        if (!dateRef.current || !exerciseRef.current) {
            return
        }
        const dateInput = dateRef.current
        const exerciseSelect = exerciseRef.current
        const [year, month, day] = approache.date.split('-').map(Number)
        const datepicker = M.Datepicker.init(dateInput, {
            format: 'yyyy-mm-dd',
            autoClose: true,
            firstDay: 1,
            defaultDate: new Date(year, month - 1, day),
            setDefaultDate: true,
            onClose: () => setState(s => ({...s, date: dateInput.value}))
        })
        const exercise = M.FormSelect.init(exerciseSelect, {})
        // Поля приходят уже заполненными - поднимаем подписи, иначе они лежат поверх значений
        M.updateTextFields()
        // Сменили упражнение - берём его первый вариант, старый вариант к нему не относится
        const handleExercise = () => {
            const id = Number(exerciseSelect.value)
            const first = arrayCombinations.find(c => c.exercise.id === id)
            setState(s => ({...s, exercise: id, combination: first ? first.id : 0}))
        }
        exerciseSelect.addEventListener('change', handleExercise)
        return () => {
            exerciseSelect.removeEventListener('change', handleExercise)
            exercise.destroy()
            datepicker.destroy()
        }
    }, [])

    // Варианты зависят от упражнения - пересоздаём выпадающий список при его смене
    useEffect(() => {
        if (!combinationRef.current) {
            return
        }
        const combinationSelect = combinationRef.current
        const instance = M.FormSelect.init(combinationSelect, {})
        const handleCombination = () => setState(s => ({...s, combination: Number(combinationSelect.value)}))
        combinationSelect.addEventListener('change', handleCombination)
        return () => {
            combinationSelect.removeEventListener('change', handleCombination)
            instance.destroy()
        }
    }, [state.exercise])

    useEffect(() => {
        const { repeats, weighting } = state
        const formData = { repeats, weighting }
        const repeatsError = validation.validate('repeats', formData)
        const weightingError = validation.validate('weighting', formData)

        setState(s => ({
            ...s,
            repeatsError: repeatsError ? repeatsError : '',
            weightingError: weightingError ? weightingError : '',
            isFormInvalid: !!repeatsError || !!weightingError || !s.combination || !s.date
        }))
    }, [state.repeats, state.weighting, state.combination, state.date])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()
        if (state.isLoading || state.isFormInvalid) {
            return
        }
        setState(s => ({...s, isLoading: true}))

        const saved = await updateApproach({
            id: approache.id,
            combination: state.combination,
            date: state.date,
            value: Number(state.repeats),
            weight: Number(state.weighting.replace(',', '.'))
        })

        if (saved) {
            // Закрытие окна размонтирует компонент (onCloseEnd на странице)
            const elem = document.getElementById('modal' + approache.id)
            if (elem) {
                M.Modal.getInstance(elem).close()
            }
        } else {
            setState(s => ({...s, isLoading: false}))
        }
    }

    return (
        <div id={"modal" + approache.id} className="modal">
            <div className="modal-content">
                <FormContext.Provider value={{state, setState}}>
                <form className="row" onSubmit={handleSubmit}>
                    <div className="input-field col s12 m6">
                        <input
                            ref={dateRef}
                            id={"modal-date" + approache.id}
                            type="text"
                            className="datepicker no-autoinit"
                            defaultValue={approache.date}
                        />
                        <label htmlFor={"modal-date" + approache.id} className="active">Дата</label>
                    </div>
                    <div className="input-field col s12 m6">
                        <select ref={exerciseRef} className="no-autoinit" value={state.exercise} onChange={() => undefined}>
                            {arrayExercises.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                        </select>
                        <label>Упражнение</label>
                    </div>
                    <div className="input-field col s12">
                        <select ref={combinationRef} className="no-autoinit" value={state.combination} onChange={() => undefined}>
                            {combinations.map(c => <option key={c.id} value={c.id}>{combinationTitle(c)}</option>)}
                        </select>
                        <label>Вариант</label>
                    </div>
                    <div className="col s6">
                        <Input
                            autoComplete='off'
                            className='validate center'
                            title='Repeats'
                            type='number'
                            name='repeats'
                            value={state.repeats}
                        />
                    </div>
                    <div className="col s6">
                        <Input
                            autoComplete='off'
                            className='validate center'
                            title='Weighting'
                            type='number'
                            step='any'
                            name='weighting'
                            value={state.weighting}
                        />
                    </div>
                    <div className="col s12 center">
                        <ButtonSubmit
                            className='btn'
                            type='submit'
                            disabled={state.isFormInvalid || state.isLoading}
                            title='Сохранить'
                            data-testid='historySaveButton'
                        />
                        <button type="button" className="btn modal-close red">Отмена</button>
                    </div>
                </form>
                </FormContext.Provider>
            </div>
        </div>
    )
}

export default ModalHistory
