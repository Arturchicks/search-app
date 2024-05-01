const searchfield = document.querySelector(".searchfield");
const list = document.querySelector(".menu");
const repos = document.querySelector(".repos-list");
let reposList = "";
let array = [];
let entries = [];
let count = 0;
let isError = false;

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
    isError = true;
  }
  array.forEach((el) => {
    newList +=
      `<li class='menu-item addItem' id='${el.id}'>` + el.name + "</li>";
  });
  list.innerHTML = newList;
  const array2 = Array.from(list.children).slice();
  if (value && entries.length > 0 && isError !== true) {
    list.classList.add("open");
    list.classList.add("menuopen");
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

  function click(event) {
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
      function removed(el, ms) {
        el.classList.add("deleteElem");
        setTimeout(function () {
          el.remove();
        }, ms);
      }
      if (!e.classList.contains("onevent")) {
        e.classList.add("onevent");
        e.addEventListener("click", function btn(evt) {
          if (list.children.length == 5 && repos.children.length > 0) {
            removed(evt.target.parentNode, 300);
            for (let i = 0; i < list.children.length; i++) {
              list.children[i].addEventListener("click", click);
            }
          } else if (
            entries
              .map((e) => e.id)
              .slice(-5)
              .includes(+evt.target.parentNode.id)
          ) {
            removed(evt.target.parentNode, 300);
            count--;
            let returnItem = entries.find(
              (e) => e.id === +evt.target.parentNode.id
            );
            let returnItemToList = list.appendChild(
              document.createElement("li")
            );
            returnItemToList.classList.add("menu-item");
            returnItemToList.classList.add("addItem");
            returnItemToList.addEventListener("click", click);
            returnItemToList.setAttribute("id", `${returnItem.id}`);
            returnItemToList.innerHTML = `${returnItem.name}`;
            console.log(array2);

            for (let i = 0; i < list.children.length; i++) {
              list.children[i].addEventListener("click", click);
            }
          } else {
            removed(evt.target.parentNode, 300);
            for (let i = 0; i < list.children.length; i++) {
              list.children[i].addEventListener("click", click);
            }
          }
        });
      }
    });
    if (count < 3) {
      Array.from(list.children).forEach((e) =>
        e.addEventListener("click", click)
      );
    }
  }

  if (repos.children.length < 3) {
    Array.from(list.children).forEach((e) =>
      e.addEventListener("click", click)
    );
  } else {
    Array.from(list.children).forEach((e) =>
      e.removeEventListener("click", click)
    );
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
