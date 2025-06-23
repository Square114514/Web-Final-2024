//动态内容
const contentInput = document.getElementById("textContent");
const tagInput = document.getElementById("tag");
const imgUpload = document.getElementById("imgUpload");
const imgUrlInput = document.getElementById("imgURL");
const imgPreview = document.getElementById("imgPreview");
const visibilitySelect = document.getElementById("visibility");

let imgDataList = []; // 存储所有 base64 图片

// 上传图片预览（本地）
imgUpload.addEventListener("change", function () {
    const files = Array.from(this.files);
    const remainSlots = 9 - imgDataList.length;

    const validFiles = files.slice(0, remainSlots);

    validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const base64 = e.target.result;
            imgDataList.push(base64);

            const img = document.createElement("img");
            img.src = base64;
            imgPreview.appendChild(img);
        };
        reader.readAsDataURL(file);
    });

    this.value = '';
});

// 显示图片链接添加
imgUrlInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        const url = this.value.trim();
        if (!url || imgDataList.length >= 9) return;

        imgDataList.push(url);

        const img = document.createElement("img");
        img.src = url;
        imgPreview.appendChild(img);

        this.value = "";
    }
});

// 发布按钮
document.getElementById("postBtn").addEventListener("click", () => {
    const content = contentInput.value.trim();
    const tag = tagInput.value.trim();
    const visibility = visibilitySelect.value;
    if (!content && imgDataList.length === 0) {
        alert("内容不能为空！");
        return;
    }
    if (tag && !tag.startsWith("#")) {
        alert("标签应以#开头，例如 #学习日常");
        return;
    }
    const post = {
        id: Date.now().toString(),

        author: {
            id: currentUser.id,
            name: currentUser.name,
            avatar: currentUser.avatar,
        },
        content,
        tag,
        images: imgDataList,
        visibility,
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: [],
    };

    savePost(post);
    alert("动态已发布！");
    location.href = "index.html";
});
