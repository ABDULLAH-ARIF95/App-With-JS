import {signInWithEmailAndPassword,sendPasswordResetEmail,EmailAuthProvider,reauthenticateWithCredential  } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { auth } from "../../firebaseConfig.js";

document.querySelector('#forSignUpbtn').addEventListener('click', function() {
    window.location.replace('../../index.html');
});
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
        window.location.replace('../dashboard/dashboard.html');
    } catch (error) {
        console.error("Login error:", error.code, error.message);
        errorMessage.innerText = "Incorrect password. Try again.";
        errorMessage.style.display = "block";
        
    }
};

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
