import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { z } from "zod";
import { store } from "./store";
const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? "http://localhost:3000" })); 
app.use(express.json()); 




const statusEnum = z.enum(["todo", "in_progress", "done"]);
const createSchema = z.object({ title: z.string().trim().min(1, "Title is required").max(200, "Title is too long (200 max)") });
const updateSchema = z
  .object({ title: createSchema.shape.title.optional(), status: statusEnum.optional(), flagged: z.boolean().optional() })
  .refine((v) => Object.keys(v).length > 0, { message: "Nothing to update" });
const querySchema = z.object({
  filter: z.enum(["all", "todo", "in_progress", "done"]).default("all"),
  q: z.string().trim().default(""),
});


const wrap = (fn: (req: Request, res: Response) => Promise<unknown>) => (req: Request, res: Response, next: NextFunction) =>
  fn(req, res).catch(next);

app.get("/todos", wrap(async (req, res) => {
  const { filter, q } = querySchema.parse(req.query);
  res.json(await store.list(filter, q));
}));

app.post("/todos", wrap(async (req, res) => {
  const { title } = createSchema.parse(req.body);
  res.status(201).json(await store.create(title));
}));

app.patch("/todos/:id", wrap(async (req, res) => {
  const todo = await store.update(req.params.id, updateSchema.parse(req.body));
  if (!todo) return res.status(404).json({ error: "Todo not found" }); 
  res.json(todo);
}));

// declared before "/todos/:id", otherwise "done" would be read as an id.
app.delete("/todos/done", wrap(async (_req, res) => res.json({ removed: await store.clearDone() })));

app.delete("/todos/:id", wrap(async (req, res) => {
  if (!(await store.remove(req.params.id))) return res.status(404).json({ error: "Todo not found" });
  res.status(204).send();
}));

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof z.ZodError) return res.status(400).json({ error: err.issues[0].message });
  console.error(err);
  res.status(500).json({ error: "Something went wrong on the server" });
});

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
