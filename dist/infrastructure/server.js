"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const EnrollmentController_1 = require("../adapters/controllers/EnrollmentController");
const InMemoryStudentRepository_1 = require("./repositories/InMemoryStudentRepository");
const InMemoryCourseRepository_1 = require("./repositories/InMemoryCourseRepository");
const InMemoryEnrollmentRepository_1 = require("./repositories/InMemoryEnrollmentRepository");
const InMemoryPaymentValidator_1 = require("./services/InMemoryPaymentValidator");
const EnrollStudentUseCase_1 = require("../usecases/EnrollStudentUseCase");
const EnrollmentServiceProxy_1 = require("../usecases/proxy/EnrollmentServiceProxy");
const ConsoleAuditLogger_1 = require("./logging/ConsoleAuditLogger");
const SystemClock_1 = require("./time/SystemClock");
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static("public"));
const studentRepository = new InMemoryStudentRepository_1.InMemoryStudentRepository();
const courseRepository = new InMemoryCourseRepository_1.InMemoryCourseRepository();
const enrollmentRepository = new InMemoryEnrollmentRepository_1.InMemoryEnrollmentRepository();
const paymentValidator = new InMemoryPaymentValidator_1.InMemoryPaymentValidator();
const enrollStudentUseCase = new EnrollStudentUseCase_1.EnrollStudentUseCase(studentRepository, courseRepository, enrollmentRepository, paymentValidator);
const auditLogger = new ConsoleAuditLogger_1.ConsoleAuditLogger();
const clock = new SystemClock_1.SystemClock();
const enrollmentServiceProxy = new EnrollmentServiceProxy_1.EnrollmentServiceProxy(enrollStudentUseCase, auditLogger, clock);
app.use("/api", (0, EnrollmentController_1.createEnrollmentRouter)(enrollmentServiceProxy));
app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
