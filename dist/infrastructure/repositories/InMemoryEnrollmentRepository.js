"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryEnrollmentRepository = void 0;
class InMemoryEnrollmentRepository {
    constructor() {
        this.enrollments = [];
    }
    async registrarInscripcion(request) {
        this.enrollments.push(request);
        return {
            exito: true,
            mensaje: "Inscripción registrada correctamente"
        };
    }
}
exports.InMemoryEnrollmentRepository = InMemoryEnrollmentRepository;
