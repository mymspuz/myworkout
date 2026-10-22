export class MaxNumberValueError extends Error {
    constructor(private readonly maxValue: number) {
        super(`Value must be less ${maxValue}`)
    }
}
