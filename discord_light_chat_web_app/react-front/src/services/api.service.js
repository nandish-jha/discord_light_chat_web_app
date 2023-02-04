const baseUrl = import.meta.env.VITE_API_URL;

export async function fetchChat() {
  try {
    const response = await fetch(`${baseUrl}/api/chat`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}
export async function fetchUsers() {
  try {
    const response = await fetch(`${baseUrl}/api/auth/users`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}
export async function fetchChannles() {
  try {
    const response = await fetch(`${baseUrl}/api/channel`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

export async function fetchMessages(to) {
  try {
    const response = await fetch(`${baseUrl}/api/chat/${to}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

export async function Register({ username, email, password }) {
  try {
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creating post:", error);
  }
}

export async function Login({ email, password }) {
  try {
    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creating post:", error);
  }
}

export async function CreateChannel({ name,userId }) {
  try {
    const response = await fetch(`${baseUrl}/api/channel/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({  name, createdBy:userId, participants:[userId] }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creating post:", error);
  }
}
export async function JoinChannel ({ userId,channelId }) {
  try {
    const response = await fetch(`${baseUrl}/api/channel/${channelId}/participants/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error creating post:", error);
  }
}
