"use client";
import { useState } from "react";
import type { Todo } from "@/lib/types";
import { CheckIcon, ClockIcon, FlagIcon, PencilIcon, PlayIcon, TrashIcon } from "./Icons";

type Props = {
  todo: Todo;
  onChange: (id: string, patch: Partial<Pick<Todo, "title" | "status" | "flagged">>) => void;
  onDelete: (id: string) => void;
};

export default function TodoCard({ todo, onChange, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);
  const done = todo.status === "done";

  const save = () => {
    const title = draft.trim();
    if (title && title !== todo.title) onChange(todo.id, { title });
    else setDraft(todo.title); // empty 
    setEditing(false);
  };

  const time = new Date(todo.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  return (
    <li className={`card ${done ? "is-done" : ""}`}>
      <button className={`circle ${done ? "on" : ""}`} aria-pressed={done}
        aria-label={done ? "Mark as not done" : "Mark as done"}
        onClick={() => onChange(todo.id, { status: done ? "todo" : "done" })}>
        {done && <CheckIcon width={16} height={16} />}
      </button>

      <div className="body">
        {editing ? (
          <input className="edit" autoFocus value={draft} maxLength={200} aria-label="Edit task title"
            onChange={(e) => setDraft(e.target.value)} onBlur={save}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") { setDraft(todo.title); setEditing(false); }
            }} />
        ) : (
          <span className="title" onDoubleClick={() => setEditing(true)}>{todo.title}</span>
        )}
        <span className="meta">
          <ClockIcon /> {time}
          {todo.status === "in_progress" && <em className="badge">In progress</em>}
        </span>
      </div>

      <div className="actions">
        <button className={`icon ${todo.status === "in_progress" ? "on" : ""}`}
          title={todo.status === "in_progress" ? "Stop working on it" : "Mark in progress"}
          aria-label="Toggle in progress" aria-pressed={todo.status === "in_progress"} disabled={done}
          onClick={() => onChange(todo.id, { status: todo.status === "in_progress" ? "todo" : "in_progress" })}>
          <PlayIcon filled={todo.status === "in_progress"} />
        </button>
        <button className={`icon ${todo.flagged ? "on" : ""}`} title="Flag as important" aria-label="Toggle flag"
          aria-pressed={todo.flagged} onClick={() => onChange(todo.id, { flagged: !todo.flagged })}>
          <FlagIcon filled={todo.flagged} />
        </button>
        <button className="icon" title="Edit" aria-label="Edit task" onClick={() => setEditing(true)}><PencilIcon /></button>
        <button className="icon danger" title="Delete" aria-label="Delete task" onClick={() => onDelete(todo.id)}><TrashIcon /></button>
      </div>
    </li>
  );
}
