import { TItem } from 'domain/models'
import { FormContext } from 'presentation/hooks'
import React, { useEffect, useState } from 'react'
import { Input, Select } from '..'

type FilterHistoryProps = {
    arrayExercises: TItem[]
    filterApproaches: any
}

const FilterHistory: React.FC<FilterHistoryProps> = ({arrayExercises, filterApproaches}: FilterHistoryProps) => {

    const [state, setState] = useState({
        isFormInvalid: true,
        date: '',
        dateError: '',
        exercises: [],
        exercisesError: ''
    })

    const [datepicker, setDatepicker] = useState<any>()

    function handleSearch() {
        const select = document.querySelector('select')
        const datepickerAll = document.querySelectorAll('.datepicker')
        M.Datepicker.init(datepickerAll, {})

        let resultDate = ''
        if (datepicker[0]['el']['value']) {
            const day = datepicker[0]['el']['value'].substr(4, 2)
            let month = datepicker[0]['calendars'][0]['month']
            if (month < 10) month = '0' + month
            const year = datepicker[0]['calendars'][0]['year']
            resultDate = `${year}-${month}-${day}`
        }
        // @ts-ignore
        setState({...state, exercises: Array.from(select.selectedOptions, option => option.value), date: resultDate})
    }

    useEffect(() => {
        const selectAll = document.querySelectorAll('select')
        const datepickerAll = document.querySelectorAll('.datepicker')
        M.FormSelect.init(selectAll, {})
        const init = M.Datepicker.init(datepickerAll, {})
        setDatepicker(init)
    }, [])

    useEffect(() => {
        if (state.exercises.length) {
            filterApproaches(state.exercises.map(e => (e !== 'DEFAULT') ? Number(e) : 0), state.date)
        }
    }, [state.date, state.exercises])

    return (
        <FormContext.Provider value={{state, setState}}>
            <div className="col s12 m6">
                <Select
                    title='Выберите упражнение'
                    name='exercises'
                    multiple={true}
                    defaultValue={['DEFAULT']}
                    options={arrayExercises}
                />
            </div>
            <div className="input-field col s12 m6">
                <input
                    id="datefilter"
                    type="text"
                    className="datepicker"
                />
            </div>
            <div className="col s12 m6 offset-m3 center" style={{marginBottom: '15px'}}>
                <a className="waves-effect waves-light btn" onClick={handleSearch}><i className="material-icons">done_all</i>Поиск</a>
            </div>
        </FormContext.Provider>
    )
}

export default FilterHistory