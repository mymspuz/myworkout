import {ValidationBuilder, ValidationComposite} from '../../../../validation/validators'

export const makeCombinationValidation = (): ValidationComposite => {
    return ValidationComposite.build([
        ...ValidationBuilder.field('repeats').required().numeric().numericMin(1).build(),
        ...ValidationBuilder.field('weighting').required().float().numericMin(0).build(),
        // Верхняя граница совпадает с MAX_ROUNDS на сервере (exercise_views.py)
        ...ValidationBuilder.field('rounds').required().numeric().numericMin(1).numericMax(20).build()
    ])
}