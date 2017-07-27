


var config = {
    apiKey: "AIzaSyA3_webVEyTgNu_0FZryAHMriudnhqbaz4",
    authDomain: "hw-7-train.firebaseapp.com",
    databaseURL: "https://hw-7-train.firebaseio.com",
    projectId: "hw-7-train",
    storageBucket: "",
    messagingSenderId: "919799265078"
  };

firebase.initializeApp(config);

var database = firebase.database();
var ref = database.ref("train");
var objkey = [];

//var provider = new firebase.auth.GithubAuthProvider();
//
// $("#github").on("click", function(event){
//     event.preventDefault();
//     firebase.auth().signInWithPopup(provider).then(function(result) {
//   // This gives you a GitHub Access Token. You can use it to access the GitHub API.
//           var token = result.credential.accessToken;
//   // The signed-in user info.
//           var user = result.user;
//           console.log(user);
//   // ...
//     }).catch(function(error) {
//   // Handle Errors here.
//           var errorCode = error.code;
//           var errorMessage = error.message;
//   // The email of the user's account used.
//           var email = error.email;
//   // The firebase.auth.AuthCredential type that was used.
//           var credential = error.credential;
//           console.log(errorMessage);
//     });
// });
//
// $("#login").on("click", function(){
//
//     var auth = firebase.auth();
//     var email = $("#email").val();
//     var pass = $("#password").val();
//     var promise = auth.signInWithEmailAndPassword(email, pass);
//     promise.catch(function(event){console.log(event.message);});
// });
//
// $("#signup").on("click", function(){
//
//     var auth = firebase.auth();
//     var email = $("#email").val();
//     var pass = $("#password").val();
//     var promise = auth.createUserWithEmailAndPassword(email, pass);
//     promise.catch(function(event){console.log(event.message);});
// });
//
$("#logout").on("click", function(){
    firebase.auth().signOut();
    window.location = "../index.html";
});
//
//
 firebase.auth().onAuthStateChanged(function(user){

   if(user){
     console.log(user);
   }
   else {
     console.log("not logged in");
   }
 });



ref.on("value", function(data){
      $(".rows").remove();
      var dat = data.val();
      var keys = Object.keys(dat);
      objkey = keys;
      addDatabase(dat, keys);
    });


function addDatabase (dat, keys){

    var ind = 0;

    for (var i=0; i<keys.length; i++){
      var newrow = $("<tr>");
      newrow.addClass("rows");
      newrow.attr("id", "rowID"+ind);

      var buttonDelete = $("<button class = 'btn btn-primary deleteButton'>");
      buttonDelete.attr("data-index",ind);
      buttonDelete.text("X");
      var buttonEdit = $("<button class = 'btn btn-primary editButton'>");
      buttonEdit.attr("data-index",ind);
      buttonEdit.attr("id","edit"+ind);
      buttonEdit.text("edit");

        for (var property in dat[keys[i]]){
         var newcol = $("<td>");
         //if (dat[keys[i]].hasOwnProperty(property)) {
            newcol.html(dat[keys[i]][property]);
            newrow.append(newcol);
          //}
        }

      $("#train").append(newrow);
      newrow.append(buttonDelete);
      newrow.append(buttonEdit);
      ind++;
      }
}



function train (){

     var date = new Date();
     var time = $("#time").val().split(":");
     date.getHours()-parseInt(time[0]);
     time[0] = (parseInt(time[0])-date.getHours()-1)*60;
     time[1] = (60 - date.getMinutes() + parseInt(time[1]));
     time = time[0]+time[1];

      var data = {
            atrainName: $("#trainName").val(),
            bdestination: $("#destination").val(),
            cminutes: $("#minutes").val(),
            dtime: $("#time").val(),
            etimeleft: time+"min"
      };
      ref.push(data);
}

$(".submit").on("click", function(event){
      event.preventDefault();
      train();
      $(".form-control").val("");
});


$(document).on("click",".deleteButton", function(event){
      event.preventDefault();
      var id = $(this).attr("data-index");
      ref.child(objkey[id]).remove();
});


$(document).on("click",".editButton", function(event){
      event.preventDefault();

      var id = $(this).attr("data-index");
      $("#edit"+id).remove();
      var newbtn = $("<button class='btn btn-primary saveButton' data-index = "+id+">");
      newbtn.attr("id","save"+id);
      newbtn.text("save");
      $("#rowID"+id).append(newbtn);
      $("#rowID"+id).find("td:first-child").html('<input type="name" class="save-form" id = newName'+id+'  placeholder="Train Name">');
      $("#rowID"+id).find("td:nth-child(2)").html('<input type="name" class="save-form" id = newDestination'+id+' placeholder="Destination">');
      $("#rowID"+id).find("td:nth-child(3)").html('<input type="name" class="save-form" id = newMinutes'+id+' placeholder="Time">');
      $("#rowID"+id).find("td:nth-child(4)").html('<input type="time" class="save-form" id = newTime'+id+' placeholder="minutes">');
      $("#rowID"+id).find("td:nth-child(5)").html('...');
});


$(document).on("click",".saveButton", function(event){
      event.preventDefault();

      var id = $(this).attr("data-index");
      var date = new Date();
      var time = $("#newTime"+id).val().split(":");
      date.getHours()-parseInt(time[0]);
      time[0] = (parseInt(time[0])-date.getHours()-1)*60;
      time[1] = (60 - date.getMinutes() + parseInt(time[1]));
      time = time[0]+time[1];


      var data = {
            atrainName: $("#newName"+id).val(),
            bdestination: $("#newDestination"+id).val(),
            cminutes: $("#newMinutes"+id).val(),
            dtime: $("#newTime"+id).val(),
            etimeleft: time+"min"
      };
      ref.child(objkey[id]).update(data);
      $("#save"+id).remove();
});
