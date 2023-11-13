// let data = [
//   {id: 1,img:"./hotdog.png", title:"Hot-Dog1", price:"10000"},
//   {id: 2,img:"./hotdog.png", title:"Hot-Dog2", price:"10000"},
//   {id: 3,img:"./hotdog.png", title:"Hot-Dog3", price:"10000"},
//   {id: 4,img:"./hotdog.png", title:"Hot-Dog4", price:"10000"},
//   {id: 5,img:"./hotdog.png", title:"Hot-Dog5", price:"10000"},
//   {id: 6,img:"./hotdog.png", title:"Hot-Dog6", price:"10000"},
// ]

let tg = window.Telegram.WebApp;

tg.expand();

tg.MainButton.textColor = "#FFFFFF";
tg.MainButton.color = "#2cab37";

const BASE_URL = "https://enfix.uz"

let grid = document.querySelector("#grid")
let buy = document.querySelector("#buy")
let count = {}
let formData = new FormData()

async function getCategoy() {

  let category = []

  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  await fetch(BASE_URL+"/api/category/", requestOptions)
    .then(response => response.text())
    .then(result => category = JSON.parse(result))
    .catch(error => console.log('error', error));

  // console.log(category)
  showCategory(category)
  
}


function showCategory(category) {
  category.map(item =>{
    let itemDiv = document.createElement("div")
    itemDiv.setAttribute("class", "item category__item")
    itemDiv.innerHTML = `
      <img src="${BASE_URL+item.photo}" alt="${item.name}">
      <p>${item.name}</p>
    `
    itemDiv.addEventListener("click", async function () {

      grid.innerHTML = ""

      let products = []

      var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      
      await fetch(`${BASE_URL}/api/product/?category=${item.id}`, requestOptions)
        .then(response => response.text())
        .then(result => products = JSON.parse(result))
        .catch(error => console.log('error', error));

      // console.log(products)
      showProducts(products)
    })
    grid.append(itemDiv)
  })
}

getCategoy()


function showProducts (data) {
  backButton()
  buyProduct()
  data?.map((item)=>{
    let itemDiv = document.createElement("div")
    itemDiv.setAttribute("class", "item")

    let num = 0

    items(item, itemDiv, num)

    let btn_div = document.createElement("div")
    btn_div.setAttribute("class", "btn_div")
    let btn = document.createElement("button")
    btn.textContent = "Add to Card"
    btn_div.append(btn)

    itemDiv.append(btn_div)
    
    grid.append(itemDiv)

    let btnPlus = document.createElement("button")
    btnPlus.setAttribute("class", "btn_plus")
    btnPlus.textContent = " + "
    let btnMinus = document.createElement("button")
    btnMinus.setAttribute("class", "btn_minus")
    btnMinus.textContent = " - "

    btn.onclick  = () =>{
      btn_div.innerHTML = ""
      btn_div.append(btnMinus)
      btn_div.append(btnPlus)
    }
    if (num === 0) {
      btnMinus.disabled = true
    }
    let span = document.querySelector(`#count${item.id}`)

    btnPlus.onclick = () =>{
      count[item.id] = num+=1
      btnMinus.disabled = false
      span.textContent = num
      console.log(count, num)
    }
    btnMinus.onclick = () =>{
      if (num === 0){
        delete count[item.id]
        btnMinus.disabled = true
        span.textContent = num
      } else {
        count[item.id] = num-=1
        span.textContent = num
        if (num === 0) {
          delete count[item.id]
          btnMinus.disabled = true
        }
      }
      
      console.log(count, num)
    }
  })
}

function items(item, itemDiv) {
  
  let img_div = document.createElement("div")
  let span = document.createElement("span")
  span.setAttribute("id", `count${item.id}`)
  img_div.setAttribute("class", "maxsulot")
  let img = document.createElement("img")
  img.setAttribute("src", BASE_URL+item.photo)
  img.setAttribute("alt", item.name)
  img_div.append(img)
  img_div.append(span)

  let title = document.createElement("p")
  title.setAttribute("class", "title")
  title.textContent = item.name

  let price = document.createElement("p")
  price.setAttribute("class", "price")
  price.textContent = item.price
  
  itemDiv.append(img_div)
  itemDiv.append(title)
  itemDiv.append(price)

}

function backButton() {
  let back_btn = document.createElement("button")
  back_btn.setAttribute("class", "back_btn")
  back_btn.innerHTML = `&larr;`
  back_btn.onclick = () =>{
    count = {}
    getCategoy()
    grid.innerHTML = ""
    buy.innerHTML = ""
    // console.log(count)
  }
  grid.append(back_btn)
}
function buyProduct() {
  let btn = document.createElement("button")
  btn.innerHTML = `Buyurtma berish`
  btn.addEventListener("click", async function() {
    if (Object.keys(count).length == 0) {
      alert("Maxsulot yoq")
    } else {
      let products = {
        product:[],
        // user:[{user_id: tg.initDataUnsafe.user.id}]
        user: tg.initDataUnsafe.user.id
      }
      for(let [key, value] of Object.entries(count)){
        products.product.push({
          id: key,
          quantity: value
        })
      }
      // console.log(products)


      var raw = JSON.stringify(products)

      console.log(raw)

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch(`${BASE_URL}/api/create-card/`, requestOptions)
        .then(response => {
          response.text(); 
          console.log(response.status)
          if (response.status === 200) {
            alert("buyurtma qabul qilinddi"+ products.product)
          } else {
            alert("Error: "+response.status)
          }
        })
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    }
  })
  buy.append(btn)
}

Telegram.WebApp.onEvent("mainButtonClicked", function(){
	// tg.sendData(item);
});

// document.addEventListener('DOMContentLoaded', function() {
//   let tg = window.Telegram.WebApp;
//   console.log(tg)
//   // Use tg object here
// });

let usercard = document.getElementById("usercard");
let userInfo

if (tg.initDataUnsafe.user) {
  // Access properties of tg.initDataUnsafe.user safely
  const firstName = tg.initDataUnsafe.user.first_name;
  const last_name = tg.initDataUnsafe.user.last_name;
  const id = tg.initDataUnsafe.user.id;
  console.log(tg.answerWebAppQuery)
  userInfo = firstName+" "+last_name+" "+id; 
} else {
  // Handle the case where tg.initDataUnsafe.user is undefined
  console.error("tg.initDataUnsafe.user is undefined");
  userInfo = undefined; 
}
// console.log(window.Telegram.WebApp.initDataUnsafe)
// console.log(tg)

// // let userInfo = `${tg.initDataUnsafe.user.first_name}
// // ${tg.initDataUnsafe.user.last_name} ${tg.initDataUnsafe.user.id}`

usercard.innerHTML = userInfo; 

// // console.log(tg.initDataUnsafe.user.first_name)



