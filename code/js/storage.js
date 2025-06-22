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

function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || {};
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

// 系统初始化时创建管理员
const usersInit = getUsers();
if (!usersInit["admin"]) {
    usersInit["admin"] = {
        id: "admin",
        password: "admin123",
        name: "系统管理员",
        avatar: "",
        intro: "管理员",
        tags: [],
        visitCount: 0,
        lastLogin: new Date().toISOString(),
        banned: false
    };
    saveUsers(usersInit);
}

function getCurrentUser() {
    const id = localStorage.getItem("currentUser");
    const users = getUsers();
    return users[id];
}

const navArea = document.getElementById("navUserArea");
const currentUser = getCurrentUser();

if (navArea && currentUser) {
    navArea.innerHTML = `<a href="profile.html" style="color:#3498db;">👤 ${currentUser.name}</a>`;
}

// 获取当前主题模式
function getThemeMode() {
    return localStorage.getItem('theme') || 'light';
}

// 设置主题模式
function setThemeMode(theme) {
    localStorage.setItem('theme', theme);
    applyTheme(theme);
}

// 应用主题
function applyTheme(theme) {
    document.body.classList.toggle('dark-mode', theme === 'dark');

    // 更新切换按钮图标
    const toggleBtn = document.querySelector('.theme-toggle');
    if (toggleBtn) {
        toggleBtn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    }
}

// 初始化主题
function initTheme() {
    const currentTheme = getThemeMode();
    applyTheme(currentTheme);
}

// 在DOM加载完成后初始化主题
document.addEventListener('DOMContentLoaded', initTheme);

// 切换主题
function toggleTheme() {
    const currentTheme = getThemeMode();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setThemeMode(newTheme);
}
function getUserLikes() {
    return JSON.parse(localStorage.getItem("userLikes") || "{}");
}

function saveUserLikes(likes) {
    localStorage.setItem("userLikes", JSON.stringify(likes));
}

function toggleUserLike(userId, postId) {
    const likes = getUserLikes();
    if (!likes[userId]) likes[userId] = [];

    const index = likes[userId].indexOf(postId);
    if (index === -1) {
        likes[userId].push(postId);
    } else {
        likes[userId].splice(index, 1);
    }

    saveUserLikes(likes);
    return index === -1; // 返回是否是新点赞
}

function hasUserLiked(userId, postId) {
    const likes = getUserLikes();
    return likes[userId] && likes[userId].includes(postId);
} function getUserLikes() {
    return JSON.parse(localStorage.getItem("userLikes") || "{}");
}

function saveUserLikes(likes) {
    localStorage.setItem("userLikes", JSON.stringify(likes));
}

function toggleUserLike(userId, postId) {
    const likes = getUserLikes();
    if (!likes[userId]) likes[userId] = [];

    const index = likes[userId].indexOf(postId);
    if (index === -1) {
        likes[userId].push(postId);
    } else {
        likes[userId].splice(index, 1);
    }

    saveUserLikes(likes);
    return index === -1; // 返回是否是新点赞
}

function hasUserLiked(userId, postId) {
    const likes = getUserLikes();
    return likes[userId] && likes[userId].includes(postId);
}