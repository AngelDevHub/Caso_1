import { EnrollmentRequest, EnrollmentResult } from "../domain/entities/Enrollment"

export interface EnrollmentService {
  inscribir(request: EnrollmentRequest): Promise<EnrollmentResult>
}

