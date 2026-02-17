"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentValidationHandler = void 0;
const EnrollmentValidationHandler_1 = require("./EnrollmentValidationHandler");
class DocumentValidationHandler extends EnrollmentValidationHandler_1.EnrollmentValidationHandler {
    async doHandle(request) {
        if (!request.documentosCompletos) {
            return {
                exito: false,
                mensaje: "Documentación incompleta para la inscripción"
            };
        }
        return { exito: true };
    }
}
exports.DocumentValidationHandler = DocumentValidationHandler;
