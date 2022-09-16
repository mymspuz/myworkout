import {ValidationBuilder, ValidationComposite} from '../../../../validation/validators'

export const makeLoginValidation = (): ValidationComposite => {
    return ValidationComposite.build([
        ...ValidationBuilder.field('username').required().min(5).build(),
        ...ValidationBuilder.field('password').required().min(4).build()
    ])
}