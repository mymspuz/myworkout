export type RemoteCombinationModel = {
    id: number
    exercise: string
    grip: string
    arm_width: string
    equipment: string | null
}

export type CombinationModel = {
    id: number
    exercise: number
    grip: number
    arm_width: number
    equipment: number | null
}

export type ItemCombinationModel = {
    id: number
    name: string
    visible?: boolean
}

export type typeButtons = 'grips' | 'arms' | 'equipments'

export type typeButton = 'exercise' | 'grip' | 'arm_width' | 'equipment'

export const defaultCombinationModel: CombinationModel = {
    id: 0,
    exercise: 0,
    grip: 0,
    arm_width: 0,
    equipment: 0
}