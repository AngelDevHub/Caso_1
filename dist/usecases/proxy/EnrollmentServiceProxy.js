"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollmentServiceProxy = void 0;
class EnrollmentServiceProxy {
    constructor(target, auditLogger, clock) {
        this.target = target;
        this.auditLogger = auditLogger;
        this.clock = clock;
    }
    async inscribir(request) {
        if (!this.estaEnHorarioDeOficina()) {
            this.auditLogger.log("Intento de inscripción fuera de horario de oficina", {
                request
            });
            return {
                exito: false,
                mensaje: "La inscripción solo está disponible en horario de oficina"
            };
        }
        this.auditLogger.log("Inicio de proceso de inscripción", { request });
        const inicio = this.clock.now().getTime();
        const result = await this.target.inscribir(request);
        const fin = this.clock.now().getTime();
        this.auditLogger.log("Fin de proceso de inscripción", {
            exito: result.exito,
            mensaje: result.mensaje,
            duracionMs: fin - inicio
        });
        return result;
    }
    estaEnHorarioDeOficina() {
        /*const ahora = this.clock.now()
        const hora = ahora.getHours()
        return hora >= 0 && hora <= 23*/
        return true;
    }
}
exports.EnrollmentServiceProxy = EnrollmentServiceProxy;
