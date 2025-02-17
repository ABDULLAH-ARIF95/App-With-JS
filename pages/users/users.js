let loginUserUid = localStorage.getItem('loginUserUid')
import {
    collection,
    getDocs,
    updateDoc,
    orderBy,
    getDoc,
    doc,
    query,
    where
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";
import { auth, db } from "../../firebaseConfig.js";
let userUid = localStorage.getItem('inspectedUserUid')
console.log(userUid);
document.querySelector('#back').addEventListener('click',function(){
    window.location.replace('../dashboard/dashboard.html')
})
let userProfilePic = []
let username = []
let userData = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", userUid));
      const querySnapshot = await getDocs(q);
  
      querySnapshot.forEach(async (doc) => {
        console.log("doc.data() =>", doc.data());
        // var username =  document.querySelector("#profile-pic");
        document.getElementById("username").innerHTML = doc.data().displayName;
        username.push(doc.data().displayName)
        document.getElementById("email").innerHTML = doc.data().email;
        var profilePic = document.querySelector("#profile-pic");
          profilePic.setAttribute("src", doc.data().photoURL);
          console.log(doc.data().photoURL);
        userProfilePic.push(doc.data().photoURL)
          console.log(doc.id);
  
      });
      
      // userDataArr.push(doc.data())
    } catch (error) {
      console.error("Error fetching user data:", error);
  }
  };
  userData()
  var getUserPosts = document.querySelector('.getPosts')
  var likeCount;
  let getPosts = async () => {
      try {
          const q = query(collection(db, "posts"), where("uid", "==", userUid,orderBy('dateOfCreation','desc')));
          const querySnapshot = await getDocs(q);
         
          getUserPosts.innerHTML = ""; // Clear previous posts
          
          if (querySnapshot.empty) {
              getUserPosts.innerHTML = `<p class="no-posts-message">No Posts!</p>`;
              return
          }
          querySnapshot.forEach((post) => {
              console.log(post.id, post.data());
              
              var likesArr =  post.data().likedBy
              ? post.data().likedBy.includes(loginUserUid) 
              : false;
             likeCount = post.data().likedBy ? post.data().likedBy.length : 0;
             console.log(post.data());
             
              getUserPosts.innerHTML += `
              <div class="post">
              <div class="post-head">
              <div class="post-logo">
              <img src="${userProfilePic[0]}">
              <span class="user-name">${username}</span>
              </div>
        </div>
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
                    <p class='posted-on' > ${post.data().dateOfCreation}</p>
                    
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
      } catch (error) {
          console.error("Error fetching posts:", error);
      }
  };
  getPosts();
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
    like_btn.nextElementSibling.nextElementSibling.innerHTML = likesArr.length
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
    like_btn.nextElementSibling.innerHTML = likesArr.length!==0?[likesArr.length]:0
    like_btn.previousElementSibling.style.display = 'block'
  
  }