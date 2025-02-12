import {
    collection,
    getDocs,
    updateDoc,
    deleteDoc,
    orderBy,
    addDoc,
    doc,
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

let getMyPosts = async () => {
    try {
        const q = query(collection(db, "posts"), where("uid", "==", loginUserUid,orderBy("dateOfCreation", "desc")));
        const querySnapshot = await getDocs(q);
       
        myPostDiv.innerHTML = ""; // Clear previous posts
        
        querySnapshot.forEach((post) => {
            console.log(post.id, post.data());
            
            myPostDiv.innerHTML += `
                <div class="post">
                    <div class="post-head">
                        <span class="user-name">You</span>
                        <div>
                            <button class='edit-btn' id='${post.id}'><i class="fa-solid fa-pen"></i></button>
                            <button class='update-btn' id='${post.id}' style = 'display:none'><i class="fa-solid fa-floppy-disk"></i></button>
                            <button class='delete-btn' id='${post.id}'><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                    <input type='text' class='update-inp' style = 'display:none' value = '${post.data().postText}'>
                    <p id='p-text'>${post.data().postText}</p>
                    <p>Created at: ${post.data().dateOfCreation}</p>
                </div>`;

        });

        // Add event listeners after posts are rendered
        document.querySelectorAll(".edit-btn").forEach((btn) => {
            btn.addEventListener("click", (event) => {
                let postId = event.currentTarget.id;
                editPost(postId,event.currentTarget);
            });
        });
        document.querySelectorAll(".update-btn").forEach((btn) => {
            btn.addEventListener("click", (event) => {
                let postId = event.currentTarget.id;
                updatePost(postId,event.currentTarget);
            });
        });

        document.querySelectorAll(".delete-btn").forEach((btn) => {
            btn.addEventListener("click", (event) => {
                let postId = event.currentTarget.id;
                deletePost(postId);
            });
        });

    } catch (error) {
        console.error("Error fetching posts:", error);
    }
};

function editPost(postId,event) {
    
    console.log("Editing post:", postId,event.nextElementSibling.nextElementSibling);
    let postContainer = event.parentElement.parentElement.parentElement;
        
    // Get the input field inside the same post
    let inputField = postContainer.querySelector(".update-inp");
    inputField.style.display = 'block'

    
    event.style.display = 'none'
    event.nextElementSibling.nextElementSibling.style.display = 'none'
    postContainer.querySelector(".update-btn").style.display = 'block';
    postContainer.querySelector("#p-text").style.display = 'none';
    
    
    // Implement edit logic here (e.g., show an input field for editing)
}
async function updatePost(postId,event) {
    
    console.log("Editing post:", postId,event.nextElementSibling.nextElementSibling);
    let postContainer = event.parentElement.parentElement.parentElement;
        
    // Get the input field inside the same post
    let inputField = postContainer.querySelector(".update-inp").value;
    // inputField.style.display = 'block'
    try {
        // Add a new document in collection "cities"
        await updateDoc(doc(db, "posts", postId), {
          postText: inputField,
        }).then(()=>{
          console.log("update done",event.style.display,event.previousElementSibling.style.display );
          event.style.display = 'none'
          event.previousElementSibling.style.display = 'block'
    event.nextElementSibling.style.display = 'block'
    postContainer.querySelector(".update-btn").style.display = 'none';
    postContainer.querySelector("#p-text").style.display = 'block';
          getMyPosts();
        })
      } catch (error) {
        console.error(error)
      }
    console.log(inputField);
    
}

async function deletePost(postId) {
    console.log(postId);
    await deleteDoc(doc(db, "posts", postId)).then(()=>{
        getMyPosts()
    })
    
}
var date  = new Date ()
var currentDate = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`

async function createPost(text) {
  try {
    console.log("Firestore DB:", db);

    const docRef = await addDoc(collection(db, "posts"), {
        postText: text,
        uid: loginUserUid,
        dateOfCreation:currentDate
    });
    console.log("Document written with ID:", docRef.id);
  } catch (error) {
      console.error("Error creating post:", error);
  }
}
var username = localStorage.getItem('username')
    document.querySelector("#add").addEventListener("click", () => {
        let postTxt = document.querySelector("#post-inp").value;
        
        myPostDiv.innerHTML += `
        <div class="post">
            <div class="post-head">
                <span class="user-name">You</span>
                <div>
                    <button class='edit-btn'><i class="fa-solid fa-pen"></i></button>
                    <button class='update-btn'  style = 'display:none'><i class="fa-solid fa-floppy-disk"></i></button>
                    <button class='delete-btn' ><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
            <input type='text' class='update-inp' style = 'display:none' value = '${postTxt}'>
            <p id='p-text'>${postTxt}</p>
            <p>Created at: ${currentDate}</p>
        </div>`;
     
 
 if (postTxt === "") {
     alert("Post cannot be empty!");
     return;
    }
    
    createPost(postTxt);
     document.querySelector("#post-inp").value = ""
});
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

    var postIcon =  document.querySelector('.create-post')
document.querySelector("#for-post").addEventListener("click",function(){
   postIcon.style.display = 'block'
})
document.querySelector("#cancel-btn").addEventListener("click",function(){
   postIcon.style.display = 'none'
})