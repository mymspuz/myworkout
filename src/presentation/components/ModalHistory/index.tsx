import { IApproach, TItem } from 'domain/models'
import { FormContext } from 'presentation/hooks'
import React, { useState } from 'react'
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

    return (
        <div id={"modal" + approache.id} className="modal">
            <div className="modal-content">
                <FormContext.Provider value={{state, setState}}>
                <form action="#" className="col s12 m10 offset-m1">
                    <div className="row">
                        <div className="col s6 offset-3">
                            <div className="input-field col s12 m6">
                                <input
                                    id="datefilter"
                                    type="text"
                                    className="datepicker"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s6 offset-3">
                            <div className="input-field col s12">
                                <select defaultValue={approache.combination.exercise.id}>
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
                    <button className="btn modal-close" style={{marginRight: '10px'}}>Сохранить</button>
                    <button className="btn modal-close red">Отмена</button>
                </form>
                </FormContext.Provider>
            </div>
        </div>

    )
}

export default ModalHistory