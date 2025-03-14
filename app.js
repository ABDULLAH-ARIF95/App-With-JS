var loginUser = localStorage.getItem("loginUserUid");
if (loginUser) {
  window.location.replace('./pages/dashboard/dashboard.html')
}


import { auth, db } from "./firebaseConfig.js";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import {
  addDoc,
  getDocs,
  collection,
  query,
  where
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";
const provider = new GoogleAuthProvider();

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
export async function messageModal1(messageText) {
  let message = document.querySelector('#message-p')
  message.innerText = messageText
  const modal = document.getElementById("modal-container");
  modal.style.display = "block";

  // Hide modal after 2 seconds
  setTimeout(() => {
    modal.style.display = "none";
  }, 3000);
}
// Function to add user data to Firestore
async function addUserData (user)  {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      email: user.email,
      phoneNumber: user.phoneNumber,
      photoURL: user.photoURL ,
      displayName: user.displayName,
      uid: user.uid,
    })
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};
// addUserData()

let emailErrorMessage = document.querySelector("#email-error");
let passErrorMessage = document.querySelector("#password-error");
let nameErrorMessage = document.querySelector("#name-error");
let phoneNumErrorMessage = document.querySelector("#phoneNum-error");


//  Validate Email
function isValidEmail() {
  let emailInp = document.querySelector("#email-inp").value;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(emailInp)) {
    emailErrorMessage.style.display = 'block'
    return false
  }
  emailErrorMessage.style.display = 'none'
  return true
}



//  Validate Pakistani Phone Number
function isValidPakistaniPhone() {
let phoneNumInp = document.querySelector("#phoneNum-inp").value;
if (!/^\d+$/.test(phoneNumInp)) {
  phoneNumErrorMessage.textContent = " only numbers (No alphabets or symbols)!";
  phoneNumErrorMessage.style.display = "block";
  return false;
}
phoneNumErrorMessage.style.display = 'none'
const pakistaniPhoneRegex = /^03[0-9]{9}$/;
if (!pakistaniPhoneRegex.test(phoneNumInp)) {
  
  phoneNumErrorMessage.textContent = " Invalid Phone Number! ";
  phoneNumErrorMessage.style.display = 'block'
  return
}
phoneNumErrorMessage.style.display = 'none'
return true

}

//  Validate Name
function isValidName() {
  let nameInp = document.querySelector("#name-inp").value;
  const nameRegex = /^[a-zA-Z ]{4,}$/;
  if (nameInp.indexOf("!")!==-1||nameInp.indexOf("@")!==-1||nameInp.indexOf("#")!==-1||nameInp.indexOf("$")!==-1||nameInp.indexOf("%")!==-1||nameInp.indexOf("^")!==-1||nameInp.indexOf("&")!==-1||nameInp.indexOf("*")!==-1||nameInp.indexOf(",")!==-1||nameInp.indexOf(".")!==-1||nameInp.indexOf("?")!==-1) {
    nameErrorMessage.innerText = "no special characters allowed"
    nameErrorMessage.style.display = 'block'
    return
  }
  
  if (!nameRegex.test(nameInp)) {
    nameErrorMessage.innerText = "invalid name (atleast 4 characters required)"
    nameErrorMessage.style.display = 'block'
    return 
  }
  nameErrorMessage.style.display = 'none'
  return true
  
}

//  Validate Strong Password
function isValidPassword() {
  let passInp = document.querySelector("#password-inp").value;
  const password = passInp;
  if (password.length < 6) {
    passErrorMessage.textContent = "Password must be at least 6 characters!";
    passErrorMessage.style.display = "block";
    return false;
  }
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
if (!strongPasswordRegex.test(password)) {
  passErrorMessage.textContent = "Weak password!   (A-Z)(a-z)(0-9)";
  passErrorMessage.style.display = "block";
  return false;
}

passErrorMessage.style.display = 'none'
return true
   
  }
  

  
  // Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector("#Google-Btn").addEventListener("click", function() {
    signUpWithGoogle()
  });
  
  document.querySelector("#email-inp").addEventListener("input", function() {
    isValidEmail()
  });
  document.querySelector("#name-inp").addEventListener("input", function() {
    isValidName()
  });
  document.querySelector("#phoneNum-inp").addEventListener("input", function() {
    isValidPakistaniPhone()
  });
  document.querySelector("#password-inp").addEventListener("input", function() {
    isValidPassword()
  });
  
document.getElementById("signup-btn").addEventListener("click", function () {
  let emailInp = document.querySelector("#email-inp").value;
let passInp = document.querySelector("#password-inp").value;
let nameInp = document.querySelector("#name-inp").value;
let phoneNumInp = document.querySelector("#phoneNum-inp").value;
  if (!emailInp||!passInp||!phoneNumInp||!nameInp === "") {
   alert('Please input all the fields')
   return
  }
  console.log(isValidEmail,isValidName,isValidPakistaniPhone(),isValidPassword());
  
  if (!isValidEmail()||!isValidName()||!isValidPakistaniPhone()||!isValidPassword()) {
   alert('Please input all the fields correctly')
   return
  }
  signUpUser(emailInp, passInp, phoneNumInp, nameInp);
});

document.getElementById("signin-btn").addEventListener("click", function () {
  window.location.replace('./pages/login/login.html');
});
})
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
      messageModal("Successfully signed up with Google!");
      setTimeout(() => {
        window.location.replace("./pages/dashboard/dashboard.html");
      }, 3000);
    } else {
      await addUserData(user);
      localStorage.setItem("loginUserUid", user.uid);
      localStorage.setItem("username", user.displayName);
      messageModal("Successfully signed up with Google!");
      setTimeout(() => {
        window.location.replace("./pages/dashboard/dashboard.html");
      }, 3000);
    }
  } catch (error) {
    console.error("Google Sign-In Error:", error.message);
  }
}

// Email/Password Sign-Up
let signUpUser = (Email, Password, PhoneNum, Name) => {
  createUserWithEmailAndPassword(auth, Email, Password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      
      await addDoc(collection(db, "users"), {
        email: user.email,
        phoneNumber: PhoneNum || "",
        photoURL: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        displayName: Name,
        uid: user.uid,
      })
      localStorage.setItem("loginUserUid", user.uid);
      localStorage.setItem("username", Name);
      messageModal("Successfully signed up!")
      setTimeout(() => {
        window.location.replace('./pages/dashboard/dashboard.html');
      }, 3000);
    })
    .catch((error) => {
      console.error("Sign Up Error:", error.message);
    });
};
