// 获取所有动态（按时间倒序）
function getAllPosts() {
    return JSON.parse(localStorage.getItem("posts") || "[]");
}

// 保存一条新动态（添加到列表最前面）
function savePost(post) {
    const posts = getAllPosts();
    posts.unshift(post); // 新的动态放到最前面
    localStorage.setItem("posts", JSON.stringify(posts));
}

// 通过 ID 获取某条动态
function getPostById(id) {
    return getAllPosts().find(p => p.id === id);
}

// 更新某条动态（传入更新后的对象）
function updatePostById(id, updater) {
    const posts = getAllPosts();
    const index = posts.findIndex(p => p.id === id);
    if (index !== -1) {
        const updated = updater(posts[index]); // 外部更新逻辑
        posts[index] = updated || posts[index];
        localStorage.setItem("posts", JSON.stringify(posts));
    }
}

// 删除动态
function deletePostById(id) {
    const posts = getAllPosts().filter(p => p.id !== id);
    localStorage.setItem("posts", JSON.stringify(posts));
}
