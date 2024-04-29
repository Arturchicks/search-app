const searchfield = document.querySelector(".searchfield");
const list = document.querySelector(".menu");
const repos = document.querySelector(".repos-list");
let itemsy = document.querySelectorAll(".menu-item");
let reposList = "";
let array = [];
let entries = [];
let count = 0;
let object = {};
let isClicked = false;

async function fn(e) {
  let newList = "";
  const value = e.target.value;
  try {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${value}&per_page=5`
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
  } catch (e) {
    console.log(e);
  }
  array.forEach((el) => {
    newList += `<li class='menu-item' id='${el.id}'>` + el.name + "</li>";
  });
  list.innerHTML = newList;
  if (value) {
    list.classList.add("open");
    searchfield.style.borderBottomLeftRadius = "0px";
    searchfield.style.borderBottomRightRadius = "0px";
  } else {
    list.classList.remove("open");
    searchfield.style.borderBottomLeftRadius = "5px";
    searchfield.style.borderBottomRightRadius = "5px";
  }
  if (newList === "") {
    searchfield.style.borderBottomLeftRadius = "5px";
    searchfield.style.borderBottomRightRadius = "5px";
  }
  let listItem = Array.from(list.children).slice();
  function click(event) {
    let addItem = entries.find((e) => e.id === +event.target.id);
    let ul = document.createElement("ul");
    ul.setAttribute("id", `${event.target.id}`);
    repos.appendChild(ul);
    ul.innerHTML = `<li>Name: ${addItem.name}</li><li>Stars: ${addItem.stars}</li><li>Owner: ${addItem.owner}</li>`;
    Array.from(repos.children).forEach((e) => {
      if (!e.contains(e.querySelector("button"))) {
        e.appendChild(document.createElement("button"));
      }
    });
    document
      .querySelectorAll("button")
      .forEach((e) => e.classList.add("closeButton"));
    this.remove();
    searchfield.value = "";
    if (Array.from(list.children).length === 0) {
      searchfield.style.borderBottomLeftRadius = "5px";
      searchfield.style.borderBottomRightRadius = "5px";
    }
    for (let i = 0; i < list.children.length; i++) {
      if (repos.children.length >= 3) {
        list.children[i].removeEventListener("click", click);
      } else {
        list.children[i].addEventListener("click", click);
      }
    }

    count++;
    document.querySelectorAll(".closeButton").forEach((e) => {
      if (!e.classList.contains("onevent")) {
        e.classList.add("onevent");
        e.addEventListener("click", function btn(evt) {
          if (list.children.length == 5 && repos.children.length > 0) {
            this.parentNode.remove();
            for (let i = 0; i < list.children.length; i++) {
              list.children[i].addEventListener("click", click);
            }
          } else if (
            entries
              .map((e) => e.id)
              .slice(-5)
              .includes(+evt.target.parentNode.id)
          ) {
            this.parentNode.remove();
            count--;
            let returnItem = entries.find(
              (e) => e.id === +evt.target.parentNode.id
            );
            let returnItemToList = list.appendChild(
              document.createElement("li")
            );
            returnItemToList.classList.add("menu-item");
            returnItemToList.setAttribute("id", `${returnItem.id}`);
            returnItemToList.innerHTML = `${returnItem.name}`;
            for (let i = 0; i < list.children.length; i++) {
              if (repos.children.length >= 3) {
                list.children[i].removeEventListener("click", click);
              } else {
                list.children[i].addEventListener("click", click);
              }
            }
          } else {
            this.parentNode.remove();
          }
        });
      }
    });
  }

  if (repos.children.length < 3) {
    listItem.forEach((e) => e.addEventListener("click", click));
  } else {
    listItem.forEach((e) => e.removeEventListener("click", click));
  }
  array = [];
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
const debounced = debounce(fn, 400);
searchfield.addEventListener("keydown", debounced);
