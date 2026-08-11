const API_URL = "http://127.0.0.1:8000";
export async function loginUser(email, password) {
  const response = await fetch(
    `${API_URL}/auth/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
    {
      method: "POST",
    }
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Login failed");
  }
  return data;
}