"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryCourseRepository = void 0;
class InMemoryCourseRepository {
    constructor() {
        this.courses = [
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
        ];
    }
    async findById(id) {
        const course = this.courses.find((c) => c.id === id);
        return course ?? null;
    }
    async save(course) {
        const index = this.courses.findIndex((c) => c.id === course.id);
        if (index >= 0) {
            this.courses[index] = course;
        }
        else {
            this.courses.push(course);
        }
    }
}
exports.InMemoryCourseRepository = InMemoryCourseRepository;
