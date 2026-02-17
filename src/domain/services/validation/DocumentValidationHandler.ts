import { EnrollmentRequest } from "../../entities/Enrollment"
import {
  EnrollmentValidationHandler,
  ValidationResult
} from "./EnrollmentValidationHandler"

export class DocumentValidationHandler extends EnrollmentValidationHandler {
  protected async doHandle(
    request: EnrollmentRequest
  ): Promise<ValidationResult> {
    if (!request.documentosCompletos) {
      return {
        exito: false,
        mensaje: "Documentación incompleta para la inscripción"
      }
    }

    return { exito: true }
  }
}

