import { EnrollmentRequest, EnrollmentResult } from "../../domain/entities/Enrollment"
import { EnrollmentService } from "../EnrollmentService"

export interface AuditLogger {
  log(mensaje: string, data?: unknown): void
}

export interface Clock {
  now(): Date
}

export class EnrollmentServiceProxy implements EnrollmentService {
  constructor(
    private readonly target: EnrollmentService,
    private readonly auditLogger: AuditLogger,
    private readonly clock: Clock
  ) {}

  async inscribir(request: EnrollmentRequest): Promise<EnrollmentResult> {
    if (!this.estaEnHorarioDeOficina()) {
      this.auditLogger.log("Intento de inscripción fuera de horario de oficina", {
        request
      })
      return {
        exito: false,
        mensaje: "La inscripción solo está disponible en horario de oficina"
      }
    }

    this.auditLogger.log("Inicio de proceso de inscripción", { request })

    const inicio = this.clock.now().getTime()
    const result = await this.target.inscribir(request)
    const fin = this.clock.now().getTime()

    this.auditLogger.log("Fin de proceso de inscripción", {
      exito: result.exito,
      mensaje: result.mensaje,
      duracionMs: fin - inicio
    })

    return result
  }

  private estaEnHorarioDeOficina(): boolean {

    /*const ahora = this.clock.now()
    const hora = ahora.getHours()
    return hora >= 0 && hora <= 23*/
    return true
  }
}

