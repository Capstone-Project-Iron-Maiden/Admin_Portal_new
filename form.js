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

  var name = document.getElementById("eventName").value;
  var subTitle = document.getElementById("subTitle").value;
  var desc = document.getElementById("desc").value;
  var logo = ""
  var date = document.getElementById("date").value;
  var location = document.getElementById("location").value;
  var startTime = document.getElementById("startTime").value;
  var endTime = document.getElementById("endTime").value;

  var speakerName = ""
  var speakerTitle = ""
  var speakerCompany = ""
  var speakerLink = ""
  var keynotespeaker = false;
  var speakerUrl = ""


  // File or Blob named mountains.jpg
  var file = $('#eventLogo').get(0).files[0];

  var storageRef = firebase.storage().ref("events");

  // Create the file metadata
  var metadata = {
    contentType: file.type
  };

  // Upload file and metadata to the object 'images/mountains.jpg'
  var uploadTask = storageRef.child(file.name).put(file, metadata);

  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
    function (snapshot) {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    }, function (error) {

      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/unauthorized':
          console.log("User doesn't have permission to access the object")
          break;

        case 'storage/canceled':
          console.log("User canceled the upload")
          break;

        case 'storage/unknown':
          console.log("Unknown error occurred, inspect error.serverResponse")
          break;
      }
    }, function () {
      // Upload completed successfully, now we can get the download URL
      uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        console.log('File available at', downloadURL);
        logo = downloadURL
      }).then(function () {
        firebase.database().ref('eventTest/' + name).set({
          name: name,
          subTitle: subTitle,
          desc: desc,
          logo: logo,
          date: date,
          location: location,
          startTime: startTime,
          endTime: endTime
        })
      }).then(function () {

        $("div").each(function () {
          if ($(this).attr("class") == "col-md-3 bg-mattBlackLight") {
            $(this).find("input").map(function () {
              if ($(this).attr("id") == "imageUpload") {
                file = $(this).get(0).files[0];
              }
              if ($(this).attr("id") == "keySpeaker") {
                if ($(this).is(":checked")) {
                  keynotespeaker = true;
                }
                else {
                  keynotespeaker = false;
                }
              }
              if ($(this).attr("id") == "name") {
                speakerName = $(this).val();
              }
              if ($(this).attr("id") == "title") {
                speakerTitle = $(this).val();
              }
              if ($(this).attr("id") == "company") {
                speakerCompany = $(this).val();
              }
              if ($(this).attr("id") == "link") {
                speakerLink = $(this).val();
              }
            })


            
            storageRef = firebase.storage().ref("speakers");

            // Create the file metadata
            metadata = {
              contentType: file.type
            };

            // Upload file and metadata to the object 'images/mountains.jpg'
            uploadTask = storageRef.child(file.name).put(file, metadata);

            // Listen for state changes, errors, and completion of the upload.
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
              function (snapshot) {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                  case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                  case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
                }
              }, function (error) {

                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                  case 'storage/unauthorized':
                    console.log("User doesn't have permission to access the object")
                    break;

                  case 'storage/canceled':
                    console.log("User canceled the upload")
                    break;

                  case 'storage/unknown':
                    console.log("Unknown error occurred, inspect error.serverResponse")
                    break;
                }
              }, function () {
                // Upload completed successfully, now we can get the download URL
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                  console.log('File available at', downloadURL);
                  speakerUrl = downloadURL
                }).then(function () {
                  firebase.database().ref('eventTest/' + name + '/speakers').push({
                    name: speakerName,
                    title: speakerTitle,
                    company: speakerCompany,
                    link: speakerLink,
                    keynotespeaker: keynotespeaker,
                    picture: speakerUrl
                  });
                })

              })
          }
        })

      })
        .then(function () {
          alert("Event submit Successful");
        });
    });


}