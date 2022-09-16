export class MinNumberValueError extends Error {
    constructor(private readonly minValue: number) {
        super(`Value must be greater ${minValue}`)
    }
}