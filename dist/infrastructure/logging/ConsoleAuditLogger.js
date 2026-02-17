"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleAuditLogger = void 0;
class ConsoleAuditLogger {
    log(mensaje, data) {
        const payload = data ? ` | data=${JSON.stringify(data)}` : "";
        console.log(`[AUDIT] ${mensaje}${payload}`);
    }
}
exports.ConsoleAuditLogger = ConsoleAuditLogger;
