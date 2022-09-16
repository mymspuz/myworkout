import {ValidationBuilder, ValidationComposite} from '../../../../validation/validators'

export const makeCombinationValidation = (): ValidationComposite => {
    return ValidationComposite.build([
        ...ValidationBuilder.field('repeats').required().numeric().numericMin(1).build(),
        ...ValidationBuilder.field('weighting').required().float().numericMin(0).build()
    ])
}