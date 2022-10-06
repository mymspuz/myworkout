import React, {useContext, useState} from 'react'
import { FormContext } from 'presentation/hooks'

interface IInputProps
    extends React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    > {
    title?: string
    hideStatus?: boolean
}

const Input: React.FC<IInputProps> = (props: IInputProps) => {
    // @ts-ignore
    const { state, setState } = useContext(FormContext)
    const stateName = `${props.name}Error`
    const error = state[stateName]
    const [isActiveFocus, setIsActiveFocus] = useState(false)

    const enableInput = (event: React.FocusEvent<HTMLInputElement>): void => {
        event.target.readOnly = false
        setIsActiveFocus(true)
        console.log('focus-on date')
    }

    const disableInput = (event: React.FocusEvent<HTMLInputElement>): void => {
        event.target.readOnly = false
        setIsActiveFocus(false)
    }

    const handleInputChange = (event: React.FocusEvent<HTMLInputElement>): void => {
        setState({...state, [event.target.name]: event.target.value})
    }

    return (
        <div className="input-field">
            <input
                {...props}
                className={`${props.className}`}
                data-testid={`${props.name}`}
                readOnly
                onFocus={enableInput}
                onChange={handleInputChange}
                onBlur={disableInput}
                placeholder=''
            />
            <label htmlFor={props.name}>{props.title}</label>
            <span className="helper-text" data-error={error} data-success="right" />
        </div>
    )
}

export default Input