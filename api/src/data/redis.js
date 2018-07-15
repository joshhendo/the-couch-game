"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis = require("ioredis");
const config = require("config");
const redisHost = config.get('redis.host');
const redisPort = config.get('redis.port');
let redis = null;
function getRedis() {
    if (!redis) {
        redis = new ioredis(redisPort, redisHost);
    }
    return redis;
}
exports.getRedis = getRedis;
function getSubscriber() {
    return new ioredis();
}
exports.getSubscriber = getSubscriber;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVkaXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZWRpcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFrQztBQUNsQyxpQ0FBaUM7QUFFakMsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBUyxZQUFZLENBQUMsQ0FBQztBQUNuRCxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFTLFlBQVksQ0FBQyxDQUFDO0FBRW5ELElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztBQUNqQjtJQUNFLElBQUksQ0FBQyxLQUFLLEVBQUU7UUFDVixLQUFLLEdBQUcsSUFBSSxPQUFPLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0tBQzNDO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBTEQsNEJBS0M7QUFFRDtJQUNFLE9BQU8sSUFBSSxPQUFPLEVBQUUsQ0FBQztBQUN2QixDQUFDO0FBRkQsc0NBRUMifQ==