import React, { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'

import { IApproach, TItem, TRemoveApproach } from 'domain/models'

type CollectionHistoryProps = {
    arrayApproaches: IApproach[]
    arrayExercises: TItem[]
    removeApproach(params: TRemoveApproach): Promise<void>
    editApproach(approach: IApproach): void
    filterVersion: number
}

const CollectionHistory: React.FC<CollectionHistoryProps> = ({arrayApproaches, arrayExercises, removeApproach, editApproach, filterVersion}: CollectionHistoryProps) => {

    const [collection, setCollection] = useState<IApproach[]>([])
    const [displayApproaches, setDisplayApproaches] = useState<JSX.Element[]>([])

    const [page, setPage] = useState(0)
    const approachesPerPage = 5
    const numberOfApproachesVistited = page * approachesPerPage
    const totalPages = Math.ceil(collection.length / approachesPerPage)
    const changePage = (selectedItem: { selected: number }) => {
        setPage(selectedItem.selected)
    }

    useEffect(() => {
        const paginationApproaches = collection
            .slice(
                numberOfApproachesVistited,
                numberOfApproachesVistited + approachesPerPage
            )
            .map(e => {
                return (
                    <li key={e.id} className="collection-item avatar">
                        <i className={"material-icons circle " + e.combination.exercise.color}>fitness_center</i>
                        <span className="title">{e.combination.exercise.name}</span>
                        <p>
                            {e.date}
                            <br />
                            {e.combination.grip.name + ' / ' + e.combination.arm.name + ' - ' + e.value + ' / ' + e.weight}
                            {e.combination.equipment && (' (' + e.combination.equipment.name + ')')}
                        </p>
                        <button
                            className="btn secondary-content"
                            onClick={() => editApproach(e)}
                        >
                            <i className="material-icons">create</i>
                        </button>
                        <button
                            className="btn third-content red"
                            onClick={() => removeApproach({id: e.id})}
                        >
                            <i className="material-icons">delete</i>
                        </button>
                    </li>
                )
            })
        setDisplayApproaches(paginationApproaches)
    }, [collection, page])

    useEffect(() => {
        const result: IApproach[] = arrayApproaches
            .filter(c => c.visible)
            .map(e => {
                const color = arrayExercises.filter(i => i.id === e.combination.exercise.id)
                color ? e.combination.exercise.color = color[0].color : e.combination.exercise.color = ''
                return e
            })
        setCollection(result)
    }, [arrayApproaches])

    // Новый фильтр - с первой страницы, иначе со страницы 300 из 533 после фильтра ничего не видно
    useEffect(() => {
        setPage(0)
    }, [filterVersion])

    // После удаления последней записи на последней странице - шаг назад
    useEffect(() => {
        if (page > 0 && page >= totalPages) {
            setPage(Math.max(0, totalPages - 1))
        }
    }, [totalPages])

    return (
        <>
            <div className="col s12 m10 offset-m1">
                <ul className="collection">{displayApproaches}</ul>
            </div>
            <div className="col s12 m10 offset-m1 center">
                <ReactPaginate
                    previousLabel={<i className="material-icons">chevron_left</i>}
                    nextLabel={<i className="material-icons">chevron_right</i>}
                    pageCount={totalPages}
                    forcePage={page}
                    onPageChange={changePage}
                    containerClassName={"pagination"}
                    previousLinkClassName={"previousButton"}
                    nextLinkClassName={"nextButton"}
                    disabledClassName={"disabled"}
                    activeClassName={"active"}
                />
            </div>
        </>
    )
}

export default CollectionHistory