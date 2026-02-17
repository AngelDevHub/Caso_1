import { Course } from "../../domain/entities/Course"
import { CourseRepository } from "../../domain/repositories/CourseRepository"

export class InMemoryCourseRepository implements CourseRepository {
  private courses: Course[] = [
    {
      id: "curso-1",
      nombre: "Introducción a la Programación",
      cuposTotales: 2,
      cuposOcupados: 0,
      montoInscripcion: 100
    },
    {
      id: "curso-2",
      nombre: "Arquitecturas Limpias",
      cuposTotales: 1,
      cuposOcupados: 0,
      montoInscripcion: 150
    }
  ]

  async findById(id: string): Promise<Course | null> {
    const course = this.courses.find((c) => c.id === id)
    return course ?? null
  }

  async save(course: Course): Promise<void> {
    const index = this.courses.findIndex((c) => c.id === course.id)
    if (index >= 0) {
      this.courses[index] = course
    } else {
      this.courses.push(course)
    }
  }
}

