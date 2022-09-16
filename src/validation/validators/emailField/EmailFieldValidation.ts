import {IFieldValidation} from '../../protocols'
import {InvalidFieldError} from '../../errors'

export class EmailFieldValidation implements IFieldValidation {
    constructor(readonly field: string) {}

    validate(input: object): Error | null {
        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        // @ts-ignore
        return !input[this.field] || emailRegex.test(input[this.field]) ? null : new InvalidFieldError()
    }
}