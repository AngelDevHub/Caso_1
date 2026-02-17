import express from "express"
import cors from "cors"
import { createEnrollmentRouter } from "../adapters/controllers/EnrollmentController"
import { InMemoryStudentRepository } from "./repositories/InMemoryStudentRepository"
import { InMemoryCourseRepository } from "./repositories/InMemoryCourseRepository"
import { InMemoryEnrollmentRepository } from "./repositories/InMemoryEnrollmentRepository"
import { InMemoryPaymentValidator } from "./services/InMemoryPaymentValidator"
import { EnrollStudentUseCase } from "../usecases/EnrollStudentUseCase"
import { EnrollmentServiceProxy } from "../usecases/proxy/EnrollmentServiceProxy"
import { ConsoleAuditLogger } from "./logging/ConsoleAuditLogger"
import { SystemClock } from "./time/SystemClock"

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())
app.use(express.static("public"))

const studentRepository = new InMemoryStudentRepository()
const courseRepository = new InMemoryCourseRepository()
const enrollmentRepository = new InMemoryEnrollmentRepository()
const paymentValidator = new InMemoryPaymentValidator()

const enrollStudentUseCase = new EnrollStudentUseCase(
  studentRepository,
  courseRepository,
  enrollmentRepository,
  paymentValidator
)

const auditLogger = new ConsoleAuditLogger()
const clock = new SystemClock()

const enrollmentServiceProxy = new EnrollmentServiceProxy(
  enrollStudentUseCase,
  auditLogger,
  clock
)

app.use("/api", createEnrollmentRouter(enrollmentServiceProxy))

app.get("/health", (_req, res) => {
  res.json({ status: "ok" })
})

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`)
})

