const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "API request failed");
  }

  return data;
}

export const api = {
  health: () => request("/health"),

  getTasks: () => request("/tasks"),

  getTask: (id) => request(`/tasks/${id}`),

  createTask: (task) =>
    request("/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    }),

  getMatches: (taskId) =>
    request(`/tasks/${taskId}/matches`),

  createAssignment: (taskId, studentId) =>
    request("/assignments", {
      method: "POST",
      body: JSON.stringify({
        task_id: taskId,
        student_id: studentId,
      }),
    }),

  getAssignments: () => request("/assignments"),

  registerStudent: (student) =>
    request("/students", {
      method: "POST",
      body: JSON.stringify(student),
    }),
};