export class UnexpectedError extends Error {
    constructor(message?: string) {
        super(message || 'Unexpected error')
        this.name = 'UnexpectedError'
    }
}