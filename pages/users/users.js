let loginUserUid = localStorage.getItem('loginUserUid')
if (!loginUserUid) {
  window.location.replace("../../index.html");
}
import {
    collection,
    getDocs,
    updateDoc,
    orderBy,
    onSnapshot,
    getDoc,
    addDoc,
    deleteDoc,
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
var freindRequestBtn = document.querySelector('#friend-request-btn')
var cancelRequestBtn = document.querySelector('.cancel-request')
var confirmRequestBtn = document.querySelector('.accept-request')
var rejectRequestBtn = document.querySelector('.reject-request')

var freindsBtn = document.querySelector('.friends-btn')
freindsBtn.style.display = 'none'
let username = []
var friendsNum = document.querySelector('#friends-count')
let userData = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", userUid));
      const querySnapshot = await getDocs(q);

      let q2 = query(collection(db, "friend_requests"),where('from','==',userUid),where('to','==',loginUserUid))
      let  querySnapshot2 = await getDocs(q2)
      querySnapshot2.forEach(async (requestDoc) => {
     console.log(requestDoc.data());
     console.log(requestDoc.data().from===userUid);
     if (requestDoc.data().from===userUid) {
      confirmRequestBtn.style.display = 'block'
      rejectRequestBtn.style.display = 'block'
      freindRequestBtn.style.display = 'none'
     }
      })
      querySnapshot.forEach(async (doc) => {
        console.log(doc.data().friends===loginUserUid);
        
        if (doc.data().friends===loginUserUid){
          // friendCount = doc.data().friends.length
          friendsNum.innerHTML = doc.data().friends.length
          freindRequestBtn.style.display = 'none'
          freindsBtn.style.display = 'flex'
          console.log('friends',doc.data().friends.length);
        }
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
  var postCount =  0
  var postsNum = document.querySelector('#post-count')
  var likeCount;
  //working here
  async function sendFriendRequest(userId) {
    console.log("working");
    
    try {
      console.log("Firestore DB:", db);
      
      const docRef = await addDoc(collection(db, "friend_requests"), {
        from:loginUserUid,
           to:userId,
          });
          console.log("Document written with ID:", docRef.id);
          
          // messageModal('Friend Request Sent')
          freindRequestBtn.style.display = "none" 
          freindRequestBtn.nextElementSibling.style.display = "block" 
          
        } catch (error) {
          console.error("Error creating post:", error);
        }
        
      }
      async function cancelRequest(userId) {
        console.log("working");
        let q = query(collection(db, "friend_requests"),where('from','==',loginUserUid),where('to','==',userId))
     let  querySnapshot = await getDocs(q)
     querySnapshot.forEach(async (requestDoc) => {
      await deleteDoc(doc(db, "friend_requests", requestDoc.id));
      // messageModal('Cancelled Request!')
      cancelRequestBtn.style.display = "none" 
      // console.log(event.previousElementSibling);
      
      cancelRequestBtn.previousElementSibling.style.display = "block" 
      // console.log("Friend request deleted:", requestDoc.id);
    });
  }
  let loginUserFriendsArr = [];
let requestedUserFriendsArr = [];
  async function confirmRequest(userUid) {
    try {
      // 🔹 Query the logged-in user's document
      let queryLoginUser = query(collection(db, "users"), where("uid", "==", loginUserUid));
      const snapshot = await getDocs(queryLoginUser);
      
          if (!snapshot.empty) {
            const userDoc = snapshot.docs[0]; // Get the document snapshot
              const userDocRef = userDoc.ref; // Get the document reference
              const userData = userDoc.data(); // Get user data
              
              // 🔹 Update the logged-in user's friends array
              loginUserFriendsArr = userData.friends
                  ? [userUid, ...userData.friends]
                  : [userUid];
  
              await updateDoc(userDocRef, {
                  friends: loginUserFriendsArr
                });
              } else {
                console.error("Logged-in user document not found.");
                return;
          }
  
          // 🔹 Query the requested user's document
          let queryRequestedUser = query(collection(db, "users"), where("uid", "==", userUid));
          const inSnapshot = await getDocs(queryRequestedUser);
  
          if (!inSnapshot.empty) {
              const requestedUserDoc = inSnapshot.docs[0]; // Get document snapshot
              const requestedUserDocRef = requestedUserDoc.ref; // Get reference
              const requestedUserData = requestedUserDoc.data(); // Get user data
  
              // 🔹 Update the requested user's friends array
              requestedUserFriendsArr = requestedUserData.friends
                  ? [loginUserUid, ...requestedUserData.friends]
                  : [loginUserUid];
                  
              await updateDoc(requestedUserDocRef, {
                friends: requestedUserFriendsArr
              });
            } else {
              console.error("Requested user document not found.");
              return;
            }
            
            let q = query(collection(db, "friend_requests"),where('from','==',userUid),where('to','==',loginUserUid));
            onSnapshot(q, (querySnapshot) => {
              querySnapshot.forEach(async (requestDoc) => {
                  await deleteDoc(doc(db, "friend_requests", requestDoc.id));
                });
              })
              
              
              
              confirmRequestBtn.style.display = 'none'
              rejectRequestBtn.style.display = 'none'
              freindsBtn.style.display = 'block'
              // messageModal("Request Accepted!");
              
      } catch (error) {
        console.error("Error in confirmRequest:", error);
      }
    }
    
    async function deleteRequest(userUid) {
      try {
        let q = query(collection(db, "friend_requests"),where('from','==',userUid),where('to','==',loginUserUid));
        onSnapshot(q, (querySnapshot) => {
          querySnapshot.forEach(async (requestDoc) => {
            await deleteDoc(doc(db, "friend_requests", requestDoc.id));
          });
        })
        confirmRequestBtn.style.display = 'none'
        rejectRequestBtn.style.display = 'none'
        freindRequestBtn.style.display = 'block'
      } catch (error) {
        console.log(error);
        
      }
     
  }
  
  document.querySelector(".send-request").addEventListener("click",function () {
        sendFriendRequest(userUid);
        
    });
    document.querySelector(".accept-request").addEventListener("click",function () {
      confirmRequest(userUid);
      
    });
  document.querySelector(".reject-request").addEventListener("click",function () {
        deleteRequest(userUid);
        
      });
      document.querySelector(".cancel-request").addEventListener("click",function () {
        cancelRequest(userUid);
        
      });
      //working here
      
console.log(userProfilePic[0]);

let getPosts = async () => {
  
  try {
    await userData()
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
              console.log(userProfilePic[0],username);
              
              postCount++
              getUserPosts.innerHTML += `
              <div class="post">
              <div class="post-head">
              <div class="post-logo">
              <img src="${userProfilePic[0]}">
              <span class="user-name">${username[0]}</span>
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
                     <p style='margin-left:2px;margin-top:14px;font-size:large;font-weight:500 '>${likeCount}</p>
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
            postsNum.innerHTML= postCount 
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