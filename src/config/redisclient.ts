import { createClient } from "redis";

const redisClient = createClient({
  socket: {
    host: "localhost",
    port: 6379,
  },
});

redisClient
  .connect()
  .then(() => console.log("Redis connected"))
  .catch((err) => console.error("Redis connection failed:", err));

redisClient.on("error", (err) => console.error("Redis error:", err));

export default redisClient;