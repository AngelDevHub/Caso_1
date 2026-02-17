import { Request, Response, Router } from "express"
import { EnrollmentService } from "../../usecases/EnrollmentService"
import { EnrollmentRequest } from "../../domain/entities/Enrollment"

export function createEnrollmentRouter(
  enrollmentService: EnrollmentService
): Router {
  const router = Router()

  router.post("/enrollments", async (req: Request, res: Response) => {
    const body = req.body as Partial<EnrollmentRequest>

    if (!body.studentId || !body.courseId) {
      return res
        .status(400)
        .json({ exito: false, mensaje: "studentId y courseId son obligatorios" })
    }

    const request: EnrollmentRequest = {
      studentId: body.studentId,
      courseId: body.courseId,
      documentosCompletos: body.documentosCompletos ?? false,
      pagoRegistrado: body.pagoRegistrado ?? false
    }

    try {
      const result = await enrollmentService.inscribir(request)
      const status = result.exito ? 200 : 400
      return res.status(status).json(result)
    } catch (error) {
      return res
        .status(500)
        .json({ exito: false, mensaje: "Error inesperado en la inscripción" })
    }
  })

  return router
}

