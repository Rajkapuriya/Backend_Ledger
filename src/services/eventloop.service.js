const fs = require('node:fs');
const path = require('node:path');
const { performance, monitorEventLoopDelay } = require('node:perf_hooks');

// Use an existing Mongoose model here.
const Account = require('../models/account.model');

const filePath = path.join(__dirname, '../../package.json');

async function runProbe(id = 'single') {
    const start = performance.now();
    const events = [];

    const record = (operation, extra = {}) => {
        events.push({
            sequence: events.length + 1,
            operation,
            elapsedMs: Number((performance.now() - start).toFixed(3)),
            ...extra,
        });
    };

    record('sync:start');

    process.nextTick(() => record('process.nextTick'));

    Promise.resolve().then(() => record('Promise.then'));

    const tasks = [
        new Promise((resolve) => {
            setTimeout(() => {
                record('setTimeout');
                resolve();
            }, 0);
        }),

        new Promise((resolve) => {
            setImmediate(() => {
                record('setImmediate');
                resolve();
            });
        }),

        new Promise((resolve) => {
            fs.readFile(filePath, 'utf8', (err, data) => {
                record('fs.readFile', {
                    ok: !err,
                    bytes: data?.length ?? 0,
                    error: err?.message,
                });
                resolve();
            });
        }),

        (async () => {
            try {
                await Account.findOne({}).lean().exec();
                record('MongoDB.Account.findOne', { ok: true });
            } catch (err) {
                record('MongoDB.Account.findOne', {
                    ok: false,
                    error: err.message,
                });
            }
        })(),
    ];

    record('sync:end');

    await Promise.all(tasks);

    // Let callbacks already scheduled by the probe settle.
    await new Promise((resolve) => setImmediate(resolve));

    record('probe:complete');

    return {
        id,
        durationMs: Number((performance.now() - start).toFixed(3)),
        events,
    };
}

module.exports = { runProbe };