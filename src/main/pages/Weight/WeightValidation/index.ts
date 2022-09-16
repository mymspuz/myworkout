import {ValidationBuilder, ValidationComposite} from '../../../../validation/validators';

export const makeWeightValidation = (): ValidationComposite => {
    return ValidationComposite.build([
        ...ValidationBuilder.field('weight').required().float().numericMin(10).build()
    ])
}