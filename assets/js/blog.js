const postsPerPage = 3;
let posts = [];
let filteredPosts = [];
let currentPage = 1;
let selectedTags = new Set();

const postsContainer = document.getElementById("postsContainer");
const paginationContainer = document.getElementById("pagination");
const searchInput = document.getElementById("searchInput");
const categoriesFilter = document.getElementById("categoriesFilter");

// Load posts JSON
async function loadPosts() {
  const res = await fetch("assets/data/posts.json");
  posts = await res.json();

  filteredPosts = posts;
  renderCategories();
  renderPosts();
  renderPagination();
}

function renderCategories() {
  // Get all unique tags
  const tags = [...new Set(posts.flatMap(post => post.tags))].sort();

  categoriesFilter.innerHTML = tags
    .map(
      tag => `
      <button class="tag-button" data-tag="${tag}">${tag}</button>
    `
    )
    .join("");

  // Add click event listeners to buttons
  categoriesFilter.querySelectorAll(".tag-button").forEach(button => {
    button.addEventListener("click", () => {
      const tag = button.getAttribute("data-tag");
      if (selectedTags.has(tag)) {
        selectedTags.delete(tag);
        button.classList.remove("selected");
      } else {
        selectedTags.add(tag);
        button.classList.add("selected");
      }
      filterPosts();
    });
  });
}

function filterPosts() {
  const searchTerm = searchInput.value.toLowerCase();

  filteredPosts = posts.filter(post => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm) ||
      post.summary.toLowerCase().includes(searchTerm) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm));

    const matchesTags =
      selectedTags.size === 0 ||
      post.tags.some(tag => selectedTags.has(tag));

    return matchesSearch && matchesTags;
  });

  currentPage = 1;
  renderPosts();
  renderPagination();
}

function renderPosts() {
  const start = (currentPage - 1) * postsPerPage;
  const end = start + postsPerPage;
  const postsToShow = filteredPosts.slice(start, end);

  if (postsToShow.length === 0) {
    postsContainer.innerHTML = "<p>No posts found.</p>";
    return;
  }

  postsContainer.innerHTML = postsToShow
    .map(
      post => `
    <article class="blog-card">
      <img src="${post.coverImage}" alt="${post.title}" class="blog-cover" />
      <h2 class="blog-title">${post.title}</h2>
      <p class="blog-date">${new Date(post.date).toLocaleDateString()}</p>
      <p class="blog-summary">${post.summary}</p>
      <p class="blog-tags">${post.tags
        .map(tag => `<span class="tag">${tag}</span>`)
        .join(" ")}</p>
      <a href="post.html?id=${post.id}" class="read-more">Read More</a>
    </article>
  `
    )
    .join("");
}

function renderPagination() {
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  if (totalPages <= 1) {
    paginationContainer.innerHTML = "";
    return;
  }

  let buttons = "";
  for (let i = 1; i <= totalPages; i++) {
    buttons += `<button class="page-btn ${
      i === currentPage ? "active" : ""
    }" data-page="${i}">${i}</button>`;
  }
  paginationContainer.innerHTML = buttons;

  paginationContainer.querySelectorAll(".page-btn").forEach(button => {
    button.addEventListener("click", () => {
      currentPage = Number(button.getAttribute("data-page"));
      renderPosts();
      renderPagination();
      window.scrollTo(0, 0);
    });
  });
}

searchInput.addEventListener("input", () => {
  filterPosts();
});

// Initial load
loadPosts();
