const { parentPort, workerData } = require("node:worker_threads")
const { createHash } = require("node:crypto")
const { iterations } = workerData;

let value = "event-loop-challenge";

for (let i = 0; i < iterations; i++) {
    value = createHash("sha512")
        .update(value)
        .digest("hex");
}

parentPort.postMessage({
    iterations,
    result: value,
});