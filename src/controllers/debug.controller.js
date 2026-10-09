const runHeavyComputation = require('../services/heavy-computation.service.js')
async function heavyComputation(req, res, next) {
    try {
        const iterations = Number(
            req.body?.iterations ?? 5_000
        );

        if (
            !Number.isSafeInteger(iterations) ||
            iterations < 1 ||
            iterations > 10_000_000
        ) {
            return res.status(400).json({
                message: "Invalid iterations value",
            });
        }

        const startedAt = Date.now();

        const result = await runHeavyComputation(iterations);

        return res.json({
            message: "Computation completed",
            durationMs: Date.now() - startedAt,
            ...result,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = { heavyComputation }