// declared variables
const addBtn = document.querySelector("#new-toy-btn");
const toyFormContainer = document.querySelector(".container");
const toyCollectionDiv = document.getElementById('toy-collection');
const toyForm = document.querySelector('.add-toy-form');
const toysURL = `http://localhost:3000/toys`;
let addToy = false;
let arrayOfToys;


// defined functions 


const renderOneToy = (toy) => {
  // create elements and append them
  // or use innerHTML
  const ternary = toy.likes === 1? "Like" : "Likes"
  toyCollectionDiv.innerHTML += `<div data-id=${toy.id} class="card">
  <h2>${toy.name}</h2>
  <img src=${toy.image} class="toy-avatar" />
  <p>${toy.likes} ${ternary} </p>
  <button data-id=${toy.id} class="like-btn">Like <3</button>
</div>`
}

const renderToys = (toysArray) => {
  toyCollectionDiv.innerHTML = ''
  toysArray.forEach(toy => {
    renderOneToy(toy)
  })
}

const fetchToys = () => {
  fetch(toysURL)
    .then(response => response.json())
    .then(toysArray => {
      arrayOfToys = toysArray
      renderToys(toysArray)
    })
}

const handleFormSubmit = (form) => {
  const name = form['name'].value;
  const url = form['image'].value;
  form.reset();
  const formData = {
    name: name,
    image: url,
    likes: 0
  }
  const reqObj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(formData)
  }
  fetch(toysURL, reqObj)
    .then(resp => resp.json())
    .then(toyObject => {
      renderOneToy(toyObject)
    })
    .catch(err => console.log(err))
}

const handleLikes = (target) => {
  const toyId = target.dataset.id;
  const numLikes = parseInt(target.previousElementSibling.innerText.split(" ")[0]);
  const updatedLikes = numLikes + 1;
  const formData = {
    likes: updatedLikes
  }
  const ternary = updatedLikes === 1? "Like" : "Likes"
  // optimistic rendering
  target.previousElementSibling.innerText = `${updatedLikes} ${ternary}`
  const reqObj = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(formData)
  }
  fetch(toysURL + '/' + toyId, reqObj)
    .then(res => res.json())
    .then(updatedToy => {
      console.log(updatedToy);
      // fetchToys();
    })
}

// invoked functions 
fetchToys()



// event listeners



addBtn.addEventListener("click", () => {
  // hide & seek with the form
  addToy = !addToy;
  if (addToy) {
    toyFormContainer.style.display = "block";
  } else {
    toyFormContainer.style.display = "none";
  }
});

toyForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleFormSubmit(e.target);
})


document.addEventListener("click", (e) => {
  if (e.target.className === "like-btn") {
    handleLikes(e.target)
  }
})