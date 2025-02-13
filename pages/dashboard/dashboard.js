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

//get all posts
let allPostDiv = document.querySelector(".all-posts");
let getAllPosts = async () => {
  allPostDiv.innerHTML = ""; // Clear existing posts

  try {
    const posts = await getDocs(collection(db, "posts"),orderBy('dateOfCreation','desc'));

    for (const post of posts.docs) {
      const userDataQuery = query(
        collection(db, "users"),
        where("uid", "==", post.data().uid)
      );
      const querySnapshot = await getDocs(userDataQuery);
      console.log("query", querySnapshot);

      querySnapshot.forEach((doc) => {
        // userDataArr1.push(doc.data())
        console.log(doc.id, doc.data());
        var pfURL;
        if (doc.data().photoURL) {
          pfURL = doc.data().photoURL;
        } else {
          pfURL =
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
        }
        allPostDiv.innerHTML += `
                  <div class="post">
                    <div class="logo">
                    <img src=${pfURL}>
                    <strong>${doc.data().displayName}</strong>
                    </div>
                      <p>${post.data().postText}</p>
                      <p>Created at: ${post.data().dateOfCreation}</p>
                  </div>
              `;
      });
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};

getAllPosts();
var username = localStorage.getItem("username");
document.querySelector("#add").addEventListener("click", () => {
  let postTxt = document.querySelector("#post-inp").value;
  console.log(userDataArr);
  let pfURL;
  let displayName;
  for (let i = 0; i < userDataArr.length; i++) {
    console.log(userDataArr[i].displayName);

    displayName = userDataArr[i].displayName
    if (userDataArr[i].photoURL) {
      pfURL = userDataArr[i].photoURL;
    } else {
      pfURL =
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
    }
  }
  allPostDiv.innerHTML += `<div class="post">
     <div class="logo">
     <img src=${pfURL}>
<strong>${displayName}</strong>
    </div>
     <p>${postTxt}</p>
     <p >Created at: ${currentDate}</p>
     </div>`;

  if (postTxt === "") {
    alert("Post cannot be empty!");
    return;
  }

  createPost(postTxt);
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
var postIcon = document.querySelector(".create-post");
document.querySelector("#for-post").addEventListener("click", function () {
  postIcon.style.display = "block";
});
document.querySelector("#cancel-btn").addEventListener("click", function () {
  postIcon.style.display = "none";
});
