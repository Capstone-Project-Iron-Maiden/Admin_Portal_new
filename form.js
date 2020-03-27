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


function logOut() {
  firebase.auth().signOut();
  alert("Logged out");
  location.replace("login.html")
}


function addEvent() {

  //event
  var eventName = document.getElementById("eventName").value;
  var subTitle = document.getElementById("subTitle").value;
  var desc = document.getElementById("desc").value;
  var logo = ""
  var date = document.getElementById("date").value;
  var location = document.getElementById("location").value;
  var startTime = document.getElementById("startTime").value;
  var endTime = document.getElementById("endTime").value;

  var file = $('#eventLogo').get(0).files[0];

  uploadImageAsPromise(file, 'events').then(function (url) {
    firebase.database().ref('eventTest/' + eventName).set({
      name: eventName,
      subTitle: subTitle,
      desc: desc,
      logo: url,
      date: date,
      location: location,
      startTime: startTime,
      endTime: endTime
    })
  }).then(() => {
    //speakers
    $("div").each(function () {

      if ($(this).attr("class") == "col-md-3 bg-mattBlackLight imgUp") {
        var speakerName = ""
        var speakerTitle = ""
        var speakerCompany = ""
        var speakerLink = ""
        var keynotespeaker = false;
        var speakerPicture = ""

        var file = ""

        $(this).find("input").map(function () {
          if ($(this).attr("name") == "speakerImage") {
            file = $(this).get(0).files[0];
          }
          if ($(this).attr("name") == "keySpeaker") {
            if ($(this).is(":checked")) {
              keynotespeaker = true;
            }
            else {
              keynotespeaker = false;
            }
          }
          if ($(this).attr("name") == "speaker") {
            speakerName = $(this).val();
          }
          if ($(this).attr("name") == "title") {
            speakerTitle = $(this).val();
          }
          if ($(this).attr("name") == "company") {
            speakerCompany = $(this).val();
          }
          if ($(this).attr("name") == "link") {
            speakerLink = $(this).val();
          }
        })

        uploadImageAsPromise(file, 'speakers').then((url) => {
          firebase.database().ref('eventTest/' + eventName + '/speakers').push({
            name: speakerName,
            title: speakerTitle,
            company: speakerCompany,
            link: speakerLink,
            keynotespeaker: keynotespeaker,
            picture: url
          });
        })
      }
    })
  })



}

function uploadImageAsPromise(imageFile, category) {
  return new Promise(function (resolve, reject) {
    var storageRef = firebase.storage().ref(category);

    const name = imageFile.name

    //file medata
    const metadata = {
      contentType: imageFile.type
    }
    //Upload file
    var task = storageRef.child(name).put(imageFile, metadata);

    //Update progress bar
    task.on('state_changed',
      function progress(snapshot) {
        var percentage = snapshot.bytesTransferred / snapshot.totalBytes * 100;
      },
      function error(err) {
        reject(err)

      },
      function complete() {
        task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          console.log('File available at', downloadURL);
          resolve(downloadURL)
        })
      }
    );
  });
}