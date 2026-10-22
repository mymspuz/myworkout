import {ValidationBuilder, ValidationComposite} from '../../../../validation/validators'

// Те же правила, что при добавлении подхода (CombinationValidation)
export const makeHistoryValidation = (): ValidationComposite => {
    return ValidationComposite.build([
        ...ValidationBuilder.field('repeats').required().numeric().numericMin(1).build(),
        ...ValidationBuilder.field('weighting').required().float().numericMin(0).build()
    ])
}
