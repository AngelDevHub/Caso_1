import { EnrollmentRequest } from "../../entities/Enrollment"
import {
  EnrollmentValidationHandler,
  ValidationResult
} from "./EnrollmentValidationHandler"

export interface PaymentValidator {
  validarPago(request: EnrollmentRequest): Promise<boolean>
}

export class PaymentValidationHandler extends EnrollmentValidationHandler {
  constructor(private readonly paymentValidator: PaymentValidator) {
    super()
  }

  protected async doHandle(
    request: EnrollmentRequest
  ): Promise<ValidationResult> {
    const pagoValido = await this.paymentValidator.validarPago(request)
    if (!pagoValido) {
      return {
        exito: false,
        mensaje: "El pago de inscripción no es válido o no fue registrado"
      }
    }

    return { exito: true }
  }
}

