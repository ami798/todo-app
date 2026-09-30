export type Status = "todo" | "in_progress" | "done";
export type Filter = "all" | Status;
export type Todo = { id: string; title: string; status: Status; flagged: boolean; createdAt: string };
export type Counts = Record<Filter, number>;
