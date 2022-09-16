import {IFieldValidation} from '../../../validation/protocols'
import {InvalidFieldError} from '../../../validation/errors'

export class CompareFieldsValidation implements IFieldValidation {
    constructor(
        readonly field: string,
        private readonly valueToCompare: string
    ) {}

    validate(input: object): Error | null {
        // @ts-ignore
        return input[this.field] !== input[this.valueToCompare]
                ? new InvalidFieldError()
                : null
    }
}