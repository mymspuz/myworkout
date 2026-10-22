import {ValidationBuilder, ValidationComposite} from '../../../../validation/validators'

export const makeGoalsValidation = (): ValidationComposite => {
    return ValidationComposite.build([
        ...ValidationBuilder.field('value').required().numeric().numericMin(1).build()
    ])
}
