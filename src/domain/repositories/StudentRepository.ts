import { Student } from "../entities/Student"

export interface StudentRepository {
  findById(id: string): Promise<Student | null>
}

