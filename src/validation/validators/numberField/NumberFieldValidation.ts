import {IFieldValidation} from '../../protocols'
import {InvalidFieldError} from '../../errors';
import {MinNumberValueError} from '../../errors/MinNumberValueError';

export class FloatFieldValidation implements IFieldValidation {
    constructor(readonly field: string) {}

    validate(input: object): Error | null {
        const numberRegex = /^\d+[.,]?\d+?$/
        const oneNumberRegex = /^\d$/
        // @ts-ignore
        return !input[this.field] || oneNumberRegex.test(input[this.field]) || numberRegex.test(input[this.field]) ? null : new InvalidFieldError()
    }
}

export class NumberFieldValidation implements IFieldValidation {
    constructor(readonly field: string) {}

    validate(input: object): Error | null {
        // @ts-ignore
        return !input[this.field] || (!isNaN(parseFloat(input[this.field])) && isFinite(Number(input[this.field]))) ? null : new InvalidFieldError()
    }
}

export class MinNumberFieldValidation implements IFieldValidation {
    constructor(readonly field: string, private readonly minValue: number) {}

    validate(input: object): Error | null {
        // @ts-ignore
        return !input[this.field] || Number(input[this.field].replace(',', '.')) >= this.minValue ? null : new MinNumberValueError(this.minValue)
    }
}