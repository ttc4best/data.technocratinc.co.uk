// Utility: get query param by name
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

async function loadPost() {
  const postId = getQueryParam("id");
  if (!postId) {
    document.getElementById("postContent").innerHTML =
      "<p>Post ID missing in URL.</p>";
    return;
  }

  try {
    const res = await fetch("assets/data/posts.json");
    const posts = await res.json();

    const post = posts.find((p) => p.id === postId);
    if (!post) {
      document.getElementById("postContent").innerHTML =
        "<p>Post not found.</p>";
      return;
    }

    document.title = post.title + " - Blog";

    document.getElementById("postContent").innerHTML = `
      <h1>${post.title}</h1>
      <p class="blog-date">Published: ${new Date(post.date).toLocaleDateString()}</p>
      <p class="blog-tags">${post.tags.map(tag => `<span class="tag">${tag}</span>`).join(" ")}</p>
      ${post.coverImage ? `<img src="${post.coverImage}" alt="${post.title}" class="blog-cover" />` : ''}
      <div class="blog-full-content">${post.content}</div>
    `;
  } catch (error) {
    document.getElementById("postContent").innerHTML =
      "<p>Error loading post.</p>";
    console.error(error);
  }
}

loadPost();
