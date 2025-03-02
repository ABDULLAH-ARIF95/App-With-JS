import {signInWithEmailAndPassword,signInWithPopup,GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { auth,db } from "../../firebaseConfig.js";
import {
  getDocs,
  collection,
  query,
  where
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";
const provider = new GoogleAuthProvider();
document.querySelector('#forSignUpbtn').addEventListener('click', function() {
    window.location.replace('../../index.html');
});
async function messageModal(messageText) {
    let message = document.querySelector('#message-p')
    message.innerText = messageText
    const modal = document.getElementById("modal-container");
    modal.style.display = "block";
  
    // Hide modal after 2 seconds
    setTimeout(() => {
      modal.style.display = "none";
    }, 3000);
  }

document.getElementById("togglePassword").addEventListener("click", function () {
    const passwordInput = document.getElementById("password");
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      this.classList.replace("fa-eye", "fa-eye-slash"); // Change icon
    } else {
      passwordInput.type = "password";
      this.classList.replace("fa-eye-slash", "fa-eye"); // Change back
    }
  });

var errorMessage = document.querySelector('#error-message')
let signIn = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        console.log("Login success:", user);
        localStorage.setItem("loginUserUid", user.uid);
        messageModal('Sign-in Successful!')
        setTimeout(() => {
            window.location.replace('../dashboard/dashboard.html')
          }, 3000);
    } catch (error) {
        console.error("Login error:", error.code, error.message);
        errorMessage.innerText = "Incorrect password. Try again.";
        errorMessage.style.display = "block";
        
    }
};
// Google Sign-Up
async function signUpWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userQuery = query(collection(db, "users"), where("email", "==", user.email));
    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      localStorage.setItem("loginUserUid", user.uid);
      localStorage.setItem("username", user.displayName);
      messageModal("Successfully signed in with Google!");
      setTimeout(() => {
        window.location.replace("../dashboard/dashboard.html");
      }, 3000);
    } else {
      await addUserData(user);
      localStorage.setItem("loginUserUid", user.uid);
      localStorage.setItem("username", user.displayName);
      messageModal("Successfully signed up with Google!");
      setTimeout(() => {
        window.location.replace("../dashboard/dashboard.html");
      }, 3000);
    }
  } catch (error) {
    console.error("Google Sign-In Error:", error.message);
  }
}
document.getElementById("forgot-password").addEventListener("click", function () {
    
    window.location.replace('../forgotPass/forget.html')
});

document.querySelector('#signin-btn').addEventListener('click',async function() {
var email = document.querySelector('#email').value.trim();
var password = document.querySelector('#password').value.trim();
    if (email === "" || password === "") {
        alert("Email and password cannot be empty!");
        return;
    }
    try {
      
    
        signIn(email, password);
        
    } catch (error) {
        console.log(error);
       
    }
});

document.querySelector("#Google-Btn").addEventListener("click", function() {
  signUpWithGoogle()
});