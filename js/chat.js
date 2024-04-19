const inputWrap = document.querySelector("#inputWrap");
const picContainer = document.querySelector(".picContainer");
const input = document.querySelector("#input");
const send = document.querySelector("#send");
const clear = document.querySelector("#clear");
const board = document.querySelector("#board");
const submitBox = document.querySelector("#submitBox");
const fileInput = document.querySelector("#fileInput");
const boardHeight = Number.parseInt(window.getComputedStyle(board).height);
const boardWidth = Number.parseInt(window.getComputedStyle(board).width);

let clickCount = 0;

window.addEventListener("keydown", (e) => {
	if (e.key !== "Enter" || e.isComposing) return;
	send.click();
	input.value = "";
});

window.addEventListener("keydown", (e) => {
	if (e.key !== "Backspace" || !picContainer.children.length > 0) return;
	picContainer.textContent = "";
	fileInput.value = "";
});

fileInput.addEventListener("change", (e) => {
	picContainer.classList.add("active");
	const file = e.target.files[0];
	const reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onload = () => {
		const img = document.createElement("img");
		img.src = reader.result;
		picContainer.appendChild(img);
	};
});

send.addEventListener("click", () => {
	picContainer.classList.remove("active");

	if (input.value === "" && picContainer.children.length === 0) return;
	const postWrap = document.createElement("div");
	postWrap.classList.add("postWrap");
	board.append(postWrap);
	const post = document.createElement("div");
	post.classList.add("post");
	postWrap.appendChild(post);
	const closeBtn = document.createElement("div");
	closeBtn.classList.add("closeBtn");
	postWrap.appendChild(closeBtn);
	const copyBtn = document.createElement("div");
	copyBtn.classList.add("copyBtn");
	postWrap.appendChild(copyBtn);

	const date = document.createElement("p");
	date.classList.add("date");
	postWrap.appendChild(date);
	date.textContent = new Date().toLocaleString();

	if (input.value !== "") {
		post.textContent = input.value;
	} else if (picContainer.children.length > 0) {
		const img = picContainer.children[0];
		post.appendChild(img);
		picContainer.textContent = "";
		fileInput.value = "";
	}

	clickCount += 1;
	postWrap.style.zIndex = clickCount;
	clear.classList.add("active");

	const rgbMin = 200;
	post.style.backgroundColor = `rgb(${
		rgbMin + (256 - rgbMin) * Math.random()
	},${rgbMin + (256 - rgbMin) * Math.random()},${
		rgbMin + (256 - rgbMin) * Math.random()
	})`;

	const postWrapHeight = Number.parseInt(
		window.getComputedStyle(postWrap).height,
	);
	const postWrapWidth = Number.parseInt(
		window.getComputedStyle(postWrap).width,
	);

	postWrap.style.top = `${
		Math.random() * (boardHeight - postWrapHeight + 1)
	}px`;
	postWrap.style.left = `${Math.random() * (boardWidth - postWrapWidth + 1)}px`;

	let flg = false;

	postWrap.addEventListener("pointerdown", () => {
		flg = true;
	});
	window.addEventListener("pointerup", () => {
		flg = false;
	});

	let offsetX;
	let offsetY;

	// document.addEventListener("pointermove", (e) => {
	window.addEventListener("pointermove", (e) => {
		if (!flg) return;
		postWrap.style.top = `${e.clientY - offsetY}px`;
		postWrap.style.left = `${e.clientX - offsetX}px`;
	});

	postWrap.addEventListener("pointerdown", (e) => {
		flg = true;
		offsetX = e.clientX - Number.parseInt(postWrap.style.left);
		console.log(`clientX is ${e.clientX}`);
		console.log(`postPosition is ${postWrap.style.left}`);
		offsetY = e.clientY - Number.parseInt(postWrap.style.top);
		clickCount += 1;
		console.log(clickCount);
		postWrap.style.zIndex = clickCount;
	});

	clear.addEventListener("click", () => {
		clear.classList.remove("active");
		board.textContent = "";
		input.value = "";
		clickCount = 0;
	});

	closeBtn.addEventListener("click", () => {
		postWrap.remove();
		if (board.textContent === "") {
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
	console.log(clickCount);
});
