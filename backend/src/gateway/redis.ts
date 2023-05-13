import { createClient, RedisClientType } from "redis";
import * as CONSTANTS from "../utils/constants";

class RedisGateway {
  private publisher: RedisClientType;
  private subscriber: RedisClientType;
  constructor() {}

  // TODO - check for closed connection too
  createRedisConnection = async () => {
    this.publisher = createClient({ url: process.env.TASK_MANAGER_REDIS_URL });
    await this.publisher.connect();
  };

  setupRedisSubscribers = async () => {
    this.subscriber = createClient({ url: process.env.TASK_MANAGER_REDIS_URL });
    await this.subscriber.connect();

    this.subscriber.subscribe(
      CONSTANTS.NOTIFICATION_CHANNEL,
      function (channel, message) {
        console.log(message, channel);
      }
    );
  };

  publish = async (channel: string, msg: any) => {
    if (!this.publisher) {
      await this.createRedisConnection();
    }
    console.log("CHANNEL: ", channel);
    await this.publisher.publish(channel, msg);
  };
}

export default RedisGateway;
