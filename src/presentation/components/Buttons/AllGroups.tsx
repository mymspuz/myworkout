import React from 'react'
import {typeButton, typeButtons} from '../../../domain/models'
import GroupsButtons from './GroupsButtons'

type typeBtn = {
    id: number
    btn: typeButton
    btns: typeButtons
}

const AllGroups: React.FC = () => {
    const params: typeBtn[] = [
        {id: 1, btn: 'grip', btns: 'grips'},
        {id: 2, btn: 'arm_width', btns: 'arms'},
        {id: 3, btn: 'equipment', btns: 'equipments'}
    ]

    return (
        <>
        {
            params.map((p) => (
                <GroupsButtons nameBtnGroup={p.btns} nameBtn={p.btn} key={p.id}/>
            ))
        }
        </>
    )
}

export default AllGroups