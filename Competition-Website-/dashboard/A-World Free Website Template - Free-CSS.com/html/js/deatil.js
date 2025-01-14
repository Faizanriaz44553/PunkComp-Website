
import {db, doc, getDoc ,auth ,  onAuthStateChanged} from "../../../../firebase.js"; 


let detailId = localStorage.getItem('cardId')
let DetailSection = document.getElementById("container")
let ticketDiv = document.getElementById("ticket-div")
let signupBtn = document.getElementById("signupBtn")
let loginBtn = document.getElementById("loginBtn")
let buttonDiv = document.getElementById("button-div")
let PayBtn = document.getElementById("PayBtn")
PayBtn.style.display = "none"


const DetailPostView = async()=>{
  DetailSection.innerHTML = `<div class="loader-div"><span class="loader"></span></div>`
  if (!detailId) {
    console.log("error");
    DetailSection.innerHTML = `<div class="loader-div"><span>Error</span></div>`
  }
  
    const docRef = doc(db, "post", detailId);
const docSnap = await getDoc(docRef);
DetailSection.innerHTML = ''
if (docSnap.exists()) {
    const {Title , Description ,Question , Amount, Ticket , Image} = docSnap.data();
    DetailSection.innerHTML = `<div class="sec-div">
            <div class="image-div">
               <img src="${Image}" alt="no img found">
            </div>
            <div class="content-div">
                <h1 class="title">${Title}</h1>
                <p class="des-para">Description: <br>${Description}</p> 
                <h2>Q: ${Question}?</h2>
                <div class="note-div"><p class="note-para">Note: <br>To participate in the competition, complete the payment first. After payment, you will be able to answer the question and enter the competition. Only those who answer correctly will have a chance to win the prize.</p></div>
                <div class="price-container"><h1 class="price"><span id="price-amount">£</span>${Amount}</h1></div> 
            </div>
        </div>`
    let ticketArray = Ticket.split(',').map(item => item.trim());
    CurrerntUser()
    ticketArray.map((item) => {
      console.log(`============> get ticket ${item}`);
      ticketDiv.innerHTML += `<div class="ticket-box"><p>${item}</p></div>`
      
    });

  console.log("Document data:", docSnap.data() , "========>" , Title , Description ,Question , Amount, Ticket , Image);
} else {
  console.log("No such document!");
  DetailSection.innerHTML = `<div class="loader-div"><span>No such document!</span></div>`
}
}

DetailPostView()







// login funtion started
const loginRedirect = ()=>{
console.log('========> Login');
window.location.href = '/dashboard/A-World Free Website Template - Free-CSS.com/html/login.html'

}
loginBtn.addEventListener('click' , loginRedirect)
// login funtion ended


// Signup funtion started
const SignupRedirect = ()=>{
console.log('========> Signup');
window.location.href = '/dashboard/A-World Free Website Template - Free-CSS.com/html/signup.html'
}
signupBtn.addEventListener('click' , SignupRedirect)
// Signup funtion ended



const CurrerntUser = ()=>{
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log(`onAuthStateChange=====> ${user} =======> ${uid}`);
    buttonDiv.style.display = "none"
    PayBtn.style.display = "block"
  }
});
}



const PurchaseAmount = async () => {
  const docRef = doc(db, "post", detailId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    
    const { Title, Description, Question, Amount, Ticket, Image } = docSnap.data();
    
    // Store the destructured data in localStorage as a JSON string
    const dataToStore = { Title, Description, Question, Amount, Ticket, Image };
    localStorage.setItem('payId', JSON.stringify(dataToStore));
    window.location.href = '/dashboard/A-World Free Website Template - Free-CSS.com/html/payment.html'
    
  } else {
    console.log("No such document!");
  }
}

// Add event listener
PayBtn.addEventListener('click', PurchaseAmount);


