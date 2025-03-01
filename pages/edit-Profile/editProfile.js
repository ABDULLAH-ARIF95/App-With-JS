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
import {  db } from "../../firebaseConfig.js";
// Redirect if user is not logged in
var loginUserUid = localStorage.getItem("loginUserUid");
if (!loginUserUid) {
    window.location.replace("../../index.html");
}
var profilePic = document.querySelector("#profileImage");
var username = document.querySelector("#username");
let userData = async () => {
  try {
    const q = query(collection(db, "users"), where("uid", "==", loginUserUid));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (doc) => {
      console.log("doc.data() =>", doc.data());
      username.value = doc.data().displayName;
      
        profilePic.setAttribute("src", doc.data().photoURL);
        console.log(doc.data().photoURL);
      

    })
    
    // userDataArr.push(doc.data())
  } catch (error) {
    console.error("Error fetching user data:", error);
}
};
userData()


 document.querySelector('#submit').addEventListener('click',function(event){

// function formData(event){
    event.preventDefault()
    console.log(username.value);
    
     let file = document.getElementById("fileInput").files[0];
     let formData = new FormData();
     formData.append("file", file);
     formData.append("upload_preset", "profileURL");
     
 
     fetch("https://api.cloudinary.com/v1_1/dxfcwpgqp/image/upload", {
       method: "POST",
       body: formData
     })
     .then(response => response.json())
     .then(async data => {
         profilePic.setAttribute('src', data.secure_url);
         console.log("Image URL:", data.secure_url); // Save this URL in your database
         
         try { // Reference to users collection
            console.log('hi');
            const usersRef = collection(db, "users"); // Get reference to the "users" collection
            const q = query(usersRef, where("uid", "==", loginUserUid));
            // Query by UID
            const querySnapshot = await getDocs(q);
    
           console.log('hi');
           
                // ✅ If user exists, update the first matching document
                querySnapshot.forEach(async (docSnap) => {
                    // const userRef = doc(db, "users", docSnap.id);
                    // await updateDoc(userRef, {
                    //     displayName: username,
                    //     ...(imageUrl && { photoURL: imageUrl }) // Only update photoURL if provided
                    // });
                    if (data.secure_url) {
                        console.log("yes")
                        
                        await updateDoc(doc(db, "users",docSnap.id), {
                            displayName: username.value,
                            photoURL: data.secure_url,
                        });
                        console.log("yes")
                        window.location.replace('../myPosts/myPosts.html')
                    } else {
                        await updateDoc(doc(db, "users", docSnap.id), {
                            displayName: username.value,
                        });
                        window.location.replace('../myPosts/myPosts.html')
                    }
                })
         } catch (error) {
             console.error("Error updating Firestore:", error);
         }
     })
     .catch(error => console.error("Error uploading:", error));
     
    })

   