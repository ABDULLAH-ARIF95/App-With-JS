const loginUserUid = localStorage.getItem("loginUserUid");
if (!loginUserUid) {
  window.location.replace("../../index.html");
}
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "../../firebaseConfig.js";
document.getElementById("reset-password-btn").addEventListener("click", function () {
    console.log('click');
    
    const email = document.getElementById("email").value;
    const message = document.getElementById("message");

    if (!email) {
        message.style.color = "red";
        message.innerText = "Please enter your email.";
        return;
    }

    sendPasswordResetEmail(auth, email)
        .then(() => {
            message.style.color = "green";
            message.innerText = "Password reset email sent! Check your inbox.";
        })
        .catch((error) => {
            message.style.color = "red";
            message.innerText = "Error: " + error.message;
        });
});
document.getElementById("back-btn").addEventListener("click", function () {
    window.location.replace('../login/login.html')
})