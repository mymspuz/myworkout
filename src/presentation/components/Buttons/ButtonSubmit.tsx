import React from 'react';

interface IButtonSubmitProps
    extends React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    > {
    title: string
    'data-testid'?: string
}

const ButtonSubmit: React.FC<IButtonSubmitProps> = (props: IButtonSubmitProps) => {
    return (
        <button
            type="submit"
            {...props}
            className={props.className}
        >
            {props.title}
        </button>
    )
}

export default ButtonSubmit