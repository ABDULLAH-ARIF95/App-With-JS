const loginUserUid = localStorage.getItem("loginUserUid");
if (!loginUserUid) {
  window.location.replace("../../index.html");
}
import { auth, db } from "../../../firebaseConfig.js";
import {
  addDoc,
  collection,
  query,
  where,
  deleteDoc,
  updateDoc,
  onSnapshot,
  getDoc,
  doc,
  orderBy,
  getDocs,
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";
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
var usersDiv = document.querySelector('.users-list')
var usersArr = []
async function fetchUsers(){
    usersDiv.innerHTML = ''
    try {
        
        let isRequested  = false;
        var requestArr = [] ;
        const queryRequest = query(collection(db, "friend_requests"),where('from' ,'==',loginUserUid))
        const check = await getDocs(queryRequest);
        check.forEach(async requests => {
            if ( requests.data().to ) { 
                requestArr.push(requests.data().to);
            }
            
            console.log(requests.data());
            // isRequested.push()
        })
        console.log(isRequested);
        
        const queryUsers = query(collection(db, "users"),where('uid' ,'!=',loginUserUid))
        const querySnapshot = await getDocs(queryUsers);
        querySnapshot.forEach(async user => {
            console.log(user.id, user.data());
            usersArr.push(user.data())
            let isFriend  = false ;
           
            
            if (user.data().friends) {
                var userFriendsArr = user.data().friends
            
            isFriend = userFriendsArr.includes(loginUserUid)
                
            }
       
        
        if (requestArr.includes(user.data().uid) ) {
            isRequested = true
            
        }
        else{
            isRequested = false
        }
        console.log(isFriend);
        
        try {
            usersDiv.innerHTML += `
            <div class="user-card"  >
            <div class ="image " id="${user.data().uid}">
            <img src="${user.data().photoURL}" alt="Profile" >
            </div>
            <div class="info">
            <span>${user.data().displayName}</span>  
            </div>
            
            <button class="send-request"  id="${user.data().uid}"  style='display:${isFriend ? "none" : (isRequested ? "none" : "block")}'>  <i class="fa fa-user-plus"></i> Send Request</button>
            <button class="cancel-request" id="${user.data().uid}" style='display:${isFriend ? "none" : (isRequested ? "block" : "none")}'> <i class="fa fa-user-times"></i> Cancel Request</button>
             <button class="friends-btn" style='display:${isFriend? "block" : "none"}'><i class="fa fa-user-friends" ></i> Friends</button>
            </div>
            `
            document.querySelectorAll(".image").forEach((btn) => {
                btn.addEventListener("click", (event) => {
                    inspectedUser(event.currentTarget.id);
                    
                });
                
            })
         
            document.querySelectorAll(".send-request").forEach((btn) => {
                btn.addEventListener("click", (event) => {
                    sendFriendRequest(event.currentTarget,event.currentTarget.id);
                    
                });
                
            })
            document.querySelectorAll(".cancel-request").forEach((btn) => {
                btn.addEventListener("click", (event) => {
                    cancelRequest(event.currentTarget,event.currentTarget.id);
                    
                });
                
            })
        } catch (error) {
            console.log(error);
            
        }
    })
} catch (error) {
    console.log(error);
    
}
}

fetchUsers()

function inspectedUser(id){
    if (id===loginUserUid) {
        window.location.replace('../../myPosts/myPosts.html')
        return
        
    }
    localStorage.setItem('inspectedUserUid',id)
    window.location.replace('../../users/users.html')
}

function filterUsers() {
    usersDiv.innerHTML = ''
    // console.log(usersArr);
    
    const query = document.getElementById("search-user").value.toLowerCase();
    
    usersArr.forEach(user => {
        if (user.displayName.toLowerCase().includes(query)) {
            console.log("Matched User:", user.displayName); // Logs the entire user object
            usersDiv.innerHTML += `
            <div class="user-card" >
            <div class ="image " id="${user.uid}">
            <img src="${user.photoURL}" alt="Profile" >
            </div>
             <div class="info">
             <span>${user.displayName}</span>  
             </div>
             <button class="send-request" >Send Friend Request</button>
             <button class="cancel-request" >Cancel Friend Request</button>
               </div>
               `
            return
        }
         // Logs the entire user object
         
        });
    if (query === '') {
        fetchUsers()
    }
}
// console.log(filterUsers());
document.getElementById("search-user").addEventListener("input", function () {
   filterUsers()
  });

  async function sendFriendRequest(event,userId) {
     try {
         console.log("Firestore DB:", db);
    
         const docRef = await addDoc(collection(db, "friend_requests"), {
         from:loginUserUid,
         to:userId,
        });
        console.log("Document written with ID:", docRef.id);
        
        messageModal('Friend Request Sent')
        event.style.display = "none" 
        event.nextElementSibling.style.display = "block" 
        
      } catch (error) {
        console.error("Error creating post:", error);
      }
    
    }
    async function cancelRequest(event,userId) {
   let q = query(collection(db, "friend_requests"),where('from','==',loginUserUid),where('to','==',userId))
   let  querySnapshot = await getDocs(q)
   querySnapshot.forEach(async (requestDoc) => {
    await deleteDoc(doc(db, "friend_requests", requestDoc.id));
    messageModal('Cancelled Request!')
    event.style.display = "none" 
    console.log(event.previousElementSibling);
    
    event.previousElementSibling.style.display = "block" 
    console.log("Friend request deleted:", requestDoc.id);
});
}
var freindRequestsDiv = document.querySelector('.friend-requests')
async function getFriendRequests() {
    freindRequestsDiv.innerHTML = ''
    const queryfriendRequest = query(collection(db, "friend_requests"),where('to' ,'==',loginUserUid))
    const check = await getDocs(queryfriendRequest);
    check.forEach(async requests => {
        console.log(requests.data());
        const queryUsers = query(collection(db, "users"),where('uid' ,'==',requests.data().from))
    const querySnapshot = await getDocs(queryUsers);
    querySnapshot.forEach(async user => {

        freindRequestsDiv.innerHTML += `
         <div class="request">
         <div class="image" id="${user.data().uid}">
         <img src="${user.data().photoURL}" alt="Profile">
         </div>
         <div class="info">
                        <span>${user.data().displayName}</span>
                    </div>
                    
                    <button class="confirm" id="${user.data().uid}" >Confirm</button>
                    <button class="delete" id="${user.data().uid}">Delete</button>
                   
                </div>
            </div>
        `
        document.querySelectorAll(".image").forEach((btn) => {
            btn.addEventListener("click", (event) => {
                inspectedUser(event.currentTarget.id);
                
            });
            
        })
        document.querySelectorAll(".confirm").forEach((btn) => {
            btn.addEventListener("click", (event) => {
                confirmRequest(event.currentTarget.id);
                
            });
            
        })
        document.querySelectorAll(".delete").forEach((btn) => {
            btn.addEventListener("click", (event) => {
                deleteRequest(event.currentTarget.id);
                
            });
            
        })
    })
        
    })
    
}
getFriendRequests()
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
        

        

        messageModal("Request Accepted!");

    } catch (error) {
        console.error("Error in confirmRequest:", error);
    }
}

async function deleteRequest(userUid) {
    let q = query(collection(db, "friend_requests"),where('from','==',userUid),where('to','==',loginUserUid));
    onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach(async (requestDoc) => {
            await deleteDoc(doc(db, "friend_requests", requestDoc.id));
        });
    })
}
