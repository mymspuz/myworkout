import {IFieldValidation} from '../../protocols'
import {
    RequiredFieldValidation,
    EmailFieldValidation,
    MinLengthValidation,
    CompareFieldsValidation,
    NumberFieldValidation, FloatFieldValidation, MinNumberFieldValidation
} from '../../../validation/validators'

export class ValidationBuilder {
    private constructor(
       private readonly fieldName: string,
       private readonly validations: IFieldValidation[]
    ) {}

    static field(fieldName: string): ValidationBuilder {
        return new ValidationBuilder(fieldName, [])
    }

    required(): ValidationBuilder {
        this.validations.push(new RequiredFieldValidation(this.fieldName))
        return this
    }

    email(): ValidationBuilder {
        this.validations.push(new EmailFieldValidation(this.fieldName))
        return this
    }

    min(length: number): ValidationBuilder {
        this.validations.push(new MinLengthValidation(this.fieldName, length))
        return this
    }

    compare(fieldToCompare: string): ValidationBuilder {
        this.validations.push(new CompareFieldsValidation(this.fieldName, fieldToCompare))
        return this
    }

    float(): ValidationBuilder {
        this.validations.push(new FloatFieldValidation(this.fieldName))
        return this
    }

    numeric(): ValidationBuilder {
        this.validations.push(new NumberFieldValidation(this.fieldName))
        return this
    }

    numericMin(value: number): ValidationBuilder {
        this.validations.push(new MinNumberFieldValidation(this.fieldName, value))
        return this
    }

    build(): IFieldValidation[] {
        return this.validations
    }
}