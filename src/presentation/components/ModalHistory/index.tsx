import { IApproach, TItem } from 'domain/models'
import { FormContext } from 'presentation/hooks'
import React, { useEffect, useRef, useState } from 'react'
import M from 'materialize-css'
import { Input } from '..'

type ModalHistoryProps = {
    approache: IApproach
    arrayExercises: TItem[]
}

const ModalHistory: React.FC<ModalHistoryProps> = ({approache, arrayExercises}: ModalHistoryProps) => {
    const [state, setState] = useState({
        isFormInvalid: true,
        repeats: 0,
        repeatsError: '',
        weighting: 0,
        weightingError: ''
    })

    const selectRef = useRef<HTMLSelectElement>(null)
    const dateRef = useRef<HTMLInputElement>(null)

    // Раньше модалки инициализировал M.AutoInit() на странице; теперь модалка одна и сама
    useEffect(() => {
        if (!selectRef.current || !dateRef.current) {
            return
        }
        const select = M.FormSelect.init(selectRef.current, {})
        const datepicker = M.Datepicker.init(dateRef.current, {format: 'yyyy-mm-dd', autoClose: true})
        return () => {
            select.destroy()
            datepicker.destroy()
        }
    }, [])

    return (
        <div id={"modal" + approache.id} className="modal">
            <div className="modal-content">
                <FormContext.Provider value={{state, setState}}>
                <form className="col s12 m10 offset-m1" onSubmit={e => e.preventDefault()}>
                    <div className="row">
                        <div className="col s6 offset-3">
                            <div className="input-field col s12 m6">
                                <input
                                    ref={dateRef}
                                    type="text"
                                    className="datepicker no-autoinit"
                                    defaultValue={approache.date}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s6 offset-3">
                            <div className="input-field col s12">
                                <select ref={selectRef} className="no-autoinit" defaultValue={approache.combination.exercise.id}>
                                    {arrayExercises.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s4 offset-s4 m5">
                            <Input
                                autoComplete='off'
                                className='validate center'
                                title='Repeats'
                                type='number'
                                name='repeats'
                                style={{fontSize: '3rem'}}
                                value={approache.value}
                            />
                        </div>
                        <div className="col s4 offset-s4 m5">
                            <Input
                                autoComplete='off'
                                className='validate center'
                                title='Weighting'
                                type='number'
                                name='weighting'
                                style={{fontSize: '3rem'}}
                                value={approache.weight}
                            />
                        </div>
                    </div>
                    {/* Сохранение не реализовано: кнопка только закрывает окно, как и раньше */}
                    <button type="button" className="btn modal-close" style={{marginRight: '10px'}}>Сохранить</button>
                    <button type="button" className="btn modal-close red">Отмена</button>
                </form>
                </FormContext.Provider>
            </div>
        </div>

    )
}

export default ModalHistory