"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEnrollmentRouter = createEnrollmentRouter;
const express_1 = require("express");
function createEnrollmentRouter(enrollmentService) {
    const router = (0, express_1.Router)();
    router.post("/enrollments", async (req, res) => {
        const body = req.body;
        if (!body.studentId || !body.courseId) {
            return res
                .status(400)
                .json({ exito: false, mensaje: "studentId y courseId son obligatorios" });
        }
        const request = {
            studentId: body.studentId,
            courseId: body.courseId,
            documentosCompletos: body.documentosCompletos ?? false,
            pagoRegistrado: body.pagoRegistrado ?? false
        };
        try {
            const result = await enrollmentService.inscribir(request);
            const status = result.exito ? 200 : 400;
            return res.status(status).json(result);
        }
        catch (error) {
            return res
                .status(500)
                .json({ exito: false, mensaje: "Error inesperado en la inscripción" });
        }
    });
    return router;
}
