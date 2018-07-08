"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis = require("ioredis");
let redis = null;
function getRedis() {
    if (!redis) {
        redis = new ioredis();
    }
    return redis;
}
exports.getRedis = getRedis;
function getSubscriber() {
    return new ioredis();
}
exports.getSubscriber = getSubscriber;
//# sourceMappingURL=redis.js.map