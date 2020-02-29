// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAnAdPFQw5QzBocD0gigvSiiV_pej_EajQ",
    authDomain: "testing-3052d.firebaseapp.com",
    databaseURL: "https://testing-3052d.firebaseio.com",
    projectId: "testing-3052d",
    storageBucket: "testing-3052d.appspot.com",
    messagingSenderId: "783312933585",
    appId: "1:783312933585:web:0220a0857327263aadebf0",
    measurementId: "G-QTFCMZFR4M"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  console.log(firebase);


  function logOut(){
	  firebase.auth().signOut();
    alert("Logged out");
    location.replace("login.html")
  }