// 获取 URL 参数中的 id
const params = new URLSearchParams(location.search);
const postId = params.get("id");

let posts = JSON.parse(localStorage.getItem("posts") || "[]");
let post = posts.find(p => p.id === postId);

// 绑定 DOM 元素
const postDetail = document.getElementById("postDetail");
const commentList = document.getElementById("commentList");
const commentInput = document.getElementById("newComment");
const commentBtn = document.getElementById("commentBtn");
const likeBtn = document.getElementById('like');

// 是否已点赞（本地标记，防止重复）
let likedKey = "liked_" + postId;
let liked = localStorage.getItem(likedKey) === "1";

// 渲染动态内容
if (!post) {
    postDetail.innerHTML += "<p>动态不存在</p>";
} else {
    renderPost(post);
    renderComments(post.comments);
}

// ========= 渲染函数 =========

function renderPost(p) {
    postDetail.innerHTML += `
    <p><strong>${p.author.name}</strong> - ${new Date(p.timestamp).toLocaleString()}</p>
    <p>${p.content}</p>
    ${renderImages(p.images)}
    <p id="likeCount"> ${p.likes} 赞</p>
  `;
}

// 九图流布局渲染
function renderImages(images = []) {
    if (images.length === 0) return "";
    return `
    <div class="imgDetail">
      ${images.map(img => `<img src="${img}" alt="图片">`).join("")}
    </div>
    `;
}

// 评论渲染
function renderComments(comments = []) {
    commentList.innerHTML = "";
    comments.forEach(c => {
        const item = document.createElement("div");
        item.innerHTML = `
        <p id="commentName">${c.user} ：</p>
        <p id="commentText">${c.text}</p>
        <p id="commentTime">${new Date(c.time).toLocaleString()}</p>
        <hr id="commentListHr">
        `;
        commentList.appendChild(item);
    });
}

// 点赞功能
likeBtn.addEventListener("click", () => {
    if (liked) {
        alert("你已经点过赞啦！");
        return;
    }

    post.likes += 1;
    liked = true;
    localStorage.setItem(likedKey, "1");
    updatePost(post);
    document.getElementById("likeCount").textContent = ` ${post.likes} 赞`;
});

// 添加评论

commentBtn.addEventListener("click", () => {
    const text = commentInput.value.trim();
    if (!text) {
        alert("评论不能为空！");
        return;
    }

    const comment = {
        user: "小红", // 可替换为当前登录用户
        text,
        time: new Date().toISOString()
    };

    post.comments.push(comment);
    updatePost(post);
    commentInput.value = "";
    renderComments(post.comments);
});

// ========= 更新本地存储中指定动态 =========

function updatePost(updated) {
    posts = posts.map(p => p.id === updated.id ? updated : p);
    localStorage.setItem("posts", JSON.stringify(posts));
}
