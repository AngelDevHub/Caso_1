import { AuditLogger } from "../../usecases/proxy/EnrollmentServiceProxy"

export class ConsoleAuditLogger implements AuditLogger {
  log(mensaje: string, data?: unknown): void {
    const payload = data ? ` | data=${JSON.stringify(data)}` : ""
    console.log(`[AUDIT] ${mensaje}${payload}`)
  }
}

