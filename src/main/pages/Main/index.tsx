import React, {useContext} from 'react'
import Main from '../../../presentation/pages/Main'
import {makeExercise} from '../../factories/exercise'
import {AccountContext} from '../../../presentation/hooks'

const MakeMain: React.FC = () => {

    const { getCurrentAccount } = useContext(AccountContext)

    if (getCurrentAccount) {

        const { access, refresh } = getCurrentAccount()
        const remoteExercise = makeExercise(access, refresh)

        return (
            <Main remoteExercises={remoteExercise} />
        )
    } else {
        return null
    }
}

export default MakeMain