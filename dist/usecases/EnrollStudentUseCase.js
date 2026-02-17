"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollStudentUseCase = void 0;
const DocumentValidationHandler_1 = require("../domain/services/validation/DocumentValidationHandler");
const SeatsValidationHandler_1 = require("../domain/services/validation/SeatsValidationHandler");
const PaymentValidationHandler_1 = require("../domain/services/validation/PaymentValidationHandler");
class EnrollStudentUseCase {
    constructor(studentRepository, courseRepository, enrollmentRepository, paymentValidator) {
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        const documentValidation = new DocumentValidationHandler_1.DocumentValidationHandler();
        const seatsValidation = new SeatsValidationHandler_1.SeatsValidationHandler(this.courseRepository);
        const paymentValidation = new PaymentValidationHandler_1.PaymentValidationHandler(paymentValidator);
        documentValidation.setNext(seatsValidation).setNext(paymentValidation);
        this.validationChain = documentValidation;
    }
    async inscribir(request) {
        const student = await this.studentRepository.findById(request.studentId);
        if (!student) {
            return { exito: false, mensaje: "Alumno no encontrado" };
        }
        const validationResult = await this.validationChain.handle(request);
        if (!validationResult.exito) {
            return {
                exito: false,
                mensaje: validationResult.mensaje ?? "Error en la validación"
            };
        }
        const result = await this.enrollmentRepository.registrarInscripcion(request);
        if (result.exito) {
            const course = await this.courseRepository.findById(request.courseId);
            if (course) {
                course.cuposOcupados += 1;
                await this.courseRepository.save(course);
            }
        }
        return result;
    }
}
exports.EnrollStudentUseCase = EnrollStudentUseCase;
