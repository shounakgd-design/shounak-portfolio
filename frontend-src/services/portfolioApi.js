const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

async function request(path, options = {}) {
  const { adminKey, headers = {}, ...fetchOptions } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(adminKey ? { "x-admin-key": adminKey } : {}),
      ...headers,
    },
    ...fetchOptions,
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "The request could not be completed.");
  }

  return result;
}

export async function fetchProjects() {
  const result = await request("/projects");

  return (result.data || []).map((project, index) => ({
    ...project,
    id: project._id || project.id || project.title,
    desc: project.description || project.desc || "",
    tags: project.tags?.length ? project.tags : project.technologies || [],
    technologies: project.technologies || [],
    link: project.live || project.github || project.link || "#",
    n: index,
  }));
}

export async function fetchBlogs() {
  const result = await request("/blogs");

  return (result.data || []).map((blog) => ({
    ...blog,
    id: blog._id || blog.id || blog.title,
    content: blog.content || blog.intro || "",
    body: blog.content || blog.body || [],
  }));
}

export function submitContactMessage(message) {
  return request("/contact", {
    method: "POST",
    body: JSON.stringify(message),
  });
}

export async function verifyAdminKey(adminKey) {
  return request("/admin/verify", { adminKey });
}

export async function fetchPortfolioContent() {
  const result = await request("/content");
  return result.data;
}

export async function savePortfolioContent(content, adminKey) {
  const result = await request("/content", {
    method: "PUT",
    adminKey,
    body: JSON.stringify(content),
  });
  return result.data;
}

export async function createProject(project, adminKey) {
  const result = await request("/projects", {
    method: "POST",
    adminKey,
    body: JSON.stringify(project),
  });
  return result.data;
}

export async function updateProject(id, project, adminKey) {
  const result = await request(`/projects/${id}`, {
    method: "PUT",
    adminKey,
    body: JSON.stringify(project),
  });
  return result.data;
}

export function deleteProject(id, adminKey) {
  return request(`/projects/${id}`, { method: "DELETE", adminKey });
}

export async function createBlog(blog, adminKey) {
  const result = await request("/blogs", {
    method: "POST",
    adminKey,
    body: JSON.stringify(blog),
  });
  return result.data;
}

export async function updateBlog(id, blog, adminKey) {
  const result = await request(`/blogs/${id}`, {
    method: "PUT",
    adminKey,
    body: JSON.stringify(blog),
  });
  return result.data;
}

export function deleteBlog(id, adminKey) {
  return request(`/blogs/${id}`, { method: "DELETE", adminKey });
}

export async function fetchContactMessages(adminKey) {
  return request("/contact", { adminKey });
}