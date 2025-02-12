import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";
import { auth, db } from "../../firebaseConfig.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
// Redirect if user is not logged in
var loginUserUid = localStorage.getItem("loginUserUid");
if (!loginUserUid) {
    window.location.replace("../../index.html");
}
let userData = async () => {
  try {
    const q = query(collection(db, "users"), where("uid", "==", loginUserUid));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (doc) => {
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
userData()


// Select the my-posts div
let myPostDiv = document.querySelector(".my-posts");

// Function to fetch and display user posts
let getMyPosts = async () => {
    try {
        
        const q = query(collection(db, "posts"), where("uid", "==", loginUserUid));
        const querySnapshot = await getDocs(q);
       
        
        myPostDiv.innerHTML = ""; // Clear previous posts

        querySnapshot.forEach((post) => {
            console.log(post.id, post.data());

            myPostDiv.innerHTML += `
                <div class="post">
                    <span class="user-name">You</span>
                    <p>${post.data().postText}</p>
                    <button id='${post.id}' class='update-btn'>Edit</button>
                </div>`;

            // Add event listener for the edit button
            document.getElementById(post.id).addEventListener("click", () => {
                updatePost(post.id);
            });
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
};

// Fetch posts when the page loads
getMyPosts();
document.addEventListener("DOMContentLoaded", () => {
document.querySelector("#signout-btn").addEventListener("click", async () => {
    try {
        await signOut(auth);
        console.log("Logout successful");
        localStorage.removeItem("loginUserUid");
        localStorage.removeItem("username");
        window.location.replace("../../index.html");
    } catch (error) {
        console.error("Logout error:", error.message);
    }
});
})
// for move to dashboard
function dashboard(){
    window.location.replace("../dashboard/dashboard.html");
}
    document.querySelector("#dashboard-btn").addEventListener("click", () => {
        dashboard()
    });
