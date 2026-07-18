const API_URL = import.meta.env.VITE_API_URL;

type ServerCard = {
  id: string;
  title: string;
  description: string;
  labels: string[];
  dueDate: string | null;
  order: number;
  columnId: string;
};

type ServerColumn = {
  id: string;
  title: string;
  order: number;
  boardId: string;
  cards: ServerCard[];
};

type ServerBoard = {
  id: string;
  title: string;
  createdAt: string;
  columns: ServerColumn[];
};

type BoardSummary = {
  id: string;
  title: string;
  createdAt: string;
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}

export function fetchBoards() {
  return request<BoardSummary[]>("/boards");
}

export function createBoard(title: string) {
  return request<BoardSummary>("/boards", {
    method: "POST",
    body: JSON.stringify({ title }),
  });
}

export function fetchBoard(id: string) {
  return request<ServerBoard>(`/boards/${id}`);
}

export function createColumnApi(boardId: string, title: string) {
  return request<ServerColumn>("/columns", {
    method: "POST",
    body: JSON.stringify({ boardId, title }),
  });
}

export function renameColumnApi(id: string, title: string) {
  return request<ServerColumn>(`/columns/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ title }),
  });
}

export function deleteColumnApi(id: string) {
  return request<void>(`/columns/${id}`, { method: "DELETE" });
}

type CardInput = {
  title: string;
  description: string;
  labels: string[];
  dueDate: string | null;
};

export function createCardApi(columnId: string, input: CardInput) {
  return request<ServerCard>("/cards", {
    method: "POST",
    body: JSON.stringify({ columnId, ...input }),
  });
}

export function updateCardApi(id: string, input: CardInput) {
  return request<ServerCard>(`/cards/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function moveCardApi(id: string, columnId: string, order: number) {
  return request<ServerCard>(`/cards/${id}/move`, {
    method: "PATCH",
    body: JSON.stringify({ columnId, order }),
  });
}

export function deleteCardApi(id: string) {
  return request<void>(`/cards/${id}`, { method: "DELETE" });
}
