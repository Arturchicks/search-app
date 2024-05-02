const searchfield = document.querySelector(".searchfield");
const menuList = document.querySelector(".menu");
const reposList = document.querySelector(".repos-list");
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
    console.log("request done");
  } catch (error) {
    console.log(error);
    isError = true;
  }
}
async function addToList(event) {
  const value = event.target.value;
  let newList = "";
  menuList.classList.remove("menuclose");
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
  } else if (!value) {
    menuList.classList.remove("menuopen");
    menuList.classList.add("menuclose");
    setTimeout(() => {
      menuList.classList.remove("open");
    }, 300);
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
  if (!value) {
    menuList.classList.remove("menuopen");
    menuList.classList.add("menuclose");
  }
  array = [];
  isError = false;
}
function removed(el, ms) {
  el.classList.add("deleteElem");
  setTimeout(function () {
    el.remove();
  }, ms);
}
function buttonClose(event) {
  if (reposList.children.length <= 3) {
    reposList.style.overflow = "visible";
    reposList.style.width = "515px";
  }
  if (reposList.children.length === 1) {
    reposList.classList.remove("openrepos");
    reposList.classList.add("closerepos");
    reposList.style.height = "0px";
  }
  removed(event.target.parentNode, 300);
}

function click(event) {
  Array.from(menuList.children).forEach((e) => e.remove());
  reposList.classList.remove("closerepos");
  reposList.classList.add("openrepos");
  reposList.style.height = "180px";
  menuList.classList.remove("menuopen");
  menuList.classList.add("menuclose");
  searchfield.classList.add("searchfield-border");
  if (reposList.children.length >= 2) {
    reposList.style.overflowY = "scroll";
    reposList.style.overflowX = "hidden";
    reposList.style.width = "519px";
    reposList.children[0].style.borderTopRightRadius = "0px";
  }
  let addItem = entries.find((e) => e.id === +event.target.id);
  let ul = document.createElement("ul");
  ul.setAttribute("id", `${event.target.id}`);
  reposList.appendChild(ul);
  ul.classList.add("elem");
  ul.innerHTML = `<li class='elem'><strong>Name:</strong> ${addItem.name}</li><li class='elem'><strong>Stars:</strong> ${addItem.stars}</li><li class='elem'><strong>Owner:</strong> ${addItem.owner}</li>`;
  Array.from(reposList.children).forEach((e) => {
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
