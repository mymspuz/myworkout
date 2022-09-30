import { makeReport } from 'main/factories/report'
import { AccountContext } from 'presentation/hooks'
import Report from 'presentation/pages/Report'
import React, {useContext} from 'react'

const MakeReport: React.FC = () => {
    const { getCurrentAccount } = useContext(AccountContext)

    if (getCurrentAccount) {
        const { access, refresh } = getCurrentAccount()
        const remoteReport = makeReport(access, refresh)

        return (
            <Report
                remoteReport={remoteReport}
            />
        )
    } else {
        return null
    }
}

export default MakeReport