const express = require('express');
const { runProbe } = require('../services/eventloop.service');
const { heavyComputation } = require('../controllers/debug.controller')
const router = express.Router();

router.get('/event-loop', async (req, res) => {
    try {
        res.json(await runProbe());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post(
    "/heavy-computation",
    heavyComputation
);

router.get('/event-loop/load', async (req, res) => {
    const levels = [1, 10, 100, 1000];
    const results = [];

    for (const concurrency of levels) {
        const started = performance.now();

        const probes = await Promise.all(
            Array.from({ length: concurrency }, (_, i) =>
                runProbe(`${concurrency}-${i + 1}`)
            )
        );

        const durations = probes
            .map((p) => p.durationMs)
            .sort((a, b) => a - b);

        results.push({
            concurrency,
            completed: probes.length,
            batchDurationMs: Number(
                (performance.now() - started).toFixed(2)
            ),
            p50Ms: durations[Math.floor(durations.length * 0.50)],
            p95Ms: durations[
                Math.min(
                    durations.length - 1,
                    Math.ceil(durations.length * 0.95) - 1
                )
            ],
        });
    }

    res.json({ nodeVersion: process.version, results });
});

module.exports = router;