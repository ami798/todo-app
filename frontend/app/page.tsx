"use client"; 

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Counts, Filter, Todo } from "@/lib/types";
import TodoCard from "@/components/TodoCard";
import { PlusIcon, SearchIcon } from "@/components/Icons";

const TABS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "todo", label: "To Do" },
  { key: "in_progress", label: "In Progress" },
  { key: "done", label: "Done" },
];
const EMPTY: Counts = { all: 0, todo: 0, in_progress: 0, done: 0 };

export default function Page() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [counts, setCounts] = useState<Counts>(EMPTY);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // to fetch the list
  const load = useCallback(async () => {
    try {
      const data = await api.list(filter, query);
      setTodos(data.todos);
      setCounts(data.counts);
      setError("");
    } catch {
      setError("Can't reach the server. Start the backend on port 4000, then reload.");
    } finally {
      setLoading(false);
    }
  }, [filter, query]);
useEffect(() => {
    const id = setTimeout(load, 200);
    return () => clearTimeout(id);
  }, [load]);


  const run = async (action: () => Promise<unknown>) => {
    try { await action(); await load(); } catch (e) { setError((e as Error).message); }
  };

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    setTitle("");
    run(() => api.create(t));
  };

  const change = (id: string, patch: Partial<Pick<Todo, "title" | "status" | "flagged">>) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    run(() => api.update(id, patch));
  };

  const today = new Date().toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });

  return (
    <main className="app">
      <header>
        <h1>My Tasks</h1>
        <p className="sub">
          {today} · {counts.todo + counts.in_progress} left
        </p>
      </header>

      <div className="tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t.key} role="tab" aria-selected={filter === t.key} className={filter === t.key ? "on" : ""}
            onClick={() => setFilter(t.key)}>
            {t.label} <span className="n">{counts[t.key]}</span>
          </button>
        ))}
      </div>

      <label className="search">
        <SearchIcon />
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tasks" aria-label="Search tasks" />
      </label>

      {error && <p className="error" role="alert">{error}</p>}

      {loading ? (
        <p className="empty">Loading tasks…</p>
      ) : todos.length === 0 ? (
        <p className="empty">
          {query ? `No tasks match "${query}".` : filter === "all" ? "No tasks yet. Add your first one below." : "Nothing here yet."}
        </p>
      ) : (
        <ul className="list">
          {todos.map((t) => (
            <TodoCard key={t.id} todo={t} onChange={change} onDelete={(id) => run(() => api.remove(id))} />
          ))}
        </ul>
      )}

      <form className="add" onSubmit={add}>
        <PlusIcon />
        <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} placeholder="Add a new task…" aria-label="New task" />
        <button type="submit" disabled={!title.trim()}>Add</button>
      </form>

      {counts.done > 0 && (
        <button className="clear" onClick={() => run(api.clearDone)}>Clear {counts.done} done</button>
      )}
    </main>
  );
}
