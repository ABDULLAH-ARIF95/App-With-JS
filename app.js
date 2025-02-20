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

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector("#Google-Btn").addEventListener("click", function() {
    signUpWithGoogle()
  });
  
  document.getElementById("signup-btn").addEventListener("click", function () {
    let emailInp = document.querySelector("#email-inp").value;
    let passInp = document.querySelector("#password-inp").value;
    let nameInp = document.querySelector("#name-inp").value;
    let phoneNumInp = document.querySelector("#phoneNum-inp").value;
    console.log(emailInp,passInp,nameInp,phoneNumInp);
    
    if (!emailInp||!passInp||!phoneNumInp||!nameInp === "") {
     alert('Please input all the fields')
     return
    }
    signUpUser(emailInp, passInp, phoneNumInp, nameInp);
  });
  
  document.getElementById("signin-btn").addEventListener("click", function () {
    window.location.replace('./pages/login/login.html');
  });
});

// Google Sign-Up
 async function signUpWithGoogle() {
   signInWithPopup(auth, provider)
   .then(async(result) => {
     const user = result.user;
      try {
        const userQuery = query(collection(db, "users"), where("email", '==',user.email));
         const querySnapshot = await getDocs(userQuery);
         querySnapshot.forEach((users) => {
           if (users.data().email === user.email) {
             localStorage.setItem("loginUserUid", user.uid);
             localStorage.setItem("username", user.displayName);
             window.location.replace('./pages/dashboard/dashboard.html');
            return
           }
          
          });
          await addUserData(user);
        } catch (error) {
          console.log(error);
          
        }
    })
    .catch((error) => {
      console.error("Google Sign-In Error:", error.message);
    });
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
      window.location.replace('./pages/dashboard/dashboard.html');
    })
    .catch((error) => {
      console.error("Sign Up Error:", error.message);
    });
};
