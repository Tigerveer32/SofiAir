// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signOut}  from "firebase/auth";
import { getFirestore, collection, addDoc,doc,setDoc,getDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyALxLTGOhFkN2AIJeR2YvYgkVdxlNrQr7E",
  authDomain: "sofiair-d8ccc.firebaseapp.com",
  projectId: "sofiair-d8ccc",
  storageBucket: "sofiair-d8ccc.appspot.com",
  messagingSenderId: "261233759737",
  appId: "1:261233759737:web:1af03b1da6942551555928"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

console.log(app.name)
const LogOut = () => {
  const auth = getAuth(app);
  signOut(auth).then(() => {
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
}




export const handleTambahProduk = async (produkData) => {
    try {
      const docRef = await setDoc(doc(db, 'listProduct', produkData.productId ), produkData);
      console.log('Produk berhasil ditambahkan dengan ID: ', produkData.productId);
      alert('Produk berhasil ditambahkan!');
    } catch (error) {
      console.error('Error menambahkan produk: ', error);
    }
  };

  



const auth = getAuth(app);

const db = getFirestore();

export { auth, db, LogOut };