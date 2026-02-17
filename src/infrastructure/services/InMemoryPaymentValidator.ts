import { EnrollmentRequest } from "../../domain/entities/Enrollment"
import { PaymentValidator } from "../../domain/services/validation/PaymentValidationHandler"

export class InMemoryPaymentValidator implements PaymentValidator {
  async validarPago(request: EnrollmentRequest): Promise<boolean> {
    return request.pagoRegistrado
  }
}

