"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeatsValidationHandler = void 0;
const EnrollmentValidationHandler_1 = require("./EnrollmentValidationHandler");
class SeatsValidationHandler extends EnrollmentValidationHandler_1.EnrollmentValidationHandler {
    constructor(courseRepository) {
        super();
        this.courseRepository = courseRepository;
    }
    async doHandle(request) {
        const course = await this.courseRepository.findById(request.courseId);
        if (!course) {
            return { exito: false, mensaje: "Curso no encontrado" };
        }
        if (course.cuposOcupados >= course.cuposTotales) {
            return {
                exito: false,
                mensaje: "No hay cupos disponibles para este curso"
            };
        }
        return { exito: true };
    }
}
exports.SeatsValidationHandler = SeatsValidationHandler;
