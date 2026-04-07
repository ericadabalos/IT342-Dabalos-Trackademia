const BASE_URL = "http://localhost:8080/api";

// helper function completely hidden from the UI components
function getHeaders() {
  const token = localStorage.getItem("trackademia_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {})
  };
}

// the facade
export const apiService = {
  
  login: async (email, password) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) throw new Error("Login failed");
    return response.json();
  },

  getTasks: async () => {
    const response = await fetch(`${BASE_URL}/tasks`, { headers: getHeaders() });
    if (!response.ok) throw new Error("Failed to fetch tasks");
    return response.json();
  },

  createTask: async (taskData) => {
    const response = await fetch(`${BASE_URL}/tasks`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(taskData)
    });
    if (!response.ok) throw new Error("Failed to create task");
    return response.json();
  },

  completeTask: async (taskId) => {
    const response = await fetch(`${BASE_URL}/tasks/${taskId}/complete`, {
      method: "PUT",
      headers: getHeaders()
    });
    if (!response.ok) throw new Error("Failed to update task");
    return response.json();
  }
};