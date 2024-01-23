import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import AppendAuthHandlers from "./handlers/auth";
import AppendGettingHandlers from "./handlers/getting";
import AppendAddingHandlers from "./handlers/adding";
import AppendDeletingHandlers from "./handlers/deleting";

const app = express();

app.use(express.json(), cors(), cookieParser());

app.use("", express.static(path.join(__dirname, "dist")));

AppendAuthHandlers(app);

AppendGettingHandlers(app);

AppendAddingHandlers(app);

AppendDeletingHandlers(app);

app.get("/*", (_, res) => {
  return res.sendFile("dist/index.html", { root: __dirname });
});

app.listen("3000");
