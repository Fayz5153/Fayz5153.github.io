
let total = 0;
let total1 = 0;

let all = document.getElementById("form");
let baggage = document.getElementById("baggage");
let bigBaggage = document.getElementById("big-baggage");
let conditioner = document.getElementById("conditioner");
let person = document.getElementById("person")
let send = document.getElementById("check-del");
let from = document.getElementById("from");
let to = document.getElementById("to");
let comment = document.getElementById("comment");
let phone = document.getElementById("phoneNumber");

function myFunction() {
  let x = document.getElementById("check-del").checked;
  if (x) {
    all.classList.add("hidden");
    baggage.checked = false;
    bigBaggage.checked = false;
    conditioner.checked = false;
    person.value = '';
  } else {
    all.classList.remove("hidden");
  }
  // tg__btn.textContent("Буюртма бериш")
}

let perSon = 1;
function myPerson(val) {
  perSon = val
}

// start telegram JS
let tg = window.Telegram.WebApp;

document.getElementById("user_name").innerHTML = tg.initDataUnsafe.user.first_name + ' ' + tg.initDataUnsafe.user.last_name;
document.getElementById('tg-id').value = tg.initDataUnsafe.user.id
let user_id = tg.initDataUnsafe.user.id;
tg.expand();

// tg.MainButton.color = "#FFDD00";
// tg.MainButton.textColor = '#000';
// tg.MainButton.show();
// window.Telegram.WebApp.onEvent("mainButtonClicked", function(){
//   document.getElementById('btn-submit').click();
// });
// tg.MainButton.onClick(() => {
//   document.getElementById('btn-submit').click();
// })
// function btnSubmit () {
//     tg.close();
// }


// Number Format
function myPhoneOn() {
  document.getElementById('codeUz').hidden = false
  document.getElementById('phoneNumber').placeholder = '90 123 45 67'
}
function myPhoneOff() {
  document.getElementById('phoneNumber').placeholder = ''
  if(document.getElementById('phoneNumber').value === ""){
    document.getElementById('codeUz').hidden = true
  }
}

const isNumericInput = (event) => {
  const key = event.keyCode;
  return ((key >= 48 && key <= 57) ||
    (key >= 96 && key <= 105)
  );
};

const isModifierKey = (event) => {
  const key = event.keyCode;
  return (event.shiftKey === true || key === 35 || key === 36) ||
    (key === 8 || key === 9 || key === 13 || key === 46) ||
    (key > 36 && key < 41) ||
    (
      (event.ctrlKey === true || event.metaKey === true) &&
      (key === 65 || key === 67 || key === 86 || key === 88 || key === 90)
    )
};

const enforceFormat = (event) => {
  if(!isNumericInput(event) && !isModifierKey(event)){
    event.preventDefault();
  }
};

const formatToPhone = (event) => {
  if(isModifierKey(event)) {return;}

  const input = event.target.value.replace(/\D/g,'').substring(0,9);
  const areaCode = input.substring(0,2);
  const middle = input.substring(2,5);
  const last = input.substring(5,7);
  const last1 = input.substring(7,9);
  // const last2 = input.substring(10,12);

  // if(input.length > 9){event.target.value =      `${areaCode} ${middle}-${last}-${last1}}`;}
  // else
  if     (input.length > 7){event.target.value = `${areaCode} ${middle} ${last} ${last1}`;}
  else if(input.length > 5){event.target.value = `${areaCode} ${middle} ${last}`;}
  else if(input.length > 2){event.target.value = `${areaCode} ${middle}`;}
  else if(input.length > 0){event.target.value = `${areaCode}`;}
  // console.log(input)
};


const inputs = document.querySelectorAll("#phoneNumber")

for (let i = 0; i < inputs.length; i++) {
  inputs[i].addEventListener('keydown',enforceFormat)
  inputs[i].addEventListener('keyup',formatToPhone);
}

// modal
const tg__btn = document.querySelector("#tg__btn")
const modalClose_btn = document.querySelector(".modal_btn span")
const modal = document.querySelector(".modal")
tg__btn.onclick = modalOpen
modalClose_btn.onclick = modalClose

async function modalOpen() {
  let data = {}
  if (modal.classList.contains("modal__open")) {
    // console.log("bor")
    data.from = from.value
    data.to = to.value
    data.person = person.value
    data.send = send.checked,
    data.baggage = baggage.checked,
    data.bigBaggage = bigBaggage.checked,
    data.conditioner = conditioner.checked,
    data.comment =  comment.value,
    data.phone =  phone.value,
    data.user_id =  phone.user_id,

    console.log(data)

    var raw = JSON.stringify(data)

    console.log(raw)

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`url`, requestOptions)
      .then(response => {
        response.text(); 
        console.log(response)
        if (response.status === 200) {
          tg.close();
        } else {
          alert("Error: "+response.status)
        }
      })
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
    
  } else {
    // console.log("yoq")
    tg__btn.textContent = "Тасдиклаш"
  }

  if (from.value === "" || to.value === "") {
    alert("Манзилни киритинг")
  } else{
    modal.classList.add("modal__open")
  }
  
}
function modalClose() {
  modal.classList.remove("modal__open")
  tg__btn.textContent = "Буюртма бериш"
}
