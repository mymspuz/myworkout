import React, { useEffect, useState } from 'react'
import { ReportCurrentDayModel, ReportSumModel } from 'domain/models'
import { RemoteReport } from 'data/report'
import Spinner from '../FormLoaderStatus/Spinner'
import { toast } from 'react-toastify'

type icon = 'battery_full' | 'battery_alert' | 'battery_charging_full'
type color = 'deep-orange darken-4' | 'yellow accent-4' | ''

interface ICollapsibleHeader {
    icon: icon
    color: color
}

type CollapsibleReportProps = {
    data: ReportCurrentDayModel
    remoteReport: RemoteReport
}

const CollapsibleReport: React.FC<CollapsibleReportProps> = ({data, remoteReport}: CollapsibleReportProps) => {

    const [state, setState] = useState({
        isLoading: false,
        mainError: '',
        collapsibleHeader: {icon: '', color: ''}
    })

    const [reportBest, setReportBest] = useState<ReportSumModel>()

    function handleOnClick(id: number): void {
        if (reportBest) {
            return
        }
        setState({...state, isLoading: true})
        remoteReport.getBest(id)
            .then((response) => {
                setReportBest(response)
                setState({...state, isLoading: false, mainError: ''})
                M.AutoInit()
            })
            .catch((e: Error) => {
                setState({...state, isLoading: false, mainError: e.message})
            })
    }

    function getCollapsibleHeader(): ICollapsibleHeader {
        switch (true) {
            case data.total < 20:
                return {icon: 'battery_alert', color: 'deep-orange darken-4'}
            case data.total < 80:
                return {icon: 'battery_charging_full', color: 'yellow accent-4'}
            default:
                return {icon: 'battery_full', color: ''}
        }
    }

    useEffect(() => {
        setState({...state, collapsibleHeader: getCollapsibleHeader()})
    }, [])

    useEffect(() => {
        if (state.mainError) {
            toast.error(state.mainError)
        }
    }, [state.mainError])

    return (
        <li onClick={() => handleOnClick(data.id)}>
            <div className="collapsible-header">
                <i className="material-icons">{state.collapsibleHeader.icon}</i>
                {data.name}
                <span className={"new badge z-depth-3 " + state.collapsibleHeader.color}>{data.total}</span>
            </div>
            <div className="collapsible-body">
                {state.isLoading && <Spinner />}
                {reportBest &&
                    <>
                        <a
                            className="waves-effect waves-light btn light-blue darken-2 tooltipped hstat"
                            data-position="top"
                            data-tooltip="All"
                        >
                            <i className="material-icons left">equalizer</i>
                            {reportBest.all}
                        </a>
                        <a
                            className="waves-effect waves-light btn-large yellow darken-1 tooltipped hstat"
                            data-position="bottom"
                            data-tooltip={"Best of month - "
                                            + reportBest.bestMonth.month + '.'
                                            + reportBest.bestMonth.year}
                        >
                            <i className="material-icons left">flash_on</i>
                            {reportBest.bestMonth.total}
                        </a>
                        <a
                            className="waves-effect waves-light btn-large yellow darken-1 tooltipped hstat"
                            data-position="top"
                            data-tooltip={"Best of day - "
                                            + reportBest.bestDay.day + '.'
                                            + reportBest.bestDay.month + '.'
                                            + reportBest.bestDay.year}
                        >
                            <i className="material-icons left">flash_on</i>
                            {reportBest.bestDay.total}
                        </a>
                        <a
                            className="waves-effect waves-light btn tooltipped hstat"
                            data-position="bottom"
                            data-tooltip="Current month"
                        >
                            <i className="material-icons left">check_circle</i>
                            {reportBest.currentMonth}
                        </a>
                    </>
                }
            </div>
        </li>
    )
}

export default CollapsibleReport