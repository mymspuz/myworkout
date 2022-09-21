import React, {useContext} from 'react'
import {AccountContext} from '../../../presentation/hooks'
import {makeWeight} from '../../factories/weight'
import Weight from '../../../presentation/pages/Weight'
import {makeWeightValidation} from './WeightValidation'

const MakeWeight: React.FC = () => {

    const { getCurrentAccount } = useContext(AccountContext)

    if (getCurrentAccount) {
        const { access, refresh } = getCurrentAccount()
        const remoteWeight = makeWeight(access, refresh)
        const validationComposite = makeWeightValidation()

        return (
            <Weight
                validation={validationComposite}
                remoteWeight={remoteWeight}
            />
        )
    } else {
        return null
    }
}

export default MakeWeight