

/////Firebase config////////
var config = {
    apiKey: "AIzaSyA3_webVEyTgNu_0FZryAHMriudnhqbaz4",
    authDomain: "hw-7-train.firebaseapp.com",
    databaseURL: "https://hw-7-train.firebaseio.com",
    projectId: "hw-7-train",
    storageBucket: "",
    messagingSenderId: "919799265078"
  };

////Initialize Firebase and creating reference//////
firebase.initializeApp(config);
var database = firebase.database();
var ref = database.ref("/train");

//Global Variables////
var objkey = [];
var min = 0;


///////Log out if you are already signed in//////
$("#logout").on("click", function(){
    firebase.auth().signOut();
    window.location = "../index.html";
});


 firebase.auth().onAuthStateChanged(function(user){

   if(user){
     console.log(user);
   }
   else {
     console.log("not logged in");
   }
 });


/////Listening any value change on reference we created/////
ref.on("value", function(data){
      $(".rows").remove();
      var dat = data.val();
      var keys = Object.keys(dat);
      objkey = keys;
      addDatabase(dat, keys);
    });


//////Adding user/train info, which is submitted - adding rows to table that we pushed info into firebase/////
function addDatabase (dat, keys){

    var ind = 0;  ////local variable holds data-index for each button id. any time any button is deleted order has not changed.

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
         newcol.attr("id",property+ind);
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

////calculating MinutesAway using moment js////////
function time (){
  var conv = moment($("#time").val(), "hh:mm");
  var diff = moment(conv).diff(moment(),"minutes");
  var min = Math.abs(diff) % parseInt($("#minutes").val());
  if (diff>=0){
    return min;
  }
  else{
    return (parseInt($("#minutes").val()) - min);
  }
}


////////Pushing info to firebase//////
function train (){

      var data = {
            atrainName: $("#trainName").val(),
            bdestination: $("#destination").val(),
            cminutes: $("#minutes").val(),
            dtime: $("#time").val(),
            etimeleft: time()
      };
      ref.push(data);
}

//////Listening submit button user submits data//////
$(".submit").on("click", function(event){
      event.preventDefault();
      train();
      $(".form-control").val("");
});

/////////If user wants to delete data from database and browser//////
$(document).on("click",".deleteButton", function(event){
      event.preventDefault();
      var id = $(this).attr("data-index");
      ref.child(objkey[id]).remove();
});



/////User would like to edit data on browser and firebase//////
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



//////Saving changes that user has made/////////////
$(document).on("click",".saveButton", function(event){
      event.preventDefault();

      var id = $(this).attr("data-index");
      var data = {
          atrainName: $("#newName"+id).val(),
          bdestination: $("#newDestination"+id).val(),
          cminutes: $("#newMinutes"+id).val(),
          dtime: $("#newTime"+id).val(),
          etimeleft: time()
      };
      ref.child(objkey[id]).update(data);
      $("#save"+id).remove();
});


///////Updates MinutesAway by listening values in database only once///////
  ref.once("value", function(data){
      var dat = data.val();
      for (var i=0; i<objkey.length; i++){
        var conv = moment(dat[objkey[i]]["dtime"],"hh:mm");
        var diff = moment(conv).diff(moment(),"minutes");
        var min = Math.abs(diff) % (dat[objkey[i]]["cminutes"]);

        if (diff>=0){
          ref.child(objkey[i]).update({etimeleft: min});
          $("#etimeleft"+i).html(min);
        }
        else{
          ref.child(objkey[i]).update({etimeleft: dat[objkey[i]]["cminutes"] - min});
          $("#etimeleft"+i).html(dat[objkey[i]]["cminutes"] - min);
        }
      }
  });
