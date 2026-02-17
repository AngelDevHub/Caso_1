"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollmentValidationHandler = void 0;
class EnrollmentValidationHandler {
    setNext(handler) {
        this.nextHandler = handler;
        return handler;
    }
    async handle(request) {
        const result = await this.doHandle(request);
        if (!result.exito) {
            return result;
        }
        if (this.nextHandler) {
            return this.nextHandler.handle(request);
        }
        return { exito: true };
    }
}
exports.EnrollmentValidationHandler = EnrollmentValidationHandler;
