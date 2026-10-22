import React from 'react'

import { IGoalItem, TRemoveGoal } from 'domain/models'

type CollectionGoalsProps = {
    arrayGoals: IGoalItem[]
    removeGoal(params: TRemoveGoal): Promise<void>
}

interface IGoalStatus {
    icon: string
    color: string
    text: string
}

const getStatus = (goal: IGoalItem): IGoalStatus => {
    // plan - сколько должно быть сделано к концу сегодняшнего дня, разница с ним и есть опережение/отставание
    const diff = goal.done - goal.plan
    switch (true) {
        case goal.done >= goal.value:
            return {icon: 'check_circle', color: 'green', text: 'Цель выполнена'}
        case diff > 0:
            return {icon: 'trending_up', color: 'green', text: `Опережение: +${diff}`}
        case diff < 0:
            return {icon: 'trending_down', color: 'red', text: `Отставание: ${diff}`}
        default:
            return {icon: 'trending_flat', color: 'blue', text: 'Идём по плану'}
    }
}

const CollectionGoals: React.FC<CollectionGoalsProps> = ({arrayGoals, removeGoal}: CollectionGoalsProps) => {

    if (!arrayGoals.length) {
        return (
            <div className="col s12 center grey-text">
                <p>Целей на этот месяц пока нет</p>
            </div>
        )
    }

    return (
        <div className="col s12 m10 offset-m1">
            <ul className="collection">
                {arrayGoals.map(g => {
                    const status = getStatus(g)
                    const percent = Math.min(100, Math.round(g.done * 100 / g.value))
                    return (
                        <li key={g.id} className="collection-item avatar goal-item">
                            <i className={"material-icons circle " + status.color}>{status.icon}</i>
                            <span className="title">{g.exercise.name}</span>
                            <p>
                                {g.done + ' / ' + g.value}
                                <br />
                                {'план на сегодня: ' + g.plan}
                                <br />
                                <span className={status.color + '-text'}>{status.text}</span>
                            </p>
                            <div className="progress">
                                <div className="determinate" style={{width: percent + '%'}} />
                            </div>
                            <button
                                className="btn secondary-content red"
                                onClick={() => removeGoal({id: g.id})}
                            >
                                <i className="material-icons">delete</i>
                            </button>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default CollectionGoals
