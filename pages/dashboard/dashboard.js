
const loginUserUid = localStorage.getItem("loginUserUid");
if (!loginUserUid) {
  window.location.replace("../../index.html");
} else {
  const username = localStorage.getItem("username");
}
import { auth, db } from "../../firebaseConfig.js";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
console.log(username);

// import { userData  } from "../../app.js";
// console.log('h1');
let userDataArr = [];
let userData = async () => {
  try {
    const q = query(collection(db, "users"), where("uid", "==", loginUserUid));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (doc) => {
      // console.log("User Data:", doc.data());
     

      console.log("doc.data() =>", doc.data());
      document.getElementById("username").innerText = doc.data().displayName;
      var profilePic = document.querySelector("#profile-pic");
      if (doc.data().photoURL) {
        profilePic.setAttribute("src", doc.data().photoURL);
      }
    });
    // userDataArr.push(doc.data())
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};
userData();
export {userData}
// Logout functionality
document.querySelector("#signout-btn").addEventListener("click", async () => {
    try {
        await signOut(auth);
        console.log("Logout successful");
        localStorage.removeItem("loginUserUid");
        window.location.replace("../../index.html");
    } catch (error) {
        console.error("Logout error:", error.message);
    }
});

// Create a new post
async function createPost(text) {
  try {
    console.log("Firestore DB:", db);

    const docRef = await addDoc(collection(db, "posts"), {
        postText: text,
        uid: loginUserUid,
    });
    console.log("Document written with ID:", docRef.id);
  } catch (error) {
      console.error("Error creating post:", error);
  }
}
let allPostDiv = document.querySelector('.all-posts')
let getAllPosts = async () => {
    allPostDiv.innerHTML = ''
    try {
        const posts = await getDocs(collection(db, "posts"));
        posts.forEach(async(post) => {
            
            const q = query(collection(db, "users"), where("uid", "==", post.data().uid));
            const querySnapshot = await getDocs(q);
            console.log(querySnapshot);
            querySnapshot.forEach((doc) => {
                // post.data() is never undefined for query post snapshots
                console.log(doc.id, doc.data());
                allPostDiv.innerHTML += `<div class="post">${doc.data().displayName}
                    <p> ${post.data().postText}<?p>
                    </div>`
                })
                console.log(post.data());
         
          
        });
    } catch (error) {
        console.error(error);
    }
    }
    getAllPosts()

    // Prevent empty post submission
    document.querySelector("#add").addEventListener("click", () => {
        let postTxt = document.querySelector("#post-inp").value;
        
     allPostDiv.innerHTML += `<div class="post">${username}
     <p>${postTxt}</p>
     </div>`
 
 if (postTxt === "") {
     alert("Post cannot be empty!");
     return;
    }
    
    createPost(postTxt);
     document.querySelector("#post-inp").value = ""
});

function myProfile(){
    window.location.replace('../myPosts/myPosts.html')
}
document.querySelector("#profile-pic").addEventListener("click",function(){
    myProfile()
})