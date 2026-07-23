import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";

const app = express();

app.get("/", (_req: Request, res: Response) => {
  const indexPath = path.join(process.cwd(), "public", "index.html");
  res.type("html").send(fs.readFileSync(indexPath, "utf8"));
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    project: "Asana Automation Test Suite",
    stack: ["Playwright", "TypeScript", "Page Object Model", "Data-driven JSON"],
  });
});

app.get("/api/test-cases", (_req: Request, res: Response) => {
  const dataPath = path.join(process.cwd(), "tests", "data", "testData.json");
  const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  res.json(data);
});

app.use("/assets", express.static(path.join(process.cwd(), "public", "assets")));
app.use(express.static(path.join(process.cwd(), "public")));

export default app;

if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  app.listen(port, () => {
    console.log(`Asana Automation Test Suite demo listening on http://localhost:${port}`);
  });
}
