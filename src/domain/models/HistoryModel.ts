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

export interface RemoteHistoryModel {
    exercises: TItem[]
    approaches: IApproach[]
}