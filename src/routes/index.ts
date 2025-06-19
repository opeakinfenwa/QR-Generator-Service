import auth from "./authRoutes";
import googleAuth from "./googleRoutes";
import user from "./userRoutes";
import qr from "./qrRoutes";
import { Express } from "express-serve-static-core";

const registerRoutes = function (app: Express) {
  app.use("/user", user);
  app.use("/auth", auth);
  app.use("/qr", qr);
  app.use("/auth", googleAuth);
};

export default registerRoutes;