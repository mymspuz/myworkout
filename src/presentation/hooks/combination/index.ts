import {createContext} from 'react'
import {
    CombinationModel,
    defaultCombinationModel,
    ItemCombinationModel,
    typeButton,
    typeButtons
} from '../../../domain/models'

type CombinationProps = {
    getButtons: (nameBtn: typeButtons) => ItemCombinationModel[]
    setButton: (btn: typeButton, idBtn: number) => void
    getDependence: (nameBtn: typeButton) => typeButton,
    currentCombination: CombinationModel,
    combinations: CombinationModel[]
}

export default createContext<CombinationProps>({
    getButtons(): ItemCombinationModel[] {return []},
    setButton(): void {},
    getDependence(): typeButton {return 'exercise'},
    currentCombination: defaultCombinationModel,
    combinations: []
})