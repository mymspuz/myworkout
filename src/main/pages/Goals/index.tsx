import { makeGoal } from 'main/factories/goal'
import { AccountContext } from 'presentation/hooks'
import React, {useContext} from 'react'
import Goals from 'presentation/pages/Goals'
import { makeGoalsValidation } from './GoalsValidation'

const MakeGoals: React.FC = () => {
    const { getCurrentAccount } = useContext(AccountContext)

    if (getCurrentAccount) {
        const { access, refresh } = getCurrentAccount()
        const remoteGoal = makeGoal(access, refresh)
        const validationComposite = makeGoalsValidation()

        return (
            <Goals
                validation={validationComposite}
                remoteGoal={remoteGoal}
            />
        )
    } else {
        return null
    }
}

export default MakeGoals
