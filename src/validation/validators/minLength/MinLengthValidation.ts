import {IFieldValidation} from '../../protocols'
import {InvalidFieldError} from '../../errors'

export class MinLengthValidation implements IFieldValidation {
    constructor(readonly field: string, private readonly minLength: number) {}

    validate(input: object): Error | null {
        // @ts-ignore
        return input[this.field]?.length < this.minLength ? new InvalidFieldError() : null
    }
}