const loginUserUid = localStorage.getItem("loginUserUid");
if (!loginUserUid) {
  window.location.replace("../../index.html");
}
import { auth, db } from "../../firebaseConfig.js";
import {
  addDoc,
  collection,
  query,
  where,
  updateDoc,
  getDoc,
  doc,
  orderBy,
  getDocs,
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";

var userDataArr = [];
let userData = async () => {
  try {
    const q = query(collection(db, "users"), where("uid", "==", loginUserUid));
    const querySnapshot = await getDocs(q);
    let tempArr = [];
    querySnapshot.docs.map(async (doc) => {
      console.log("User Data:", doc.data());
      let user = doc.data();
      tempArr.push(user);

      console.log("doc.data() =>", doc.data());
      document.getElementById("username").innerText = doc.data().displayName;
      var profilePic = document.querySelector("#profile-pic");
      if (doc.data().photoURL) {
        profilePic.setAttribute("src", doc.data().photoURL);
      }
    });
    userDataArr = tempArr;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};
userData();

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
var date = new Date();
var currentDate = `${date.getDate()}/${
  date.getMonth() + 1
}/${date.getFullYear()}`;
console.log(currentDate);

// Create a new post
async function createPost(text) {
  try {
    console.log("Firestore DB:", db);

    const docRef = await addDoc(collection(db, "posts"), {
      postText: text,
      uid: loginUserUid,
      dateOfCreation: currentDate,
    });
    console.log("Document written with ID:", docRef.id);
  } catch (error) {
    console.error("Error creating post:", error);
  }
}
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
  like_btn.nextElementSibling.nextElementSibling.style.display = 'block'
}
likeFun()
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
  like_btn.nextElementSibling.style.display = 'none'
  like_btn.previousElementSibling.style.display = 'block'

}

//get all posts
let allPostDiv = document.querySelector(".all-posts");

let getAllPosts = async () => {
  allPostDiv.innerHTML = ""; // Clear existing posts

  try {
    const postsQuery = query(collection(db, "posts"), orderBy('dateOfCreation', 'desc'));
    const posts = await getDocs(postsQuery);

    for (const post of posts.docs) {
      const userDataQuery = query(
        collection(db, "users"),
        where("uid", "==", post.data().uid)
      );
      const querySnapshot = await getDocs(userDataQuery);

      querySnapshot.forEach((doc) => {
        console.log(doc.id, doc.data());
        var pfURL = doc.data().photoURL || 
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

          if (post.data().likedBy ) { 
          var likesArr = post.data().likedBy;
          var likeCount = post.data().likedBy ? post.data().likedBy.length : 0;
          likesArr.filter(uid=>uid===loginUserUid)
          console.log(likesArr.length);
          
          if (likesArr.length>0) {
            try {

              allPostDiv.innerHTML += `
                <div class="post">
                  <div class="logo">
                    <img src="${pfURL}">
                      <div>
                <strong>${doc.data().displayName}</strong>
                 <p class='email-render'>${doc.data().email}</p>
                 </div>
                  </div>
                  <p>${post.data().postText}</p>
                   <div class='footer'>
                   <div style='display:flex'>
                  <button class='like-button' id='${post.id}' style='display:${likesArr ? "none" : "block"}'> 
                  <i class="fa-regular fa-heart"></i>
                  </button>
    
                  <button class='unlike-button' id='${post.id}' style='display:${likesArr ? "block" : "none"}'> 
                  <i class="fa-solid fa-heart" style="color: red;"></i>
                  </button>
                   <p style='margin-left:5px;margin-top:3px;font-size:large;font-weight:500'>${likeCount}</p>
                   </div>
                  <p class='posted-on' >Posted on: ${post.data().dateOfCreation}</p>
                  </div>
                </div>
              `;
  
            } catch (error) {
              console.log(error);
            }
          } else {
            allPostDiv.innerHTML += `
              <div class="post">
                <div class="logo">
                  <img src="${pfURL}">
                  <div>
                  <strong>${doc.data().displayName}</strong>
                   <p class= 'email-render'>${doc.data().email}</p>
                   </div>
                </div>
                <p>${post.data().postText}</p>
                <div class='footer'>
                <div style='display:flex'>
                <button class='like-button' id='${post.id}'> 
                <i class="fa-regular fa-heart"></i>
                </button>
                <button class='unlike-button' id='${post.id}' style='display:none'> 
                <div>
                <i class="fa-solid fa-heart" style="color: red;"></i>
                </button>
                <p style='margin-left:5px;margin-top:3px;font-size:large;font-weight:500 ;display:none'>${likeCount+1}</p>
                </div>
                <p class='posted-on'>Posted on: ${post.data().dateOfCreation}</p>
                </div>
              </div>
            `;
          }
        }
        else {
          allPostDiv.innerHTML += `
            <div class="post">
              <div class="logo">
                <img src="${pfURL}">
                <div>
                <strong>${doc.data().displayName}</strong>
                 <p class= 'email-render'>${doc.data().email}</p>
                 </div>
              </div>
              <p>${post.data().postText}</p>
              <div class='footer'>
              <div style='display:flex'>
              <button class='like-button' id='${post.id}'> 
              <i class="fa-regular fa-heart"></i>
              </button>
              <button class='unlike-button' id='${post.id}' style='display:none'> 
              <div>
              <i class="fa-solid fa-heart" style="color: red;"></i>
              </button>
               <p style='margin-left:5px;margin-top:3px;font-size:large;font-weight:500 ;display:none'>${likeCount+1}</p>
              </div>
              <p class='posted-on'>Posted on: ${post.data().dateOfCreation}</p>
              </div>
            </div>
          `;
        }
      });
      }

      

    // Attach event listeners after adding posts to the DOM
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

  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};

getAllPosts();
var username = localStorage.getItem("username");
document.querySelector("#add").addEventListener("click", () => {
  let postTxt = document.querySelector("#post-inp").value;
  console.log(userDataArr);
  
  if (postTxt === "") {
    alert("Post cannot be empty!");
    return;
  }
  createPost(postTxt);
  getAllPosts()
  document.querySelector("#post-inp").value = "";
});

function myProfile() {
  window.location.replace("../myPosts/myPosts.html");
}
document
  .querySelector("#my-profile-btn")
  .addEventListener("click", function () {
    myProfile();
  });
document
  .querySelector(".goto-profile")
  .addEventListener("click", function () {
    myProfile();
  });
var postIcon = document.querySelector(".create-post");
document.querySelector("#for-post").addEventListener("click", function () {
  postIcon.style.display = "block";
});
document.querySelector("#cancel-btn").addEventListener("click", function () {
  postIcon.style.display = "none";
});
