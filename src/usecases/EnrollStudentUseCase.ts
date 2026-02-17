import { EnrollmentRequest, EnrollmentResult } from "../domain/entities/Enrollment"
import { StudentRepository } from "../domain/repositories/StudentRepository"
import { CourseRepository } from "../domain/repositories/CourseRepository"
import { EnrollmentRepository } from "../domain/repositories/EnrollmentRepository"
import {
  DocumentValidationHandler
} from "../domain/services/validation/DocumentValidationHandler"
import {
  SeatsValidationHandler
} from "../domain/services/validation/SeatsValidationHandler"
import {
  PaymentValidationHandler,
  PaymentValidator
} from "../domain/services/validation/PaymentValidationHandler"
import { EnrollmentService } from "./EnrollmentService"

export class EnrollStudentUseCase implements EnrollmentService {
  private readonly validationChain: DocumentValidationHandler

  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly courseRepository: CourseRepository,
    private readonly enrollmentRepository: EnrollmentRepository,
    paymentValidator: PaymentValidator
  ) {
    const documentValidation = new DocumentValidationHandler()
    const seatsValidation = new SeatsValidationHandler(this.courseRepository)
    const paymentValidation = new PaymentValidationHandler(paymentValidator)

    documentValidation.setNext(seatsValidation).setNext(paymentValidation)
    this.validationChain = documentValidation
  }

  async inscribir(request: EnrollmentRequest): Promise<EnrollmentResult> {
    const student = await this.studentRepository.findById(request.studentId)
    if (!student) {
      return { exito: false, mensaje: "Alumno no encontrado" }
    }

    const validationResult = await this.validationChain.handle(request)
    if (!validationResult.exito) {
      return {
        exito: false,
        mensaje: validationResult.mensaje ?? "Error en la validación"
      }
    }

    const result = await this.enrollmentRepository.registrarInscripcion(request)

    if (result.exito) {
      const course = await this.courseRepository.findById(request.courseId)
      if (course) {
        course.cuposOcupados += 1
        await this.courseRepository.save(course)
      }
    }

    return result
  }
}

