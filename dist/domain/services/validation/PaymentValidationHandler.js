"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentValidationHandler = void 0;
const EnrollmentValidationHandler_1 = require("./EnrollmentValidationHandler");
class PaymentValidationHandler extends EnrollmentValidationHandler_1.EnrollmentValidationHandler {
    constructor(paymentValidator) {
        super();
        this.paymentValidator = paymentValidator;
    }
    async doHandle(request) {
        const pagoValido = await this.paymentValidator.validarPago(request);
        if (!pagoValido) {
            return {
                exito: false,
                mensaje: "El pago de inscripción no es válido o no fue registrado"
            };
        }
        return { exito: true };
    }
}
exports.PaymentValidationHandler = PaymentValidationHandler;
