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
  if (file == null) {
    file = $('[class="imagePreview"]').css('background-image').replace(/(url\(|\)|")/g, "");
  }

  if (file != null) {
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
      if (pdfile == null) {
        pdfile = $('#filename')[0].innerText;
      }
      uploadImageAsPromise(pdfile, 'floorplan').then((url) => {
        firebase.database().ref('eventTest/' + eventName + '/schedulescreen/floorplan').set({
          floorplan: url
        })
      })

      var rows = document.getElementsByTagName("tbody")[0].rows;
      if (rows.length > 0){
        for (var i = 0; i < rows.length; i++) {
          var scheduleName = rows[i].getElementsByTagName("td")[0].innerHTML;
          var start = rows[i].getElementsByTagName("td")[1].innerHTML;
          var end = rows[i].getElementsByTagName("td")[2].innerHTML;
          var speakerdesc = rows[i].getElementsByTagName("td")[3].innerHTML;
          var room = rows[i].getElementsByTagName("td")[4].innerHTML;
          var learnmore = rows[i].getElementsByTagName("td")[5].innerHTML;
          var networking = rows[i].getElementsByTagName("td")[6].innerHTML;
          if (networking == "Y" || networking == "y") {
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

          if (file == null) {
            $(this).find("div").map(function () {
              if ($(this).attr("class") == "speakerPreview") {
                file = $(this).css('background-image').replace(/(url\(|\)|")/g, "");
              }
            })
          }

          if ((file instanceof File) || (file.includes("https://firebasestorage.googleapis.com"))) {
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
          else {
            alert("Speaker needs picture")
          }
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

          if (file == null) {
            $(this).find("div").map(function () {
              if ($(this).attr("class") == "ticketPreview") {
                file = $(this).css('background-image').replace(/(url\(|\)|")/g, "");
              }
            })
          }

          if ((file instanceof File) || (file.includes("https://firebasestorage.googleapis.com"))) {
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
          else {
            alert("ticket needs picture")
          }
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

                if (file == null) {
                  $(this).find("div").map(function () {
                    if ($(this).attr("class") == "exhibitorPreview") {
                      file = $(this).css('background-image').replace(/(url\(|\)|")/g, "");
                    }
                  })
                }

                if ((file instanceof File) || (file.includes("https://firebasestorage.googleapis.com"))) {
                  uploadImageAsPromise(file, 'exhibitors').then((url) => {
                    firebase.database().ref('eventTest/' + eventName + '/exhibitorscreen/exhibitor').push({
                      logo: url,
                      sponsor: sponsor,
                      link: exhibitorLink
                    });
                    console.log("exhibitor in")
                  })
                }
                else {
                  alert("exhibitor needs picture")
                }
              }
            })

          })

        }

      })

    }).then(function(){
      alert("Submission Successful");
    })

  }
  else {
    alert("Please Upload a picture for the event");
  }



}

function uploadImageAsPromise(imageFile, category) {
  return new Promise(function (resolve, reject) {

    if (typeof imageFile === 'string' && imageFile.includes("https://firebasestorage.googleapis.com")) {
      resolve(imageFile)
    }
    else if (imageFile instanceof File) {
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
            resolve(downloadURL)
          })
        }
      );
    }

  });
}

