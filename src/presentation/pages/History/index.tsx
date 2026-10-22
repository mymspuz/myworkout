import { RemoteHistory } from 'data/history'
import { CollectionHistory, FilterHistory, Footer, Header, ModalHistory } from 'presentation/components'
import FloatingActionButton from 'presentation/components/Buttons/FloatingActionButton'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { IApproach, RemoteHistoryModel, TColorHistory, TItem, TRemoveApproach } from 'domain/models'
import Spinner from 'presentation/components/FormLoaderStatus/Spinner'

type HistoryProps = {
    remoteHistory: RemoteHistory
}

interface stateHistory {
    isLoading: boolean
    mainError: string
}

const History: React.FC<HistoryProps> = ({remoteHistory}: HistoryProps) => {

    // M.AutoInit() здесь не вызываем: на каждом рендере он заново инициализировал
    // все селекты, календари и модалки страницы. Виджеты инициализируют свои компоненты.

    const [state, setState] = useState<stateHistory>({
        isLoading: false,
        mainError: '',
    })

    const [approaches, setApproaches] = useState<IApproach[]>([])
    const [listExercises, setListExercises] = useState<TItem[]>([])
    // Номер применённого фильтра: по его смене список возвращается на первую страницу
    const [filterVersion, setFilterVersion] = useState(0)
    // Модалка одна - для подхода, который открыли на редактирование
    const [editApproach, setEditApproach] = useState<IApproach | null>(null)

    const getExercises = (data: TItem[]): TItem[] => {
        const variantColor: TColorHistory[] = ['green', 'yellow', 'red', '']
        let countColor = 0
        data.map(e => {
            e.color = variantColor[countColor]
            if (countColor < variantColor.length - 1) {
                countColor += 1
            }
            return e
        })
        return data
    }

    // exercises - id выбранных упражнений (пусто - все), date - 'YYYY-MM-DD' (пусто - любая)
    const filterApproaches = (exercises: number[], date: string) => {
        const copyApproaches = approaches.map(a => ({
            ...a,
            visible: (exercises.length === 0 || exercises.includes(a.combination.exercise.id))
                && (date === '' || a.date === date)
        }))
        setApproaches(copyApproaches)
        setFilterVersion(filterVersion + 1)
    }

    const removeApproach = async (params: TRemoveApproach): Promise<void> => {
        try {
            setState({...state, isLoading: true})

            await remoteHistory.remove(params)

            const copyApproaches = approaches.filter(a => a.id !== params.id)
            setApproaches(copyApproaches)
            setState({...state, isLoading: false})
            toast.success('Success remove', {theme: 'colored'})
        } catch (error: any) {
            setState({
                ...state,
                isLoading: false,
                mainError: error.message
            })
        }
    }

    useEffect(() => {
        setState({...state, isLoading: true})
        remoteHistory.get()
            .then((response: RemoteHistoryModel) => {
                setApproaches(response.approaches)
                setListExercises(getExercises(response.exercises))
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

    useEffect(() => {
        if (!editApproach) {
            return
        }
        const elem = document.getElementById('modal' + editApproach.id)
        if (!elem) {
            return
        }
        const instance = M.Modal.init(elem, {onCloseEnd: () => setEditApproach(null)})
        instance.open()
        return () => instance.destroy()
    }, [editApproach])

    return (
        <div className="content">
            <Header title='HYSTORY' icon='history' />
            <main>
                <div className="container">
                    <div className="row">
                        {state.isLoading && <Spinner />}
                        {listExercises.length !== 0 && <FilterHistory arrayExercises={listExercises} filterApproaches={filterApproaches} />}
                        {listExercises.length !== 0 && <CollectionHistory arrayApproaches={approaches} arrayExercises={listExercises} removeApproach={removeApproach} editApproach={setEditApproach} filterVersion={filterVersion} />}
                        {editApproach && <ModalHistory key={editApproach.id} approache={editApproach} arrayExercises={listExercises} />}
                    </div>

                </div>
            </main>

            <FloatingActionButton />

            <Footer />
        </div>
    )
}

export default History