import React, {useContext, useEffect, useState} from 'react'
import {CombinationContext} from '../../hooks'
import {CombinationModel, ItemCombinationModel, typeButton, typeButtons} from '../../../domain/models'


type GroupBtnProps = {
    nameBtnGroup: typeButtons,
    nameBtn: typeButton
}

const GroupsButtons: React.FC<GroupBtnProps> = ({ nameBtnGroup, nameBtn }: GroupBtnProps) => {

    const { getButtons, setButton, getDependence, currentCombination, combinations } = useContext(CombinationContext)
    const [listButtons, setListButtons] = useState<ItemCombinationModel[]>(getButtons(nameBtnGroup))
    const [visibleGroup, setVisibleGroup] = useState<boolean>(false)
    const dependence = getDependence(nameBtn)

    const findCombination = (combination: CombinationModel, idBtn: number): boolean => {
        if (combination[dependence] && combination[nameBtn]) {
            return combination[dependence] === currentCombination[dependence] && combination[nameBtn] === idBtn
        }
        return false
    }

    useEffect(() => {
        const clone: ItemCombinationModel[] = [...listButtons]
        if (currentCombination[dependence]) {
            clone.map((item) => {
                return item.visible = combinations.some((c) => findCombination(c, item.id) )
            })
        } else {
            clone.map((item) => {
                return item.visible = false
            })
        }
        const check: ItemCombinationModel[] = clone.filter((i) => !i.visible && i.id === currentCombination[nameBtn])
        if (check.length) {
            console.log(nameBtn, clone, check)
            setButton(nameBtn, check[0].id)
        }
        setListButtons(clone)
        const nowVisible: boolean = clone.some((c) => c.visible)
        setVisibleGroup(nowVisible)
    }, [currentCombination])

    return (
        <div className="row">
            {visibleGroup &&
            <div className="card">
                <div className="card-content center">
                    <span className="card-title center">{nameBtnGroup}</span>
                    {listButtons && listButtons.map((item: ItemCombinationModel) => (
                        item.visible &&
                        <button
                            className={item.id === currentCombination[nameBtn] ? 'waves-effect waves-light btn red' : 'waves-effect waves-light btn'}
                            key={item.id}
                            onClick={() => setButton(nameBtn, item.id)}
                        >
                            {item.name}
                        </button>
                    ))}
                </div>
            </div>
            }
        </div>
    )
}

export default GroupsButtons