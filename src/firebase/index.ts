
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export  const handleGoogleLogin = async () =>{
    const provider = new GoogleAuthProvider();
    const auth = getAuth(app);
    return await signInWithPopup(auth,provider)
  }

  //congif firebase
  const firebaseConfig = {
    apiKey: "AIzaSyAFNkFtJ91GJKq2cLFtTdGuC9hPu4Bra1Y",
    authDomain: "blade-firebase.firebaseapp.com",
    projectId: "blade-firebase",
    storageBucket: "blade-firebase.appspot.com",
    messagingSenderId: "633194441848",
    appId: "1:633194441848:web:1feaff23fd3776966d118d",
    measurementId: "G-WT770FKWJ0"
  };

  export default {
    handleGoogleLogin
  }
  const app = initializeApp(firebaseConfig);
  
