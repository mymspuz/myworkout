import { TItem } from 'domain/models'
import React, { useEffect, useRef } from 'react'
import M from 'materialize-css'

type FilterHistoryProps = {
    arrayExercises: TItem[]
    filterApproaches(exercises: number[], date: string): void
}

const FilterHistory: React.FC<FilterHistoryProps> = ({arrayExercises, filterApproaches}: FilterHistoryProps) => {

    const selectRef = useRef<HTMLSelectElement>(null)
    const dateRef = useRef<HTMLInputElement>(null)

    // Виджеты Materialize создаём один раз и читаем значения прямо из элементов:
    // пересоздание на каждый поиск оставляло в руках уничтоженный экземпляр календаря
    useEffect(() => {
        if (!selectRef.current || !dateRef.current) {
            return
        }
        const select = M.FormSelect.init(selectRef.current, {})
        // Формат совпадает с датой подхода из API - значение поля сравнивается как есть
        const datepicker = M.Datepicker.init(dateRef.current, {
            format: 'yyyy-mm-dd',
            autoClose: true,
            showClearBtn: true,
            firstDay: 1
        })
        return () => {
            select.destroy()
            datepicker.destroy()
        }
    }, [])

    function handleSearch() {
        if (!selectRef.current || !dateRef.current) {
            return
        }
        // Пункт-подсказка disabled и без числового value - в фильтр не попадает
        const exercises = Array.from(selectRef.current.selectedOptions)
            .map(option => Number(option.value))
            .filter(id => id > 0)
        filterApproaches(exercises, dateRef.current.value)
    }

    return (
        <>
            <div className="input-field col s12 m6">
                <select ref={selectRef} className="no-autoinit" multiple defaultValue={['DEFAULT']}>
                    <option value="DEFAULT" disabled>Все упражнения</option>
                    {arrayExercises.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
                <label>Упражнения</label>
            </div>
            <div className="input-field col s12 m6">
                <input
                    ref={dateRef}
                    id="datefilter"
                    type="text"
                    className="datepicker no-autoinit"
                    placeholder="Любая дата"
                />
                <label htmlFor="datefilter" className="active">Дата</label>
            </div>
            <div className="col s12 m6 offset-m3 center" style={{marginBottom: '15px'}}>
                <button type="button" className="waves-effect waves-light btn" onClick={handleSearch}><i className="material-icons left">done_all</i>Поиск</button>
            </div>
        </>
    )
}

export default FilterHistory
