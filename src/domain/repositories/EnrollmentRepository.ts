import { EnrollmentRequest, EnrollmentResult } from "../entities/Enrollment"

export interface EnrollmentRepository {
  registrarInscripcion(request: EnrollmentRequest): Promise<EnrollmentResult>
}

