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
    console.log("event in")
  }).then(() => {

    //schedule
    var registration = document.getElementById("registration").value;
    var tradeshow = document.getElementById("tradeshow").value;
    firebase.database().ref('eventTest/' + eventName + '/schedulescreen/tabbar').set({
      link1: registration,
      link2: tradeshow
    })

    var pdfile = $('#file-upload').get(0).files[0];
    uploadImageAsPromise(pdfile, 'floorplan').then((url) => {
      firebase.database().ref('eventTest/' + eventName + '/schedulescreen/floorplan').set({
        floorplan: url
      })
    })

    var rows = document.getElementsByTagName("tbody")[0].rows;
    for (var i = 0; i < rows.length; i++) {
      var scheduleName = rows[i].getElementsByTagName("td")[0].innerHTML;
      var start = rows[i].getElementsByTagName("td")[1].innerHTML;
      var end = rows[i].getElementsByTagName("td")[2].innerHTML;
      var speakerdesc = rows[i].getElementsByTagName("td")[3].innerHTML;
      var room = rows[i].getElementsByTagName("td")[4].innerHTML;
      var learnmore = rows[i].getElementsByTagName("td")[5].innerHTML;
      var networking = rows[i].getElementsByTagName("td")[6].innerHTML;
      if (networking == "y") {
        networking = true
      }
      else {
        networking = false
      }

      firebase.database().ref('eventTest/' + eventName + '/schedulescreen/topic').push({
        scheduleName: scheduleName,
        start: start,
        end: end,
        speakerdesc: speakerdesc,
        room: room,
        learnmore: learnmore,
        networking: networking
      })
    }


    //social media
    var facebook = document.getElementById("facebook").value;
    var instagram = document.getElementById("instagram").value;
    var linkedIn = document.getElementById("linkedin").value;
    var twitter = document.getElementById("twitter").value;
    var youtube = document.getElementById("youtube").value;

    firebase.database().ref('eventTest/' + eventName + '/socialmedia').set({
      facebook: facebook,
      instagram: instagram,
      linkedIn: linkedIn,
      twitter: twitter,
      youtube: youtube
    })


    $("div").each(function () {

      //speakers
      if ($(this).attr("name") == "speakers") {
        var speakerName = ""
        var speakerTitle = ""
        var speakerCompany = ""
        var speakerLink = ""
        var keynotespeaker = false;
        var speakerPicture = ""

        $(this).find("input").map(function () {
          if ($(this).attr("type") == "file") {
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
          firebase.database().ref('eventTest/' + eventName + '/speakerscreen').push({
            name: speakerName,
            title: speakerTitle,
            company: speakerCompany,
            link: speakerLink,
            keynotespeaker: keynotespeaker,
            picture: url
          });
          console.log("speaker in")
        })
      }

      //ticket
      if ($(this).attr("name") == "tickets") {
        var ticketAmount = ""
        var ticketDesc = ""
        var ticketLink = ""

        var file = ""

        $(this).find("input").map(function () {
          if ($(this).attr("type") == "file") {
            file = $(this).get(0).files[0];
          }
          if ($(this).attr("name") == "amount") {
            ticketAmount = $(this).val();
          }
          if ($(this).attr("name") == "ticketDesc") {
            ticketDesc = $(this).val();
          }
          if ($(this).attr("name") == "ticketLink") {
            ticketLink = $(this).val();
          }
        })

        uploadImageAsPromise(file, 'tickets').then((url) => {
          firebase.database().ref('eventTest/' + eventName + '/ticketscreen').push({
            value: ticketAmount,
            desc: ticketDesc,
            picture: url,
            link: ticketLink
          });
          console.log("ticket in")
        })
      }

      //exhibitors
      if ($(this).attr("id") == "collapseFour") {
        var exhibitorScreenLink = document.getElementById("exhibitorLink").value;
        var brandLink = document.getElementById("brandLink").value;

        firebase.database().ref('eventTest/' + eventName + '/exhibitorscreen/exhibitorscreenLinks').set({
          exhibitorScreenLink: exhibitorScreenLink,
          brandLink: brandLink
        }).then(() => {
          $(this).find("div").each(function () {

            if ($(this).attr("name") == "exhibitors") {
              var exhibitorLink = ""
              var sponsor = ""

              var file = ""

              $(this).find("input").map(function () {
                if ($(this).attr("type") == "file") {
                  file = $(this).get(0).files[0];
                }
                if ($(this).attr("name") == "Sponsor") {
                  if ($(this).is(":checked")) {
                    sponsor = true;
                  }
                  else {
                    sponsor = false;
                  }
                }
                if ($(this).attr("name") == "weblink") {
                  exhibitorLink = $(this).val();
                }
              })

              uploadImageAsPromise(file, 'exhibitors').then((url) => {
                firebase.database().ref('eventTest/' + eventName + '/exhibitorscreen/exhibitor').push({
                  logo: url,
                  sponsor: sponsor,
                  link: exhibitorLink
                });
                console.log("exhibitor in")
              })
            }
          })

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

function loadDetails() {
  var eventName = location.search.substring(1);

  if (eventName.includes("%20")) {
    eventName = eventName.replace(/%20/g, " ");
  }

  document.getElementById("eventName").value = eventName;

  var ref = firebase.database().ref('eventTest/' + eventName);

  ref.on('value',
    (function (snapshot) {
      var event = snapshot.val();
      console.log(event);

      document.getElementById("subTitle").value = event.subTitle;
      document.getElementById("date").value = event.date;
      document.getElementById("location").value = event.location;
      document.getElementById("startTime").value = event.startTime;
      document.getElementById("endTime").value = event.endTime;
      document.getElementById("desc").value = event.desc;
      console.log();

      




      // var keys = Object.keys(event);
      // console.log(keys);

      // for (var i = 0; i < keys.length; i++) {
      //   var k = keys[i];
      //   var name = events[k].name;
      //   var desc = events[k].desc;
      //   var logo = events[k].logo;
      //   var date = events[k].date;
      //   var location = events[k].location;
      //   var floorplan = events[k].floorplan;
      //   var subTitle = events[k].subTitle;
      //   var time = events[k].time;


      //   console.log(imageUrl)
      //   var eachinsert = "<div class='col-md-4 my-3'><div class='event-existing'><a href='eventRegistration.html?" + name + "'><img src='" + logo + "' style='width:400px;height:300px;'></a><div class='desc'>" + name + "</div></div></div>"
      //   total = total + eachinsert
      // }


      // document.getElementById("eventDisplay").innerHTML = total
      /*
      events.forEach(myFunction);

      function myFunction(item, index) {
          document.getElementById("demo").innerHTML += index + ":" + item + "<br>"; 
      }*/
    }),
    (function (error) {
      console.log(error)
    })
  );

}