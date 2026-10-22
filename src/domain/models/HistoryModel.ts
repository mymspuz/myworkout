export type TItem = {
    id: number
    name: string
    color?: TColorHistory
}

export type TColorHistory = '' | 'green' | 'yellow' | 'red'

export type TRemoveApproach = {
    id: number
}

export type TCombination = {
    id: number
    exercise: TItem
    grip: TItem
    arm: TItem
    equipment: TItem | null
}

export interface IApproach {
    id: number
    date: string
    value: number
    weight: number
    combination: TCombination
    visible: boolean
}

export type TUpdateApproach = {
    id: number
    combination: number
    // 'YYYY-MM-DD'; время подхода сервер оставляет прежним
    date: string
    value: number
    weight: number
}

export interface RemoteHistoryModel {
    exercises: TItem[]
    approaches: IApproach[]
    // все комбинации упражнений - для выбора варианта при редактировании
    combinations: TCombination[]
}