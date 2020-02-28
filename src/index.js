// starting

// pseudocode
// practice get, post, patch, organization, data transfer


TOYS_URL = 'http://localhost:3000/toys'
let addToy = false;
const toyForm = document.querySelector(".container");
const addButton = document.querySelector('#new-toy-btn')
const cardsContainer = document.querySelector('#toy-collection')



const handleAddingToyFormShow = () => {
  addToy = !addToy;
  addToy ? toyForm.style.display = "block" : toyForm.style.display = "none";
}

const fetchToys = () => {
  fetch(TOYS_URL)
  .then(resp => resp.json())
  .then(toysData => renderToys(toysData))
  .catch(err => console.log(err))
}

const renderToys = (toysData) => {
  toysData.forEach(toy => {
    const toyCard = ` <div class="card" >
    <h2>${toy.name}</h2>
    <img src=${toy.image} class="toy-avatar" />
    <p>${toy.likes} Likes </p>
    <button class="like-btn" data-id="${toy.id}" data-likes="${toy.likes}" >Like <3</button>
  </div>`
  cardsContainer.innerHTML += toyCard
  })
}

const addNewToy = (event) => {
  event.preventDefault()
  let toyName = event.target[0].value
  let toyImage = event.target[1].value
  if (toyImage === "") {
    toyImage = "http://www.pngmart.com/files/3/Toy-Story-Alien-PNG-File.png"
  }
  if (toyName === "") {
    toyName = "Little Green Men"
  }
  fetch(TOYS_URL, newToyObj(toyName, toyImage))
  .then(resp => resp.json())
  .then(newToy => renderNewToy(newToy))
  .catch(err => console.log(err))
}

const renderNewToy = (newToy) => {
  toyForm.children[0].reset()
  toyForm.children[0].appendChild(document.createElement('p'))
  const pTag = toyForm.children[0].children[6]
  pTag.style.fontSize = "20px"
  pTag.style.textAlign = "center"
  pTag.style.color = "Red"
  pTag.style.backgroundColor = "yellow"
  toyForm.children[0].children[6].innerText = `Success! ${newToy.name} added to Andy's Toy List!`
  const toyCard = ` <div class="card" >
  <h2>${newToy.name}</h2>
  <img src=${newToy.image} class="toy-avatar" />
  <p>${newToy.likes} Likes </p>
  <button class="like-btn" data-id="${newToy.id}" data-likes="${newToy.likes}">Like <3</button>
</div>`
cardsContainer.innerHTML += toyCard
}

const newToyObj = (toyName, toyImage) => {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      name: toyName,
      image: toyImage,
      likes: 0
    })
  }
}

const likeToy = (event) => {
  if (event.target.className === "like-btn") {
    const toyId = parseInt(event.target.dataset.id)
    const likes = parseInt(event.target.dataset.likes)
    const clicked = event.target
    fetch(`${TOYS_URL}/${toyId}`, likePatchObj(likes))
    .then(resp => resp.json())
    .then(updatedToy => renderUpdatedToy(clicked, updatedToy))
    .catch(err => console.log(err))
  }
}

const likePluralize = (number) => {
  return number == 1 ? "Like" : "Likes"
}

const renderUpdatedToy = (clicked, updatedToy) => {
  console.log(updatedToy)
  clicked.dataset.likes = updatedToy.likes
  clicked.previousElementSibling.innerText = `${updatedToy.likes} ${likePluralize(updatedToy.likes)}`
}

const likePatchObj = (likes) => {
  return {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      likes: likes + 1
    })
  }
}



//  event listeners


addButton.addEventListener('click', handleAddingToyFormShow)
toyForm.addEventListener('submit', addNewToy)
cardsContainer.addEventListener('click', likeToy)


 //  invoked functions
fetchToys()
