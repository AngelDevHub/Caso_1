"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryPaymentValidator = void 0;
class InMemoryPaymentValidator {
    async validarPago(request) {
        return request.pagoRegistrado;
    }
}
exports.InMemoryPaymentValidator = InMemoryPaymentValidator;
