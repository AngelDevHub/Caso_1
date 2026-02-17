import { Student } from "../../domain/entities/Student"
import { StudentRepository } from "../../domain/repositories/StudentRepository"

export class InMemoryStudentRepository implements StudentRepository {
  private students: Student[] = [
    {
      id: "1",
      nombre: "Ana",
      apellido: "Pérez",
      documento: "12345678",
      email: "ana.perez@example.com"
    },
    {
      id: "2",
      nombre: "Juan",
      apellido: "García",
      documento: "87654321",
      email: "juan.garcia@example.com"
    }
  ]

  async findById(id: string): Promise<Student | null> {
    const student = this.students.find((s) => s.id === id)
    return student ?? null
  }
}

