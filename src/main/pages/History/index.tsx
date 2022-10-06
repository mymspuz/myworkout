import { makeHistory } from 'main/factories/history'
import { AccountContext } from 'presentation/hooks'
import React, {useContext} from 'react'
import History from 'presentation/pages/History'

const MakeHistory: React.FC = () => {
    const { getCurrentAccount } = useContext(AccountContext)

    if (getCurrentAccount) {
        const { access, refresh } = getCurrentAccount()
        const remoteHistory = makeHistory(access, refresh)
        // const validationComposite = makeWeightValidation()

        return (
            <History
                remoteHistory={remoteHistory}
            />
        )
    } else {
        return null
    }
}

export default MakeHistory