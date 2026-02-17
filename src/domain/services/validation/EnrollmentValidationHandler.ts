import { EnrollmentRequest } from "../../entities/Enrollment"

export interface ValidationResult {
  exito: boolean
  mensaje?: string
}

export abstract class EnrollmentValidationHandler {
  private nextHandler?: EnrollmentValidationHandler

  setNext(handler: EnrollmentValidationHandler): EnrollmentValidationHandler {
    this.nextHandler = handler
    return handler
  }

  async handle(request: EnrollmentRequest): Promise<ValidationResult> {
    const result = await this.doHandle(request)
    if (!result.exito) {
      return result
    }
    if (this.nextHandler) {
      return this.nextHandler.handle(request)
    }
    return { exito: true }
  }

  protected abstract doHandle(
    request: EnrollmentRequest
  ): Promise<ValidationResult>
}

