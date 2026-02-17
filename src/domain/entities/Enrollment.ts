export interface EnrollmentRequest {
  studentId: string
  courseId: string
  documentosCompletos: boolean
  pagoRegistrado: boolean
}

export interface EnrollmentResult {
  exito: boolean
  mensaje: string
}

