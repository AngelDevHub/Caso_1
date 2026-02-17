"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryStudentRepository = void 0;
class InMemoryStudentRepository {
    constructor() {
        this.students = [
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
        ];
    }
    async findById(id) {
        const student = this.students.find((s) => s.id === id);
        return student ?? null;
    }
}
exports.InMemoryStudentRepository = InMemoryStudentRepository;
