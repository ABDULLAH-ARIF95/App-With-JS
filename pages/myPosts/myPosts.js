import {
    collection,
    getDocs,
    updateDoc,
    deleteDoc,
    orderBy,
    addDoc,
    getDoc,
    doc,
    query,
    where
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";
import { auth, db } from "../../firebaseConfig.js";
import { signOut,deleteUser } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
// Redirect if user is not logged in
var loginUserUid = localStorage.getItem("loginUserUid");
if (!loginUserUid) {
    window.location.replace("../../index.html");
}
 let userProfilePic = [] ;
 let userDocid = [] ;
let userData = async () => {
  try {
    const q = query(collection(db, "users"), where("uid", "==", loginUserUid));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (doc) => {
      console.log("doc.data() =>", doc.data());
      document.getElementById("username").innerText = doc.data().displayName;
      var profilePic = document.querySelector("#profile-pic");
      userProfilePic.push(doc.data().photoURL)
        profilePic.setAttribute("src", doc.data().photoURL);
        console.log(doc.data().photoURL);
      userDocid.push(doc.id)
        console.log(doc.id);

    });
    
    // userDataArr.push(doc.data())
  } catch (error) {
    console.error("Error fetching user data:", error);
}
};
userData()
// console.log(userProfilePic);
// let fetchUserPosts=[]
var likeCount;
// Select the my-posts div
let myPostDiv = document.querySelector(".my-posts");

let getMyPosts = async () => {
    try {
        const q = query(collection(db, "posts"), where("uid", "==", loginUserUid,orderBy('dateOfCreation','desc')));
        const querySnapshot = await getDocs(q);
       
        myPostDiv.innerHTML = ""; // Clear previous posts
        
        if (querySnapshot.empty) {
            myPostDiv.innerHTML = `<p class="no-posts-message">You haven't created any posts yet. Start sharing your thoughts!</p>`;
            return
        }
        querySnapshot.forEach((post) => {
            console.log(post.id, post.data());
            
            var likesArr =  post.data().likedBy
            ? post.data().likedBy.includes(loginUserUid) 
            : false;
           likeCount = post.data().likedBy ? post.data().likedBy.length : 0;
           console.log(post.data());
           
            myPostDiv.innerHTML += `
            <div class="post">
            <div class="post-head">
            <div class="post-logo">
            <img src="${userProfilePic}">
            <span class="user-name">You</span>
            </div>
      <div>
        <button class='edit-btn' id='${post.id}'>
          <i class="fa-solid fa-pen"></i>
          </button>
        <button class='update-btn' id='${post.id}' style='display:none'>
          <i class="fa-solid fa-floppy-disk"></i>
        </button>
        <button class='delete-btn' id='${post.id}'>
          <i class="fa-solid fa-trash"></i>
          </button>
      </div>
      </div>
    <input type='text' class='update-inp' value='${post.data().postText}'>
    <p id='p-text'>${post.data().postText}</p>
      <div class='footer'>
                   <div style='display:flex'>
                  <button class='like-button' id='${post.id}' style='display:${likesArr ? "none" : "block"}'> 
                  <i class="fa-regular fa-heart"></i>
                  </button>
                  
                  <button class='unlike-button' id='${post.id}' style='display:${likesArr ? "block" : "none"}'> 
                  <i class="fa-solid fa-heart" style="color: red;"></i>
                  </button>
                   <p style='margin-left:5px;margin-top:3px;font-size:large;font-weight:500 '>${likeCount}</p>
                   </div>
                  <p class='posted-on' >Posted on: ${post.data().dateOfCreation}</p>
                  
  </div>
`;
            
        });

        // Add event listeners after posts are rendered
        document.querySelectorAll(".like-button").forEach((btn) => {
            btn.addEventListener("click", (event) => {
              let postId = event.currentTarget.id;
              likeFun(postId, event.currentTarget);
            });
          });
      
          document.querySelectorAll(".unlike-button").forEach((btn) => {
            btn.addEventListener("click", (event) => {
              let postId = event.currentTarget.id;
              unLikeFun(postId, event.currentTarget);
            });
          });

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
getMyPosts();
console.log(likeCount);

async function likeFun(post_id,like_btn) {
  var post =await getDoc(doc(db, "posts", post_id))
  let likesArr = post.data().likedBy ? [loginUserUid, ...post.data().likedBy] : [loginUserUid];
  
  console.log('hi',typeof(post_id),loginUserUid);
  try {
    await updateDoc(doc(db, "posts", post_id),{
      likedBy:likesArr
    })
  } catch (error) {
    console.log(error);
    
  }
  like_btn.style.display = 'none'
  like_btn.nextElementSibling.style.display = 'block'
  like_btn.nextElementSibling.nextElementSibling.innerHTML = likeCount+1

  
  
}

async function unLikeFun(post_id,like_btn) {
  var post =await getDoc(doc(db, "posts", post_id))
  let likesArr = post.data().likedBy
  
  // console.log(post.data().likedBy);
  likesArr = likesArr.filter(uid => uid !== loginUserUid)
  console.log(likesArr);
  console.log(post.data().likedBy);
  
  console.log('hi',typeof(post_id),loginUserUid);
  try {
    await updateDoc(doc(db, "posts", post_id),{
      likedBy:likesArr
    })
  } catch (error) {
    console.log(error);
    
  }
  like_btn.style.display = 'none'
  like_btn.nextElementSibling.innerHTML = likeCount
  like_btn.previousElementSibling.style.display = 'block'

}
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
    document.querySelector("#add").addEventListener("click", () => {
        let postTxt = document.querySelector("#post-inp").value;
 if (postTxt === "") {
     alert("Post cannot be empty!");
     return;
    }
    
    createPost(postTxt);
     document.querySelector("#post-inp").value = ""
     getMyPosts()
});
// Fetch posts when the page loads
//for signout 
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

//for show and hide post create div
var postIcon =  document.querySelector('.create-post')
document.querySelector("#for-post").addEventListener("click",function(){
   postIcon.style.display = 'block'
})
document.querySelector("#cancel-btn").addEventListener("click",function(){
   postIcon.style.display = 'none'
})
document.querySelector("#delete-btn").addEventListener("click", async function() {
  try {
      const user = auth.currentUser;

      await deleteUser(user);
      console.log("User deleted from authentication.");
      
      
       deleteDoc(doc(db, "users",userDocid[0]));

      const qPosts = query(collection(db, "posts"), where("uid", "==", loginUserUid));
      const querySnapshotPosts = await getDocs(qPosts);

      
      const q = query(collection(db, "posts"), where("uid", "==", loginUserUid)); 
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async(docSnap) => {
        await deleteDoc(doc(db, "posts", docSnap.id)); 
      })
      localStorage.removeItem("loginUserUid");
      window.location.replace("../../index.html");
  } catch (error) {
      console.error("Error deleting user:", error);
  }
});

document
.querySelector(".edit-icon")
.addEventListener("click", function () {
  window.location.replace('../edit-Profile/editProfile.html')
});