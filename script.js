const searchfield = document.querySelector(".searchfield");
const menuList = document.querySelector(".menu");
const repos = document.querySelector(".repos-list");
let reposList = "";
let array = [];
let entries = [];
let isError = false;
const lettersRegex = /\S/i;

async function getData(e) {
  try {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${e}&per_page=5`
    );
    const post = await response.json();
    post.items.forEach((el) =>
      entries.push({
        id: el.id,
        name: el.name,
        stars: el.stargazers_count,
        owner: el.owner.login,
      })
    );
    post.items.forEach((el) =>
      array.push({
        id: el.id,
        name: el.name,
        stars: el.stargazers_count,
        owner: el.owner.login,
      })
    );
  } catch (error) {
    console.log(error);
    isError = true;
  }
}
async function addToList(event) {
  const value = event.target.value;
  let newList = "";
  if (lettersRegex.test(value)) {
    await getData(value);
  } else {
    isError = true;
  }
  array.forEach((el) => {
    newList +=
      `<li class='menu-item addItem' id='${el.id}'>` + el.name + "</li>";
  });
  if (value && isError !== true) {
    menuList.classList.add("open");
    menuList.classList.add("menuopen");
    menuList.innerHTML = newList;
    searchfield.classList.remove("searchfield-border");
  } else {
    menuList.classList.remove("open");
    searchfield.classList.add("searchfield-border");
  }
  if (newList === "") {
    searchfield.classList.add("searchfield-border");
  }
  for (let i = 0; i < menuList.children.length; i++) {
    menuList.children[i].addEventListener("click", click);
  }
  array = [];
}
function removed(el, ms) {
  el.classList.add("deleteElem");
  setTimeout(function () {
    el.remove();
  }, ms);
}
function buttonClose(event) {
  if (repos.children.length <= 3) {
    repos.style.overflow = "visible";
  }
  removed(event.target.parentNode, 300);
}

function click(event) {
  if (repos.children.length <= 3) {
    repos.style.overflow = "visible";
  }
  menuList.classList.remove("open");
  searchfield.classList.add("searchfield-border");
  if (repos.children.length >= 2) {
    repos.style.overflowY = "scroll";
    repos.style.overflowX = "hidden";
  }
  let addItem = entries.find((e) => e.id === +event.target.id);
  let ul = document.createElement("ul");
  ul.setAttribute("id", `${event.target.id}`);
  repos.appendChild(ul);
  ul.classList.add("elem");
  ul.innerHTML = `<li class='elem'><strong>Name:</strong> ${addItem.name}</li><li class='elem'><strong>Stars:</strong> ${addItem.stars}</li><li class='elem'><strong>Owner:</strong> ${addItem.owner}</li>`;
  Array.from(repos.children).forEach((e) => {
    if (!e.contains(e.querySelector("button"))) {
      e.appendChild(document.createElement("button"));
    }
  });
  document.querySelectorAll("button").forEach((e) => {
    e.classList.add("closeButton");
    if (!e.classList.contains("onevent")) {
      e.classList.add("onevent");
      e.addEventListener("click", buttonClose);
    }
  });
  this.remove();
  searchfield.value = "";
  if (menuList.children.length === 0) {
    searchfield.classList.add("searchfield-border");
  }
}

function debounce(fn, debounceTime) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(this, arguments);
    }, debounceTime);
  };
}
const debounced = debounce(addToList, 400);
searchfield.addEventListener("keydown", debounced);
