import { TItem } from 'domain/models'
import { FormContext } from 'presentation/hooks'
import React, {useContext, useState} from 'react'

interface ISelectProps
    extends React.DetailedHTMLProps<
        React.SelectHTMLAttributes<HTMLSelectElement>,
        HTMLSelectElement
    > {
    title?: string
    hideStatus?: boolean
    options: TItem[]
}

const Select: React.FC<ISelectProps> = (props: ISelectProps) => {
    // @ts-ignore
    const { state, setState } = useContext(FormContext)
    const stateName = `${props.name}Error`
    const error = state[stateName]
    const [isActiveFocus, setIsActiveFocus] = useState(false)

    const enableInput = (event: React.FocusEvent<HTMLSelectElement>): void => {
        setIsActiveFocus(true)
    }

    const handleInputChange = (event: React.FocusEvent<HTMLSelectElement>): void => {
        // setState({...state, [event.target.name]: Array.from(event.target.selectedOptions, option => option.value)})
    }

    // @ts-ignore
    return (
        <div className="input-field">
            <select
                {...props}
                onFocus={enableInput}
                onChange={handleInputChange}
                onBlur={() => setIsActiveFocus(false)}
            >
                <>
                    <option value="DEFAULT" disabled>{props.title}</option>
                    {props.options && props.options.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                </>
            </select>
            <label htmlFor={props.name}>{props.title}</label>
            <span className="helper-text" data-error={error} data-success="right" />
        </div>
    )
}

export default Select