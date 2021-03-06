const postsContainer = document.getElementById('posts-container');
const loading = document.querySelector('.loader');
const filter = document.getElementById('filter');
const showMore = document.querySelector('.show-more')

let limit = 3;
let page = 1;

// Fetch posts from API
async function getPosts() {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`
  );
  const data = await res.json();
  return data;
}

// Show posts in DOM
async function showPosts() {
  const posts = await getPosts();

  posts.forEach(post => {
    const postEl = document.createElement('div');
    postEl.classList.add('post');
    postEl.innerHTML = `
      <div class="number">${post.id}</div>
      <div class="post-info">
        <h2 class="post-title">${post.title}</h2>
        <p class="post-body">${post.body}</p>
      </div>
    `;
    postsContainer.appendChild(postEl);
  });
}

showPosts();

// Show loader & fetch more posts
function showLoading() {
  loading.classList.add('show');

  setTimeout(() => {
    loading.classList.remove('show');

    setTimeout(() => {
      page++;
      showPosts();
    }, 300);
  }, 1000);
}

// Filter posts by input
function filterPosts(e) {
  const term = e.target.value.toUpperCase();
  const posts = document.querySelectorAll('.post');

  posts.forEach(post => {
    const title = post.querySelector('.post-title').innerText.toUpperCase();
    const body = post.querySelector('.post-body').innerText.toUpperCase();

    if (title.indexOf(term) > -1 || body.indexOf(term) > -1) {
      post.style.display = 'flex';
    } else {
      post.style.display = 'none';
    }
  });
}
filter.addEventListener('input', filterPosts);
filter.addEventListener('input', highlightSearchTerm)

// Show initial posts


window.addEventListener('scroll', () => {

  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollHeight - scrollTop === clientHeight) {
    showLoading();
    // console.log(document.documentElement.scrollTop);
  }
});

// showMore.addEventListener('click', () => {
//   showMore.style.display = 'none';

//   const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

//   if (scrollHeight - scrollTop === clientHeight) {
//     showLoading();
//   }
//   setTimeout(() => {
//     showMore.style.display = 'block';
//   }, 2000)
// });

function highlightSearchTerm() {
  let searchTerm = filter.value
  const posts = document.querySelectorAll('.post');
  searchTerm  = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  let pattern = new RegExp(`${searchTerm}`, "gi");

  posts.forEach(post => {
    const title = post.querySelector('.post-title')
    const body = post.querySelector('.post-body')
    title.innerHTML = title.textContent.replace(pattern, match => `<mark>${match}</mark>`)
    body.innerHTML = body.textContent.replace(pattern, match => `<mark>${match}</mark>`)
  });
}
