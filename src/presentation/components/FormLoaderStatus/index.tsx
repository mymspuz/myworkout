import React, {useContext} from 'react'
import {FormContext} from '../../../presentation/hooks'
import Spinner from '../../../presentation/components/FormLoaderStatus/Spinner'

const FormLoaderStatus: React.FC = () => {
    // @ts-ignore
    const { state } = useContext(FormContext)
    const { isLoading, mainError } = state

    return (
        <div data-testid="errorWrap">
            {isLoading && <Spinner />}
            {mainError && (
                <span data-testid="mainError">
                    {mainError}
                </span>
            )}
        </div>
    )
}

export default FormLoaderStatus