import React, {useEffect, useState} from 'react'
import {
    CombinationModel,
    defaultCombinationModel,
    ItemCombinationModel,
    RemoteCombinationModel, typeButton, typeButtons
} from '../../../domain/models'
import {IValidation} from '../../protocols/validation';
import {RemoteCombination} from '../../../data/combination';
import {Footer, Header} from '../../components';
import {CombinationContext} from '../../hooks';
import Spinner from '../../components/FormLoaderStatus/Spinner';
import FormCombinations from '../../components/FormCombinations';
import FloatingActionButton from '../../components/Buttons/FloatingActionButton';
import AllGroups from '../../components/Buttons/AllGroups';

type CombinationProps = {
    validation: IValidation
    remoteCombinations: RemoteCombination
    exerciseId: number
}

type typeItemName = 'id' | 'exercise' | 'grip' | 'arm_width' | 'equipment'

interface IState {
    isLoading: boolean
    isFormInvalid: boolean
    mainError: string
    idCombination: number
    currentCombination: CombinationModel
    combinations: CombinationModel[]
    exercises: ItemCombinationModel[]
    grips: ItemCombinationModel[]
    arms: ItemCombinationModel[]
    equipments: ItemCombinationModel[]
}

const Combination: React.FC<CombinationProps> = ({
    validation,
    remoteCombinations,
    exerciseId
}: CombinationProps) => {
    const [state, setState] = useState<IState>({
        isLoading: true,
        isFormInvalid: true,
        mainError: '',
        idCombination: 0,
        currentCombination: Object.assign(defaultCombinationModel, {exercise: exerciseId}),
        combinations: [],
        exercises: [],
        grips: [],
        arms: [],
        equipments: []
    })

    const getCombinations = (remoteResponse: RemoteCombinationModel[]): CombinationModel [] => {
        const result: CombinationModel[] = []
        remoteResponse.forEach((item: RemoteCombinationModel) => {
            result.push({
                id: item.id,
                exercise: Number(exerciseId),
                grip: Number(item.grip.split(':')[0]),
                arm_width: Number(item.arm_width.split(':')[0]),
                equipment: item.equipment ? Number(item.equipment.split(':')[0]) : 0
            })
        })
        return result
    }

    const getItems = (
        remoteResponse: RemoteCombinationModel[],
        itemName: typeItemName,
        visible: boolean = false
    ): ItemCombinationModel [] => {
        const result: ItemCombinationModel[] = []
        remoteResponse.forEach((item: RemoteCombinationModel) => {
            const value: number | string | null = item[itemName]
            if (typeof value === 'string') {
                const candidate: ItemCombinationModel = {
                    id: Number(value.split(':')[0]),
                    name: value.split(':')[1],
                    visible: visible
                }
                if (!result.some(i => i.id === candidate.id)) {
                    result.push(candidate)
                }
            }
        })
        return result
    }

    const getButtonsInfo = (btnName: typeButtons): ItemCombinationModel[] => {
        return state[btnName]
    }

    const getDependence = (btn: typeButton): typeButton => {
        switch (btn) {
            case 'grip':
                return 'exercise'
            case 'arm_width':
                return 'grip'
            case 'equipment':
                return 'arm_width'
            default:
                return 'exercise'
        }
    }

    const checkCombination = (i: CombinationModel, c: CombinationModel): boolean => {
        return i.exercise === c.exercise && i.grip === c.grip && i.arm_width === c.arm_width && i.equipment === c.equipment
    }

    const setButton = (btn: typeButton, id: number): void => {
        const current: CombinationModel = {
            id: state.currentCombination.id,
            exercise: state.currentCombination.exercise,
            grip: state.currentCombination.grip,
            arm_width: state.currentCombination.arm_width,
            equipment: state.currentCombination.equipment
        }
        current[btn] === id ? current[btn] = 0 : current[btn] = id
        const checkArray: CombinationModel[] = state.combinations.filter((i) => checkCombination(i, current))
        current.id = (checkArray.length) ? checkArray[0].id : 0

        setState({...state, currentCombination: current})
    }

    useEffect(() => {
        setState({...state, isLoading: true})
        remoteCombinations.get()
                .then((response) => {
                    const combinations: CombinationModel[] = getCombinations(response)
                    const exercises: ItemCombinationModel[] = getItems(response, 'exercise', true)
                    const grips: ItemCombinationModel[] = getItems(response, 'grip', true)
                    const arms: ItemCombinationModel[] = getItems(response, 'arm_width')
                    const equipments: ItemCombinationModel[] = getItems(response, 'equipment')

                    setState({
                        ...state,
                        isLoading: false,
                        mainError: '',
                        combinations,
                        exercises,
                        grips,
                        arms,
                        equipments
                    })
                })
                .catch((e: Error) => {
                    setState({...state, isLoading: false, mainError: e.message})
                })
    }, [])

    return (
        <div className="content">
            {state.isLoading
                ? <Header title='Loading...' icon='fitness_center' />
                : <Header title={state.exercises[0].name} icon='fitness_center' />
            }
            <main>
                <div className="container">
                    <CombinationContext.Provider
                        value={{
                            getButtons: getButtonsInfo,
                            setButton: setButton,
                            getDependence: getDependence,
                            currentCombination: state.currentCombination,
                            combinations: state.combinations
                        }}
                    >
                        {state.isLoading && <Spinner />}
                        {!state.isLoading && <AllGroups />}
                        <FormCombinations validation={validation} remoteCombinations={remoteCombinations} />
                    </CombinationContext.Provider>

                </div>
            </main>

            <FloatingActionButton />

            <Footer />
        </div>
    )
}

export default Combination