import { Course } from "../entities/Course"

export interface CourseRepository {
  findById(id: string): Promise<Course | null>
  save(course: Course): Promise<void>
}

