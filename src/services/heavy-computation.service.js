const { Worker } = require("node:worker_threads")
const path = require("node:path")

function runHeavyComputation(iterations) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(
            path.join(__dirname, "../workers/heavy-computation.worker.js"),
            {
                workerData: { iterations },
            }
        );

        let settled = false;

        worker.once("message", (result) => {
            settled = true;
            resolve(result);
        });

        worker.once("error", (error) => {
            settled = true;
            reject(error);
        });

        worker.once("exit", (code) => {
            if (code !== 0 && !settled) {
                reject(
                    new Error(`Worker exited with code ${code}`)
                );
            }
        });
    });
}
module.exports = runHeavyComputation