import { EnrollmentRequest } from "../../entities/Enrollment"
import { CourseRepository } from "../../repositories/CourseRepository"
import {
  EnrollmentValidationHandler,
  ValidationResult
} from "./EnrollmentValidationHandler"

export class SeatsValidationHandler extends EnrollmentValidationHandler {
  constructor(private readonly courseRepository: CourseRepository) {
    super()
  }

  protected async doHandle(
    request: EnrollmentRequest
  ): Promise<ValidationResult> {
    const course = await this.courseRepository.findById(request.courseId)
    if (!course) {
      return { exito: false, mensaje: "Curso no encontrado" }
    }

    if (course.cuposOcupados >= course.cuposTotales) {
      return {
        exito: false,
        mensaje: "No hay cupos disponibles para este curso"
      }
    }

    return { exito: true }
  }
}

