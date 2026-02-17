import {
  EnrollmentRequest,
  EnrollmentResult
} from "../../domain/entities/Enrollment"
import { EnrollmentRepository } from "../../domain/repositories/EnrollmentRepository"

export class InMemoryEnrollmentRepository implements EnrollmentRepository {
  private enrollments: EnrollmentRequest[] = []

  async registrarInscripcion(
    request: EnrollmentRequest
  ): Promise<EnrollmentResult> {
    this.enrollments.push(request)
    return {
      exito: true,
      mensaje: "Inscripción registrada correctamente"
    }
  }
}

