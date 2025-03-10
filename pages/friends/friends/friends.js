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
  let friendsListDiv = document.querySelector('.friends-list')
  let loggedInUserFriendsIds = []
  let userFriendUid = []
  let userDataArr = [];
  let userDataId = '';
let userFriendsData = async () => {
friendsListDiv.innerHTML = '';
loggedInUserFriendsIds = [];
userFriendUid = [];

  try {
    const q = query(collection(db, "users"), where("uid", "==", loginUserUid));
    const querySnapshot = await getDocs(q);
    let tempArr = [];
    querySnapshot.forEach(async (doc) => {
        try {
        userDataId = doc.id
        console.log(doc.data().friends);
        console.log(doc.data());
        
       
        if (!doc.data().friends || doc.data().friends.length === 0) {
            console.log("No friends found");
            friendsListDiv.innerHTML = "<p>No friends found</p>";
            return; // Exit function early
          }
console.log('working');
try {
    const qFriends = query(collection(db, "users"), where("uid", "in",doc.data().friends));
    const querySnapshotFriends = await getDocs(qFriends);
    
    
    console.log('working',querySnapshotFriends.docs.map(fr => {
        console.log(fr.data());
        
    }));
    querySnapshotFriends.forEach((friends) => {
                console.log('working');
                console.log(friends.data());
                loggedInUserFriendsIds.push(
                    friends.data().uid)
                console.log(loggedInUserFriendsIds);
                userFriendUid.push({
                    id :friends.id,
                    friendsArr:friends.data().friends
                })
                console.log('working');
                console.log('working');
                friendsListDiv.innerHTML += `
                <div class="friend-card">
                <img id = "${friends.data().uid}" src="${friends.data().photoURL}" alt="Profile Picture" class="friend-avatar">
                <div class="friend-info">
                <span class="friend-name">${friends.data().displayName}</span>
                </div>
                <div class="friend-actions">
                <button class="message-btn" onclick="messageFriend('John Doe')">
                <i class="fa-solid fa-message"></i> Message
                </button>
                <button class="delete-btn ${friends.data().uid}" id=${friends.id} ">
                <i class="fa-solid fa-user-minus" ></i> Delete Friend
                </button>
                </div>
                </div>
                `
            })
            console.log('working');
            document.querySelectorAll(".friend-avatar").forEach((btn) => {
                btn.addEventListener("click", (event) => {
                    inspectedUser(event.currentTarget.id);
                    
                });
                
                console.log('working');
            })
            document.querySelectorAll(".delete-btn").forEach((btn) => {
                btn.addEventListener("click", (event) => {
                    deleteFriend(event.currentTarget.id,event.currentTarget);
                    
                });
                
            })
            
} catch (error) {
    console.log(error);
    
}

            console.log('working');
            
        } catch (error) {
            console.log(error);
            
        }
        console.log("User Data:", doc.data());
        let user = doc.data();
        tempArr.push(user);
        
        console.log("doc.data() =>", doc.data());
        //   document.getElementById("username").innerText = doc.data().displayName;
        //   var profilePic = document.querySelector("#profile-pic");
        //   if (doc.data().photoURL) {
            //     profilePic.setAttribute("src", doc.data().photoURL);
            //   }
        });
        userDataArr = tempArr;
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
};
// userFriendsData();
function inspectedUser(id){
    if (id===loginUserUid) {
        window.location.replace('../../myPosts/myPosts.html')
        return
        
    }
    localStorage.setItem('inspectedUserUid',id)
    window.location.replace('../../users/users.html')
}
// let friendsData = async () => {
    //   try {
        //     await userData()
        //     // const q = query(collection(db, "users"), where("uid", "==", loginUserUid));
        //     // const querySnapshot = await getDocs(q);
        //     // let tempArr = [];
//     // querySnapshot.docs.map(async (doc) => {
    //     //   console.log("User Data:", doc.data());
    //     //   let user = doc.data();
    //     //   tempArr.push(user);
    
//     //   console.log("doc.data() =>", doc.data());
//     //   document.getElementById("username").innerText = doc.data().displayName;
//     //   var profilePic = document.querySelector("#profile-pic");
//     //   if (doc.data().photoURL) {
    //     //     profilePic.setAttribute("src", doc.data().photoURL);
    //     //   }
    //     // });
//     // userDataArr = tempArr;
// console.log(userDataArr[0].friends);

// } catch (error) {
    //     console.error("Error fetching user data:", error);
    //   }
// };
// friendsData()
// query(collection(db, "users"), where('uid', '==', requests.data().from))
userFriendsData()
// userFriendUid.push(friends.data().friends)

async function deleteFriend(id,uid){
console.log(uid.classList[1]);

   const myFriends = loggedInUserFriendsIds.filter(friend => friend !== uid.classList[1])
    const clickedUser = userFriendUid.find(user => user.id === id);
    const userFriends = clickedUser.friendsArr.filter(friend => friend !== loginUserUid)
    console.log(myFriends);
    // const q = query(collection(db, "users"),where('uid','==',myFriends));
    // const querySnapshot = await getDocs(q);;
    
    console.log(userFriends);
    
    console.log(clickedUser);
    updateDoc(doc(db, 'users', userDataId), {
        friends: myFriends
    });
    
    updateDoc(doc(db, 'users', id), {
        friends: userFriends
    }).then(async ()=>{
        messageModal("Friend Removed Successfuly!")
        loggedInUserFriendsIds = [];
        userFriendUid = [];
        await userFriendsData();
    })
}

document.querySelector('.back-button').addEventListener('click',function() {
    window.location.replace('../../dashboard/dashboard.html')
})