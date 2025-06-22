const postContainer = document.getElementById("postContainer");
const allPosts = getAllPosts();
let currentView = "all"; // 默认显示全部动态

function renderFeed(filterTag = null) {
  postContainer.innerHTML = "";
  if (filterTag) {
    visiblePosts = visiblePosts.filter(p => (p.tag || "").includes(filterTag));
  }
  let filtered = [];

  if (currentView === "follow" && currentUser?.following?.length) {
    filtered = allPosts.filter(p => currentUser.following.includes(p.author.id));
  } else {
    filtered = allPosts;
  }

  const visiblePosts = filtered.filter(p => p.visibility === "public");

  if (visiblePosts.length === 0) {
    postContainer.innerHTML = `<p style="text-align:center; color:#888;">暂无动态</p>`;
    return;
  }

  visiblePosts.forEach(post => {
    const card = document.createElement("div");
    card.className = "postCard";

    const imageHTML = (post.images && post.images.length > 0)
      ? `<div class="imgPreview">
          ${post.images.map(img => `<img src="${img}" alt="图片">`).join("")}
        </div>`
      : "";

    const likedKey = "liked_" + post.id;
    const liked = localStorage.getItem(likedKey) === "1";
    const commentInputId = `commentInput_${post.id}`;
    const commentBtnId = `commentBtn_${post.id}`;
    const isAuthor = currentUser && currentUser.id === post.author.id;

    card.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
    <img src="${post.author.avatar || 'default-avatar.jpg'}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;">
    <p><strong><a class="userPage" href="user.html?id=${post.author.id}">${post.author.name}</a></strong></p>
    </div>
    <p style="font-size: small;color: grey;margin-left:52px;">${new Date(post.timestamp).toLocaleString()}</p>
    <p >${post.content || ''}</p>
    ${imageHTML}
    <div class="post-footer">
    ${currentUser ? `<button class="like-btn ${liked ? 'liked' : ''}" data-id="${post.id}">${post.likes} 赞</button>` : ''}
    <a class="smalla" href="detail.html?id=${post.id}">查看详情</a>
    ${currentUser ? `
      <a class="smalla" href="javascript:void(0);" class="toggleComment" data-id="${post.id}">评论</a>
      <a class="smalla" href="#" onclick="sharePost('${post.id}')">转发</a>
      <a class="smalla" href="#" onclick="alert('已收藏！')">收藏</a>
    ` : ''}
    ${isAuthor ? `
      <a class="smalla" href="edit.html?id=${post.id}">编辑</a>
      <a class="smalla" href="#" class="deletePost" data-id="${post.id}">删除</a>
    ` : ''}
   </div>
   ${currentUser ? `
    <div id="commentBox-${post.id}" style="margin-top:10px; display:none;margin-left:52px;">
      <textarea id="${commentInputId}" style="resize: none;width:70%;margin-right:10px" placeholder="写下你的评论吧"></textarea>
      <button id="${commentBtnId}" type="submit" data-id="${post.id}">发布</button>
    </div>
    ` : ''}
    `;
    postContainer.appendChild(card);

    if (currentUser) {
      const likeBtn = card.querySelector(".like-btn");
      if (likeBtn) {
        const hasLiked = hasUserLiked(currentUser.id, post.id);
        if (hasLiked) {
          likeBtn.classList.add("liked");
        }

        likeBtn.addEventListener("click", function () {
          const postId = this.dataset.id;
          const hasLiked = toggleUserLike(currentUser.id, postId);

          updatePostById(postId, post => {
            // 获取当前点赞数
            const currentLikes = post.likes || 0;
            // 根据操作调整点赞数
            post.likes = hasLiked ? currentLikes + 1 : currentLikes - 1;
            return post;
          });

          // 更新按钮状态
          this.classList.toggle("liked");
          // 获取更新后的点赞数（直接从DOM读取当前显示的值）
          const currentDisplayLikes = parseInt(this.textContent) || 0;
          this.textContent = `${hasLiked ? currentDisplayLikes + 1 : currentDisplayLikes - 1} 赞`;
        });
      }
    }
  });

  // 评论按钮绑定（仅登录）
  if (currentUser) {
    document.querySelectorAll(".toggleComment").forEach(btn => {
      btn.addEventListener("click", function () {
        const postId = this.dataset.id;
        const box = document.getElementById("commentBox-" + postId);
        box.style.display = box.style.display === "none" ? "block" : "none";
      });
    });

    document.querySelectorAll("[id^='commentBtn_']").forEach(btn => {
      btn.addEventListener("click", function () {
        const postId = this.dataset.id;
        const input = document.getElementById("commentInput_" + postId);
        const text = input.value.trim();
        if (!text) return alert("评论不能为空");

        updatePostById(postId, post => {
          post.comments = post.comments || [];
          post.comments.push({
            user: currentUser.name,
            text,
            time: new Date().toISOString()
          });
          return post;
        });

        alert("评论成功！");
        location.reload();
      });
    });
  }
}

document.getElementById("viewAllBtn")?.addEventListener("click", () => {
  currentView = "all";
  renderFeed();
});

document.getElementById("viewFollowBtn")?.addEventListener("click", () => {
  currentView = "follow";
  renderFeed();
});

renderFeed();

function renderFeatured() {
  const featuredDiv = document.querySelector(".featured");
  if (!featuredDiv) return;

  const topPosts = getAllPosts()
    .filter(p => p.visibility === "public")
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 3);

  topPosts.forEach(post => {
    const card = document.createElement("div");
    card.className = "postCard";

    const imageHTML = (post.images?.[0])
      ? `<img src="${post.images[0]}" style="width:100%;max-width:300px;margin-top:8px;">`
      : "";

    const likedKey = "liked_" + post.id;
    const liked = localStorage.getItem(likedKey) === "1";

    card.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
    <img src="${post.author.avatar || 'default-avatar.jpg'}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;">
    <p><strong><a class="userPage" href="user.html?id=${post.author.id}">${post.author.name}</a></strong></p>
    </div>
    <p style="font-size: small;color: grey;margin-left:52px;">${new Date(post.timestamp).toLocaleString()}</p>
    <p>${post.content}</p>
    ${imageHTML}
    <div class="post-footer" >
    ${currentUser ? `<button class="like-btn ${liked ? 'liked' : ''}" data-id="${post.id}">${post.likes} 赞</button>` : ''}
    <a class="smalla" href="detail.html?id=${post.id}">查看详情</a>
    ${currentUser ? `
      <a class="smalla" href="#" onclick="sharePost('${post.id}')">转发</a>
      <a class="smalla" href="#" onclick="alert('已收藏！')">收藏</a>
    ` : ''}
    </div>
    `;

    featuredDiv.appendChild(card);

    // 为点赞按钮添加事件监听
    if (currentUser) {
      const likeBtn = card.querySelector(".like-btn");
      if (likeBtn) {
        const hasLiked = hasUserLiked(currentUser.id, post.id);
        if (hasLiked) {
          likeBtn.classList.add("liked");
        }

        likeBtn.addEventListener("click", function () {
          const postId = this.dataset.id;
          const hasLiked = toggleUserLike(currentUser.id, postId);

          updatePostById(postId, post => {
            post.likes = hasLiked ? (post.likes || 0) + 1 : (post.likes || 0) - 1;
            return post;
          });

          this.classList.toggle("liked");
          const currentDisplayLikes = parseInt(this.textContent) || 0;
          this.textContent = `${hasLiked ? currentDisplayLikes + 1 : currentDisplayLikes - 1} 赞`;
        });
      }
    }
  });
}

renderFeatured();

document.querySelectorAll(".categories a").forEach(a => {
  a.addEventListener("click", e => {
    e.preventDefault();
    const tag = a.dataset.category;
    if (tag === "all") {
      renderFeed(); // 默认全部
    } else {
      renderFeed(tag);
    }
  });
});

// 转发功能
function sharePost(postId) {
  const post = getPostById(postId);
  if (!post) return;

  const newPost = {
    id: Date.now().toString(),
    author: {
      id: currentUser.id,
      name: currentUser.name,
      avatar: currentUser.avatar
    },
    content: `转发自 <a class="userPage" href="user.html?id=${post.author.id}" >@${post.author.name}</a>: <span class="post-content">${post.content}</span>`,
    tag: post.tag,
    images: [...post.images],
    visibility: "public",
    timestamp: new Date().toISOString(),
    likes: 0,
    comments: [],
    originalPostId: post.id
  };

  savePost(newPost);
  alert("转发成功！");
  location.reload();
}