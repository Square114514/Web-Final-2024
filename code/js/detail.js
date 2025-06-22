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

// 渲染动态
function renderPost(p) {
    postDetail.innerHTML += `
    <strong><a class="userPage" href="user.html?id=${post.author.id}">${post.author.name}</a></strong>
    <p style="font-size: small;color: grey;">${new Date(p.timestamp).toLocaleString()}</p>
    <p>${p.content}</p>
    ${renderImages(p.images)}
    <p id="likeCount" style="text-align:right"> ${p.likes} 赞&nbsp&nbsp&nbsp</p>
  `;
}

// 九图流布局渲染
function renderImages(images = []) {
    if (images.length === 0) return "";
    return `
    <div class="imgPreview">
      ${images.map(img => `<img src="${img}" alt="图片" style="width: 150px;height: 150px;">`).join("")}
    </div>
    `;
}

// 评论渲染
function renderComments(comments = []) {
    commentList.innerHTML = "";
    comments.forEach(c => {
        const item = document.createElement("div");
        item.innerHTML = `
        <p id="commentName" style="color:rgb(109, 109, 109)">${c.user} ：</p>
        <p id="commentText" style="padding-left: 2.7rem;">${parseCommentText(c.text)}</p>
        <p id="commentTime" style="padding-left: 2.7rem;font-size: small;color: grey;">${new Date(c.time).toLocaleString()}</p>
        <hr id="commentListHr"style="border-color: rgba(240, 247, 255, 0.397);margin: 5px 0px 10px 45px;">
        `;
        commentList.appendChild(item);
    });
}


// 点赞功能
likeBtn.addEventListener("click", () => {
    const userId = currentUser.id;
    const hasLiked = toggleUserLike(userId, postId);

    if (hasLiked) {
        post.likes += 1;
        document.getElementById("likeCount").innerHTML = `${post.likes} 赞&nbsp &nbsp`;
        likeBtn.classList.add("liked");
    } else {
        post.likes -= 1;
        document.getElementById("likeCount").innerHTML = `${post.likes} 赞&nbsp &nbsp`;
        likeBtn.classList.remove("liked");
    }

    updatePost(post);
});

// 在渲染时检查是否已点赞
if (currentUser && hasUserLiked(currentUser.id, postId)) {
    likeBtn.classList.add("liked");
}

// 添加评论

commentBtn.addEventListener("click", () => {
    const text = commentInput.value.trim();
    if (!text) {
        alert("评论不能为空！");
        return;
    }

    const currentUser = getCurrentUser();
    const comment = {
        user: currentUser.name,
        text,
        time: new Date().toISOString()
    };


    post.comments.push(comment);
    updatePost(post);
    commentInput.value = "";
    renderComments(post.comments);
});


// 更新本地存储中指定动态
function updatePost(updated) {
    posts = posts.map(p => p.id === updated.id ? updated : p);
    localStorage.setItem("posts", JSON.stringify(posts));
}

function parseCommentText(text) {
    return text
        .replace(/:smile:/g, "😄")
        .replace(/:sad:/g, "😢")
        .replace(/:image\((https?:\/\/[^\s]+)\)/g, '<img src="$1" style="max-width:100px;">');
}
