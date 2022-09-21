import React, {useContext} from 'react'
import {AccountContext} from '../../../presentation/hooks'
import {makeCombination} from '../../factories/combination'
import {useParams} from 'react-router-dom'
import {makeCombinationValidation} from './CombinationValidation'
import Combination from '../../../presentation/pages/Combination'

import './style.css'

const MakeCombination: React.FC = () => {
    const {getCurrentAccount} = useContext(AccountContext)
    const {exerciseId} = useParams()
    if (getCurrentAccount) {
        const {access, refresh} = getCurrentAccount()
        const validationComposite = makeCombinationValidation()
        const remoteCombinations = makeCombination(access, Number(exerciseId), refresh)

        return (
            <Combination
                validation={validationComposite}
                remoteCombinations={remoteCombinations}
                exerciseId={Number(exerciseId)}
            />
        )
    } else {
        return null
    }
}

export default MakeCombination