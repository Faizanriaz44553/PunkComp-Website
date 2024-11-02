// Retrieve stored data from localStorage
const storedData = JSON.parse(localStorage.getItem('payId'));
const { Title, Description, Amount, Image } = storedData;

// Populate checkout page with product info
document.getElementById('product-title').textContent = Title;
document.getElementById('product-description').textContent = Description;
document.getElementById('product-amount').textContent = Amount;
document.getElementById('product-image').src = Image;

// Initialize Stripe
const stripe = Stripe('pk_test_51PuvL8HG1xPdW1Cj3K1BBZhMzK7I11MAubppNwJ8GdFEmLYlrgoOEOuvPi1XApamKLopBsFMWInllCvxnRIqgtP100Lz9oj4N7');
const elements = stripe.elements();
const cardElement = elements.create('card');
cardElement.mount('#card-element');

// Handle form submission
const form = document.getElementById('payment-form');
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Fetch the client secret from the backend
    const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Title, Description, Amount, Image }),  // Send product data to backend
    });

    const { clientSecret } = await response.json();

    // Confirm the payment with Stripe
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
    });

    if (error) {
        document.getElementById('payment-result').textContent = `Payment failed: ${error.message}`;
    } else {
        document.getElementById('payment-result').textContent = 'Payment successful!';
        $('#paymentModal').modal('show'); 
    }
});

 
 // Ticket number and answer validation in modal

 let modalSubmit = document.getElementById('submit-details');
const modalSubmitFuntion =  async() => {
    const userTicket = document.getElementById('ticket-number').value;
    const userAnswer = document.getElementById('question-answer').value;
    let UserId = localStorage.getItem('cardId')
    let filterNumber = Ticket.includes(userTicket)
    console.log(filterNumber);
    
    // Validate ticket number and answer from localStorage
    if (filterNumber && userAnswer) {
        // Success message
        Toastify({
            text: 'Ticket verified! Withdrawal details will be live soon.',
            duration: 3000,
            gravity: 'top',
            position: 'left',
            style: { background: 'linear-gradient(to right, #00b09b, #96c93d)' }
        }).showToast();

        let ticketArray = Ticket.split(',').map(item => item.trim());

         ticketArray = ticketArray.filter(item => item !== userTicket);  // 333 ko remove kar diya

        let updatedTicketString = ticketArray.join(', ');
        const washingtonRef = doc(db, "post", UserId);

        await updateDoc(washingtonRef, {
            Ticket : updatedTicketString
        });
        // Close modal and redirect to withdrawal details page
        $('#paymentModal').modal('hide');
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const loggedInEmail = user.email;
                console.log("User is logged in with Email:", loggedInEmail);
                AllUserDataShow(loggedInEmail , userTicket , userAnswer);
                setTimeout(() => {
                    window.location.href = "/dashboard/A-World Free Website Template - Free-CSS.com/html/index.html"; // 
                }, 2000);
            } else {
                console.log("No user is currently logged in");
            }
        });
    } else {
        // Error message
        Toastify({
            text: 'Invalid ticket number or wrong answer.',
            duration: 3000,
            gravity: 'top',
            position: 'left',
            style: { background: 'linear-gradient(to right, #ff5f6d, #ffc371)' }
        }).showToast();
    }
}

modalSubmit.addEventListener('click' , modalSubmitFuntion())



const AllUserDataShow = async(loggedInEmail , userTicket , userAnswer) => {
    try {
      const querySnapshot = await getDocs(collection(db, "userData"));
  
      const matchedUser = querySnapshot.docs.find((doc) => {
        const { email } = doc.data();
        return email === loggedInEmail;
      });
  
      if (matchedUser) {
        const userData = matchedUser.data();
        addPurchaseData(userData , userTicket , userAnswer)
        
      } else {
        console.log("No matching user found with this email.");
      }
  
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };


const addPurchaseData =async (data , userTicket , userAnswer)=>{
    const {Fname , Uname , email , password , phone } = data;
    try {
        const docRef = await addDoc(collection(db, "users"), {
            Fname: Fname,
            Uname: Uname,
            email: email,
            password: password,
            phone: phone,
            Title: Title,
            Description: Description,
            Question: Question,
            Amount: Amount,
            Ticket: userTicket,
            Image: Image,
            Answer: userAnswer,
            purchaseTime: serverTimestamp(),
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
}

