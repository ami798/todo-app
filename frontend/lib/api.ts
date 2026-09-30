import type { Counts, Filter, Todo } from "./types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(BASE + path, { ...init, headers: { "Content-Type": "application/json" } });
  if (!res.ok) {
    // fetch does NOT throw on 400/404/500, so we check res.ok ourselves
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Request failed");
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

export const api = {
  list: (filter: Filter, q: string) =>
    request<{ todos: Todo[]; counts: Counts }>(`/todos?filter=${filter}&q=${encodeURIComponent(q)}`),
  create: (title: string) => request<Todo>("/todos", { method: "POST", body: JSON.stringify({ title }) }),
  update: (id: string, patch: Partial<Pick<Todo, "title" | "status" | "flagged">>) =>
    request<Todo>(`/todos/${id}`, { method: "PATCH", body: JSON.stringify(patch) }),
  remove: (id: string) => request<void>(`/todos/${id}`, { method: "DELETE" }),
  clearDone: () => request<{ removed: number }>("/todos/done", { method: "DELETE" }),
};
