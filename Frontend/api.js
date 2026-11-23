const API_URL = "http://localhost:5000/api";

// Get saved login token
function getToken() {
  return sessionStorage.getItem("token");
}

// Common API request function
async function apiRequest(endpoint, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

// CREATE BLOG
async function createBlog(blogData) {
  return apiRequest("/blogs", {
    method: "POST",
    body: JSON.stringify(blogData)
  });
}

// READ ALL BLOGS
async function getBlogs() {
  return apiRequest("/blogs");
}

// READ SINGLE BLOG
async function getBlogById(id) {
  return apiRequest(`/blogs/${id}`);
}

// UPDATE BLOG
async function updateBlog(id, blogData) {
  return apiRequest(`/blogs/${id}`, {
    method: "PUT",
    body: JSON.stringify(blogData)
  });
}

// DELETE BLOG
async function deleteBlog(id) {
  return apiRequest(`/blogs/${id}`, {
    method: "DELETE"
  });
}


const API_URL = "http://localhost:5000/api";

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}