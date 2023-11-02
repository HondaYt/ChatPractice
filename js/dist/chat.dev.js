"use strict";

var inputWrap = document.querySelector("#inputWrap");
var picContainer = document.querySelector(".picContainer");
var input = document.querySelector("#input");
var send = document.querySelector("#send");
var clear = document.querySelector("#clear");
var board = document.querySelector("#board");
var submitBox = document.querySelector("#submitBox");
var fileInput = document.querySelector("#fileInput");
var boardHeight = parseInt(window.getComputedStyle(board).height);
var boardWidth = parseInt(window.getComputedStyle(board).width); // console.log(boardHeight);

var clickCount = 0;
window.addEventListener("keydown", function (e) {
  if (e.key !== "Enter" || e.isComposing) return;
  send.click();
  input.value = "";
});
fileInput.addEventListener("change", function (e) {
  picContainer.classList.add("active");
  var file = e.target.files[0];
  var reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = function () {
    var img = document.createElement("img");
    img.src = reader.result;
    picContainer.appendChild(img);
  };
});
send.addEventListener("click", function () {
  picContainer.classList.remove("active");
  if (input.value == "" && picContainer.children.length == 0) return;
  var postWrap = document.createElement("div");
  postWrap.classList.add("postWrap");
  board.append(postWrap);
  var post = document.createElement("div");
  post.classList.add("post");
  postWrap.appendChild(post);
  var closeBtn = document.createElement("div");
  closeBtn.classList.add("closeBtn");
  postWrap.appendChild(closeBtn);
  var copyBtn = document.createElement("div");
  copyBtn.classList.add("copyBtn");
  postWrap.appendChild(copyBtn);
  var date = document.createElement("p");
  date.classList.add("date");
  postWrap.appendChild(date);
  date.textContent = new Date().toLocaleString();

  if (input.value != "") {
    post.textContent = input.value;
  } else if (picContainer.children.length > 0) {
    var img = picContainer.children[0];
    post.appendChild(img);
    picContainer.textContent = "";
    fileInput.value = "";
  }

  clickCount += 1;
  postWrap.style.zIndex = clickCount;
  clear.classList.add("active");
  var rgbMin = 200;
  post.style.backgroundColor = "rgb(" + (rgbMin + (256 - rgbMin) * Math.random()) + ", " + (rgbMin + (256 - rgbMin) * Math.random()) + ", " + (rgbMin + (256 - rgbMin) * Math.random()) + ")";
  var postWrapHeight = parseInt(window.getComputedStyle(postWrap).height);
  var postWrapWidth = parseInt(window.getComputedStyle(postWrap).width);
  postWrap.style.top = Math.random() * (boardHeight - postWrapHeight + 1) + "px";
  postWrap.style.left = Math.random() * (boardWidth - postWrapWidth + 1) + "px";
  var flg = false;
  postWrap.addEventListener("pointerdown", function () {
    return flg = true;
  });
  window.addEventListener("pointerup", function () {
    return flg = false;
  }); // postWrap.addEventListener("click", () => {
  //     clickCount += 1;
  //     console.log(clickCount);
  // });
  // document.addEventListener("pointermove", (e) => {
  //     if (!flg) return;
  //     postWrap.style.top = e.clientY - postWrapHeight / 2 + "px";
  //     postWrap.style.left = e.clientX - postWrapWidth / 2 + "px";
  // });

  var offsetX, offsetY; // document.addEventListener("pointermove", (e) => {

  window.addEventListener("pointermove", function (e) {
    if (!flg) return;
    postWrap.style.top = e.clientY - offsetY + "px";
    postWrap.style.left = e.clientX - offsetX + "px";
  });
  postWrap.addEventListener("pointerdown", function (e) {
    flg = true;
    offsetX = e.clientX - parseInt(postWrap.style.left);
    offsetY = e.clientY - parseInt(postWrap.style.top);
    clickCount += 1;
    console.log(clickCount);
    postWrap.style.zIndex = clickCount;
  });
  clear.addEventListener("click", function () {
    clear.classList.remove("active");
    board.textContent = "";
    input.value = "";
    clickCount = 0;
  });
  closeBtn.addEventListener("click", function () {
    postWrap.remove();

    if (board.textContent == "") {
      clear.classList.remove("active");
    }
  });
  copyBtn.addEventListener("click", function () {
    if (post.children.length > 0) {
      window.alert("画像はコピーできません(><)");
    } else {
      navigator.clipboard.writeText(post.textContent);
      if (navigator.clipboard.readText() !== post.textContent) document.execCommand("copy");
      setTimeout(function () {
        window.alert("Copied!");
      }, 0);
    }
  });
  input.value = "";
  console.log(clickCount);
});