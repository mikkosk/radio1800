export class ErrorWithStatus extends Error {
    status: number | undefined;
    constructor(message: string | undefined, status: number | undefined) {
        super(message);
        this.status = status;
    }
}