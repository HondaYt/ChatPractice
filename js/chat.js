const inputWrap = document.querySelector("#inputWrap");
const picContainer = document.querySelector(".picContainer");
const input = document.querySelector("#input");
const send = document.querySelector("#send");
const clear = document.querySelector("#clear");
const board = document.querySelector("#board");
const submitBox = document.querySelector("#submitBox");
const fileInput = document.querySelector("#fileInput");
let boardHeight = parseInt(window.getComputedStyle(board).height);
let boardWidth = parseInt(window.getComputedStyle(board).width);

console.log(boardHeight);

let clickCount = 20;

window.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" || e.isComposing) return;
    send.click();
    input.value = "";
});

fileInput.addEventListener("change", (e) => {
    picContainer.classList.add("active");
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        let img = document.createElement("img");
        img.src = reader.result;
        picContainer.appendChild(img);
    };
});

send.addEventListener("click", () => {
    picContainer.classList.remove("active");

    if (input.value == "" && picContainer.children.length == 0) return;
    let postWrap = document.createElement("div");
    postWrap.classList.add("postWrap");
    board.append(postWrap);
    let post = document.createElement("div");
    post.classList.add("post");
    postWrap.appendChild(post);
    let closeBtn = document.createElement("div");
    closeBtn.classList.add("closeBtn");
    postWrap.appendChild(closeBtn);
    let copyBtn = document.createElement("div");
    copyBtn.classList.add("copyBtn");
    postWrap.appendChild(copyBtn);

    let date = document.createElement("p");
    date.classList.add("date");
    postWrap.appendChild(date);
    date.textContent = new Date().toLocaleString();

    if (input.value != "") {
        post.textContent = input.value;
    } else if (picContainer.children.length > 0) {
        let img = picContainer.children[0];
        post.appendChild(img);
        picContainer.textContent = "";
        fileInput.value = "";
    }

    clickCount += 1;
    postWrap.style.zIndex = clickCount;
    clear.classList.add("active");

    const rgbMin = 200;
    post.style.backgroundColor =
        "rgb(" +
        (rgbMin + (256 - rgbMin) * Math.random()) +
        ", " +
        (rgbMin + (256 - rgbMin) * Math.random()) +
        ", " +
        (rgbMin + (256 - rgbMin) * Math.random()) +
        ")";

    let postWrapHeight = parseInt(window.getComputedStyle(postWrap).height);
    let postWrapWidth = parseInt(window.getComputedStyle(postWrap).width);

    postWrap.style.top =
        Math.random() * (boardHeight - postWrapHeight + 1) + "px";
    postWrap.style.left =
        Math.random() * (boardWidth - postWrapWidth + 1) + "px";

    let flg = false;

    postWrap.addEventListener("pointerdown", () => (flg = true));
    window.addEventListener("pointerup", () => (flg = false));

    postWrap.addEventListener("click", () => {
        clickCount += 1;
        console.log(clickCount);
    });

    // document.addEventListener("pointermove", (e) => {
    //     if (!flg) return;
    //     postWrap.style.top = e.clientY - postWrapHeight / 2 + "px";
    //     postWrap.style.left = e.clientX - postWrapWidth / 2 + "px";
    // });

    let offsetX, offsetY;

    // document.addEventListener("pointermove", (e) => {
    window.addEventListener("pointermove", (e) => {
        if (!flg) return;
        postWrap.style.top = e.clientY - offsetY + "px";
        postWrap.style.left = e.clientX - offsetX + "px";
    });

    postWrap.addEventListener("pointerdown", (e) => {
        flg = true;
        offsetX = e.clientX - parseInt(postWrap.style.left);
        offsetY = e.clientY - parseInt(postWrap.style.top);
        postWrap.style.zIndex = clickCount;
    });

    clear.addEventListener("click", () => {
        clear.classList.remove("active");
        board.textContent = "";
        input.value = "";
    });

    closeBtn.addEventListener("click", () => {
        postWrap.remove();
        if (board.textContent == "") {
            clear.classList.remove("active");
        }
    });
    copyBtn.addEventListener("click", () => {
        if (post.children.length > 0) {
            window.alert("画像はコピーできません(><)");
        } else {
            navigator.clipboard.writeText(post.textContent);
            if (navigator.clipboard.readText() !== post.textContent)
                document.execCommand("copy");
            setTimeout(() => {
                window.alert("Copied!");
            }, 0);
        }
    });

    input.value = "";
});
