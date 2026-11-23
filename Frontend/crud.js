document.addEventListener("DOMContentLoaded", () => {

  // CREATE BLOG
  const createForm = document.getElementById("createBlogForm");

  if (createForm) {
    createForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const blogData = {
        title: document.getElementById("title").value.trim(),
        content: document.getElementById("content").value.trim(),
        category: document.getElementById("category").value
      };

      try {
        await createBlog(blogData);

        alert("Blog created successfully!");

        window.location.href = "dashboard.html";

      } catch (error) {
        alert(error.message);
      }
    });
  }

  // READ BLOGS
  const blogContainer = document.getElementById("blogContainer");
// SEARCH BLOGS
let allBlogs = [];

const searchInput = document.getElementById("searchInput");

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const searchText = searchInput.value.toLowerCase();

    const filteredBlogs = allBlogs.filter((blog) => {
      return (
        blog.title.toLowerCase().includes(searchText) ||
        blog.content.toLowerCase().includes(searchText) ||
        blog.category.toLowerCase().includes(searchText)
      );
    });

    displayBlogs(filteredBlogs);
  });
}
  async function loadBlogs() {
    if (!blogContainer) return;

    const blogs = await getBlogs();

allBlogs = blogs;

displayBlogs(allBlogs);

    } catch (error) {
      blogContainer.textContent = error.message;
    }
  }

  function displayBlogs(blogs) {
    blogContainer.replaceChildren();

    if (!blogs.length) {
      blogContainer.textContent = "No blogs available.";
      return;
    }

    blogs.forEach((blog) => {
      const card = document.createElement("div");
      card.className = "blog-card";

      const title = document.createElement("h2");
      title.textContent = blog.title;

      const content = document.createElement("p");
      content.textContent = blog.content;

      const category = document.createElement("p");
      category.textContent = `Category: ${blog.category}`;

      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.addEventListener("click", () => editBlog(blog));

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => removeBlog(blog._id));

      card.append(title, content, category, editButton, deleteButton);

      blogContainer.appendChild(card);
    });
  }

  // UPDATE BLOG
  async function editBlog(blog) {
    const title = prompt("Enter updated title:", blog.title);

    if (title === null) return;

    const content = prompt("Enter updated content:", blog.content);

    if (content === null) return;

    const category = prompt("Enter updated category:", blog.category);

    if (category === null) return;

    if (!title.trim() || !content.trim() || !category.trim()) {
      alert("All fields are required.");
      return;
    }

    try {
      await updateBlog(blog._id, {
        title: title.trim(),
        content: content.trim(),
        category: category.trim()
      });

      alert("Blog updated successfully!");

      loadBlogs();

    } catch (error) {
      alert(error.message);
    }
  }

  // DELETE BLOG
  async function removeBlog(id) {
    const confirmDelete = confirm(
      "Are you sure you want to delete this blog?"
    );

    if (!confirmDelete) return;

    try {
      await deleteBlog(id);

      alert("Blog deleted successfully!");

      loadBlogs();

    } catch (error) {
      alert(error.message);
    }
  }

  loadBlogs();

});