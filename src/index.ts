import { Elysia } from "elysia";
import { postRoutes } from "./routes";

const port_address = process.env.PORT || 3000;
const app = new Elysia().use(postRoutes).listen(port_address);

console.log(
  `Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);