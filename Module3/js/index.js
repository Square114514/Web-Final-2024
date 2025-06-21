const postContainer = document.getElementById("postContainer");
const posts = getAllPosts();

// 仅显示公开动态
const visiblePosts = posts.filter(p => p.visibility === "public");

// 如果没有动态
if (visiblePosts.length === 0) {
  postContainer.innerHTML = `<p style="text-align:center; color:#888;">暂无公开动态，快去发布一个吧！</p>`;
}

// 渲染公开动态
visiblePosts.forEach(post => {
  const card = document.createElement("div");
  card.className = "postCard";

  const imageHTML = (post.images && post.images.length > 0)
    ? `<div class="imgPreviewGrid">
         ${post.images.map(img => `<img src="${img}" alt="图片">`).join("")}
       </div>`
    : "";

  const likedKey = "liked_" + post.id;
  const liked = localStorage.getItem(likedKey) === "1";

  card.innerHTML = `
    <div class="post-header">
      <strong>${post.author.name}</strong> - ${new Date(post.timestamp).toLocaleString()}
    </div>
    <p>${post.content || ''}</p>
    ${imageHTML}
    <div class="post-footer">
      <button class="like-btn ${liked ? 'liked' : ''}" data-id="${post.id}">
         ${post.likes} 赞
      </button>
      <a href="detail.html?id=${post.id}">查看详情</a>
    </div>
  `;

  postContainer.appendChild(card);
});

// 点赞按钮功能
document.querySelectorAll(".like-btn").forEach(btn => {
  btn.addEventListener("click", function () {
    const postId = this.dataset.id;
    const likedKey = "liked_" + postId;

    if (localStorage.getItem(likedKey) === "1") {
      alert("你已经点过赞了！");
      return;
    }

    updatePostById(postId, post => {
      post.likes += 1;
      return post;
    });

    localStorage.setItem(likedKey, "1");
    this.textContent = (parseInt(this.textContent.replace("赞 ", "")) + 1) + " 赞";
    this.classList.add("liked");
  });
});
