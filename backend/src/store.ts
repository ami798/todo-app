import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";


export type Status = "todo" | "in_progress" | "done";
export type Filter = "all" | Status;
export type Todo = { id: string; title: string; status: Status; flagged: boolean; createdAt: string };
const FILE = path.join(__dirname, "..", "todos.json");
let queue: Promise<unknown> = Promise.resolve();
function locked<T>(job: () => Promise<T>): Promise<T> {
  const run = queue.then(() => job());
  queue = run.catch(() => undefined); 
  return run;
}
async function read(): Promise<Todo[]> {
  let raw: any[];
  try {
    raw = JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch (err: any) {
    if (err.code === "ENOENT") return []; 
    throw err;
  }
  return raw.map((t) => ({
    id: t.id,
    title: t.title,
    status: t.status ?? (t.completed ? "done" : "todo"),
    flagged: Boolean(t.flagged),
    createdAt: t.createdAt,
  }));
}
const write = (todos: Todo[]) => fs.writeFile(FILE, JSON.stringify(todos, null, 2));
export const store = {

  list: (filter: Filter, q: string) =>
    locked(async () => {
      const all = await read();
      const counts = {
        all: all.length,
        todo: all.filter((t) => t.status === "todo").length,
        in_progress: all.filter((t) => t.status === "in_progress").length,
        done: all.filter((t) => t.status === "done").length,
      };
      let todos = filter === "all" ? all : all.filter((t) => t.status === filter);
      if (q) todos = todos.filter((t) => t.title.toLowerCase().includes(q.toLowerCase()));
      todos.sort((a, b) => a.createdAt.localeCompare(b.createdAt)); 
      return { todos, counts };
    }),

  create: (title: string) =>
    locked(async () => {
      const todos = await read();
      const todo: Todo = { id: randomUUID(), title, status: "todo", flagged: false, createdAt: new Date().toISOString() };
      await write([...todos, todo]);
      return todo;
    }),
  update: (id: string, patch: Partial<Pick<Todo, "title" | "status" | "flagged">>) =>
    locked(async () => {
      const todos = await read();
      const i = todos.findIndex((t) => t.id === id);
      if (i === -1) return null; 
      todos[i] = { ...todos[i], ...patch };
      await write(todos);
      return todos[i];
    }),
  remove: (id: string) =>
    locked(async () => {
      const todos = await read();
      const next = todos.filter((t) => t.id !== id);
      if (next.length === todos.length) return false;
      await write(next);
      return true;
    }),
  clearDone: () =>
    locked(async () => {
      const todos = await read();
      const next = todos.filter((t) => t.status !== "done");
      await write(next);
      return todos.length - next.length;
    }),
};
