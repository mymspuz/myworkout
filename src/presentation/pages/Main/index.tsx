import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import {Footer, Header} from '../../components'
import FloatingActionButton from '../../components/Buttons/FloatingActionButton'
import {RemoteExercise} from '../../../data/exercise'
import {ExerciseModel} from '../../../domain/models'
import Spinner from '../../components/FormLoaderStatus/Spinner'
import {toast} from 'react-toastify'

type MainProps = {
    remoteExercises: RemoteExercise
}

const Main: React.FC<MainProps> = ({remoteExercises}: MainProps) => {

    const [state, setState] = useState({
        isLoading: false,
        mainError: ''
    })

    const [exercises, setExercises] = useState<ExerciseModel[]>([])

    useEffect(() => {
        setState({...state, isLoading: true})
        remoteExercises.getAll()
            .then((response) => {
                setExercises(response)
                setState({...state, isLoading: false})
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
            <Header title='MAIN' icon='home' />
            <main>
                {state.isLoading && <Spinner />}
                <div className="container">
                    <div className="row">
                        <div className="col s12 m4 offset-m4 center">
                            {exercises && exercises.map((exercise: ExerciseModel) => (
                                <Link
                                    to={`/exercises/${exercise.id}`}
                                    className="waves-effect waves-light btn-large btn-my"
                                    key={exercise.id}
                                >
                                    {exercise.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <FloatingActionButton />

            <Footer />
        </div>
    )
}

export default Main