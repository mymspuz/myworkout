import {IFieldValidation} from '../../../validation/protocols'
import {RequiredFieldError} from '../../../validation/errors'

export class RequiredFieldValidation implements IFieldValidation {
    constructor(readonly field: string) {}

    validate(input: object): Error | null {
        // @ts-ignore
        return input[this.field] ? null : new RequiredFieldError()
    }
}