function loadDetails() {
  var eventName = location.search.substring(1);

  if (eventName != ""){
    if (eventName.includes("%20")) {
      eventName = eventName.replace(/%20/g, " ");
    }
  
    document.getElementById("eventName").value = eventName;
  
    var ref = firebase.database().ref('eventTest/' + eventName);
  
    ref.once('value',
      (function (snapshot) {
        var event = snapshot.val();
        console.log(event);
  
        document.getElementById("subTitle").value = event.subTitle;
        document.getElementById("date").value = event.date;
        document.getElementById("location").value = event.location;
        document.getElementById("startTime").value = event.startTime;
        document.getElementById("endTime").value = event.endTime;
        document.getElementById("desc").value = event.desc;
        $("#eventLogo").closest(".imgUp").find('.imagePreview').before('</label>').css("background-image", "url(" + event.logo + ")");
  
        for (var key in event) {
          if (key == "speakerscreen") {
            var speakerObject = event[key];
            var innerKey = Object.keys(speakerObject);
  
            for (var i = 0; i < innerKey.length; i++) {
              $(".imgAdd").click();
            }
  
            var index = 0
            $('[name="speakers"]').each(function () {
  
              var speakerCompany = speakerObject[innerKey[index]].company;
              var keynotespeaker = speakerObject[innerKey[index]].keynotespeaker;
              var speakerLink = speakerObject[innerKey[index]].link;
              var speakerName = speakerObject[innerKey[index]].name;
              var speakerTitle = speakerObject[innerKey[index]].title;
              var speakerPicture = speakerObject[innerKey[index]].picture;
  
              $(this).find("input").map(function () {
                $(this).closest(".imgUp").find('.speakerPreview').before('</label>').css({ "background-image": "url(" + speakerPicture + ")", "background-repeat": "no-repeat", "background-size": "contain" });
  
                if ($(this).attr("name") == "keySpeaker") {
                  if (keynotespeaker == true) {
                    $(this).prop("checked", true);;
                  }
                }
                if ($(this).attr("name") == "speaker") {
                  $(this).val(speakerName);
                }
                if ($(this).attr("name") == "title") {
                  $(this).val(speakerTitle);
                }
                if ($(this).attr("name") == "company") {
                  $(this).val(speakerCompany);
                }
                if ($(this).attr("name") == "link") {
                  $(this).val(speakerLink);
                }
              })
  
              index = index + 1;
            });
  
          }
  
          if (key == "schedulescreen") {
            var scheduleObject = event[key];
  
            for (var inner in scheduleObject) {
              if (inner == "topic") {
  
                var topic = scheduleObject[inner];
                var topicKeys = Object.keys(topic);
  
                var tbody = ""
  
                for (var i = 0; i < topicKeys.length; i++) {
                  var scheduleName = topic[topicKeys[i]].scheduleName;
                  var start = topic[topicKeys[i]].start;
                  var end = topic[topicKeys[i]].end;
                  var speakerdesc = topic[topicKeys[i]].speakerdesc;
                  var room = topic[topicKeys[i]].room;
                  var learnmore = topic[topicKeys[i]].learnmore;
                  var networking = topic[topicKeys[i]].networking;
                  if (networking == true) {
                    networking = "Y";
                  }
                  else {
                    networking = "N";
                  }
  
                  var insert = '<tr id=""><td>' + scheduleName + '</td><td>' + start + '</td><td>' + end + '</td><td>' + speakerdesc + '</td><td>' + room + '</td><td>' + learnmore + '</td><td>' + networking + '</td><td name="buttons"><div class="btn-group pull-right"><button id="bEdit" type="button" class="btn btn-sm btn-default" onclick="rowEdit(this);" style=""><span class="glyphicon glyphicon-pencil"><i class="fa fa-edit"></i></span></button><button id="bElim" type="button" class="btn btn-sm btn-default" onclick="rowElim(this);" style=""><span class="glyphicon glyphicon-trash"> <i class="fa fa-trash"></i></span></button><button id="bAcep" type="button" class="btn btn-sm btn-default" style="display: none;" onclick="rowAcep(this);"><span class="glyphicon glyphicon-ok"><i class="fa fa-check-square"></i> </span></button><button id="bCanc" type="button" class="btn btn-sm btn-default" style="display: none;" onclick="rowCancel(this);"><span class="glyphicon glyphicon-remove"><i class="fa fa-times"></i> </span></button></div></td></tr>'
                  tbody = tbody + insert;
  
                }
                document.getElementsByTagName("tbody")[0].innerHTML = tbody;
  
              }
  
              if (inner == "tabbar") {
                document.getElementById("registration").value = scheduleObject[inner].link1;
                document.getElementById("tradeshow").value = scheduleObject[inner].link2;
              }
  
              if (inner == "floorplan") {
                document.getElementById("filename").innerHTML = scheduleObject[inner].floorplan;
  
              }
            }
  
  
          }
  
          if (key == "exhibitorscreen") {
  
            var exhibitorObject = event[key];
  
            for (var inner in exhibitorObject) {
              if (inner == "exhibitor") {
  
                var exh = exhibitorObject[inner];
                var exhKeys = Object.keys(exh);
  
  
                for (var i = 0; i < exhKeys.length; i++) {
                  $(".exhAdd").click();
                }
  
                var index = 0
                $('[name="exhibitors"]').each(function () {
  
                  var exhibitorLink = exh[exhKeys[index]].link;
                  var sponsor = exh[exhKeys[index]].sponsor;
  
                  var logo = exh[exhKeys[index]].logo;
  
                  $(this).find("input").map(function () {
                    $(this).closest(".imgUp").find('.exhibitorPreview').before('</label>').css({ "background-image": "url(" + logo + ")", "background-repeat": "no-repeat", "background-size": "contain" });
                    if ($(this).attr("name") == "Sponsor") {
                      if (sponsor == true) {
                        $(this).prop("checked", true);;
                      }
                    }
                    if ($(this).attr("name") == "weblink") {
                      $(this).val(exhibitorLink);
                    }
                  })
  
                  index = index + 1;
                });
  
              }
  
              if (inner == "exhibitorscreenLinks") {
                var exhscr = exhibitorObject[inner];
  
                document.getElementById("exhibitorLink").value = exhscr.exhibitorScreenLink;
                document.getElementById("brandLink").value = exhscr.brandLink;
              }
            }
          }
  
          if (key == "ticketscreen") {
            var ticketObject = event[key];
            var innerKey = Object.keys(ticketObject);
  
            for (var i = 0; i < innerKey.length; i++) {
              $(".tickAdd").click();
            }
  
            var index = 0
            $('[name="tickets"]').each(function () {
  
              var ticketAmount = ticketObject[innerKey[index]].value;
              var ticketDesc = ticketObject[innerKey[index]].desc;
              var ticketLink = ticketObject[innerKey[index]].link;
              var ticketPicture = ticketObject[innerKey[index]].picture;
  
              $(this).find("input").map(function () {
                $(this).closest(".imgUp").find('.ticketPreview').before('</label>').css({ "background-image": "url(" + ticketPicture + ")", "background-repeat": "no-repeat", "background-size": "contain" });
  
                if ($(this).attr("name") == "amount") {
                  $(this).val(ticketAmount);
                }
                if ($(this).attr("name") == "ticketDesc") {
                  $(this).val(ticketDesc);
                }
                if ($(this).attr("name") == "ticketLink") {
                  $(this).val(ticketLink);
                }
              })
  
              index = index + 1;
            });
  
          }
  
          if (key == "socialmedia") {
            var ticketObject = event[key];
  
            document.getElementById("facebook").value = ticketObject.facebook;
            document.getElementById("instagram").value = ticketObject.instagram;
            document.getElementById("linkedin").value = ticketObject.linkedIn;
            document.getElementById("twitter").value = ticketObject.twitter;
            document.getElementById("youtube").value = ticketObject.youtube;
          }
        }
      }),
      (function (error) {
        console.log(error)
      })
    );
  }

  

}