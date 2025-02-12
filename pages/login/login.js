import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { auth } from "../../firebaseConfig.js";

document.querySelector('#forSignUpbtn').addEventListener('click', function() {
    window.location.replace('../../index.html');
});

let signIn = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        console.log("Login success:", user);
        localStorage.setItem("loginUserUid", user.uid);
        window.location.replace('../dashboard/dashboard.html');
    } catch (error) {
        console.error("Login error:", error.code, error.message);
        alert("Invalid email or password. Please try again.");
    }
};

document.querySelector('#signin-btn').addEventListener('click', function() {
    var email = document.querySelector('#email').value.trim();
    var password = document.querySelector('#password').value.trim();

    if (email === "" || password === "") {
        alert("Email and password cannot be empty!");
        return;
    }

    signIn(email, password);
});
