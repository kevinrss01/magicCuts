import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { authRoutes } from "./routes/auth";
import { cors } from "hono/cors";
import type { JwtVariables } from "hono/jwt";
import { projectRoutes } from "./routes/project";
import { jwt } from "hono/jwt";
import { config } from "./config/config";
type Variables = JwtVariables;

import ffmpeg from "fluent-ffmpeg";
import { prettyJSON } from "hono/pretty-json";

if (process.env.DOCKER === "true") {
  // En Docker, on utilise les chemins absolus
  ffmpeg.setFfmpegPath("/usr/bin/ffmpeg");
  ffmpeg.setFfprobePath("/usr/bin/ffprobe");
} else {
  ffmpeg.setFfmpegPath("ffmpeg");
  ffmpeg.setFfprobePath("ffprobe");
}

const app = new Hono<{ Variables: Variables }>();

app.use("*", cors());

app.use(prettyJSON());

app.use("*", async (c, next) => {
  const méthode = c.req.method;
  const url = c.req.url;

  await next();
});

app.use(
  "/projects/*",
  jwt({
    secret: config.jwtSecret,
  }),
);

app.route("/auth", authRoutes);
app.route("/projects", projectRoutes);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

serve(
  {
    fetch: app.fetch,
    port: process.env.PORT ? parseInt(process.env.PORT) : 4000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
