import { RemoteReport } from 'data/report'
import { Footer, Header } from 'presentation/components'
import FloatingActionButton from 'presentation/components/Buttons/FloatingActionButton'
import Spinner from 'presentation/components/FormLoaderStatus/Spinner'
import React, {useEffect, useState} from 'react'
import M from 'materialize-css'
import { ReportCurrentDayModel } from 'domain/models'
import {toast} from 'react-toastify'
import CollapsibleReport from 'presentation/components/Collapsible/CollapsibleReport'

type ReportProps = {
    remoteReport: RemoteReport
}

const Report: React.FC<ReportProps> = ({remoteReport}: ReportProps) => {

    M.AutoInit()

    const [state, setState] = useState({
        isLoading: false,
        mainError: '',
    })

    const [reportCurrentDay, setReportCurrentDay] = useState<ReportCurrentDayModel[]>([])

    useEffect(() => {
        setState({...state, isLoading: true})
        remoteReport.getCurrentDay()
            .then((response) => {
                setReportCurrentDay(response)
                setState({...state, isLoading: false, mainError: ''})
            })
            .catch((e: Error) => {
                setState({...state, isLoading: false, mainError: e.message})
            })
    }, [])

    useEffect(() => {
        if (state.mainError) {
            toast.error(state.mainError)
        }
    }, [state.mainError])

    return (
        <div className="content">
            <Header title='REPORT' icon='insert_chart' />
            <main>
                <div className="container">
                    <div className="row">
                        {state.isLoading && <Spinner />}
                        <div className="col s12 m10 offset-m1 center">
                            <ul className="collapsible popout">
                                {reportCurrentDay && reportCurrentDay.map(e => <CollapsibleReport key={e.id}
                                                                                                  data={e}
                                                                                                  remoteReport={remoteReport} />)}
                            </ul>
                        </div>

                    </div>
                </div>
            </main>

            <FloatingActionButton />

            <Footer />

        </div>
    )
}

export default Report