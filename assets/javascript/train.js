// 1. Create and set up the connection to Firebase using the config function received after setting up the train-time database on Firebase:
var config = {
  apiKey: "AIzaSyDjiFek3szYG5vKxfua9mSPRuswBnRkSK8",
  authDomain: "train-time-40a20.firebaseapp.com",
  databaseURL: "https://train-time-40a20.firebaseio.com",
  projectId: "train-time-40a20",
  storageBucket: "train-time-40a20.appspot.com",
  messagingSenderId: "104589541528"
};

firebase.initializeApp(config);

// Create a new variable to reference the database.
var database = firebase.database();

// Initial Variables:
var name = "";
var dest = "";
var freq = "";
var first = "";
var next = "";
var mins = "";

// 2. Create the on-click function that triggers the Submit of new user inputs. This function sends the inputs to Firebase using .push.
$("#submit-button").on("click", function () {

  // Prevents the page from refreshing.
  event.preventDefault();

  // Gets the inputs from the form:
  name = $("#name-input").val().trim();
  dest = $("#dest-input").val().trim();
  first = $("#first-time-input").val().trim();
  freq = $("#freq-input").val().trim();

  console.log("Name: ", name);
  console.log("Destination: ", dest);
  console.log("First Train Time: ", first);
  console.log("Frequency: ", freq);

  // Creates a local "temporary" object for holding user input data. Prepares it for push.
  var newTrain = {
    tstamp: firebase.database.ServerValue.TIMESTAMP,
    name: name,
    dest: dest,
    first: first,
    freq: freq
  };

  console.log("New Train Temp Object: ", newTrain);
  // Push the data to Firebase:
  database.ref().push(newTrain);

  // Clear all the text boxes after user clicks Submit:
  name = $("#name-input").val("");
  dest = $("#dest-input").val("");
  first = $("#first-time-input").val("");
  freq = $("#freq-input").val("");
});

// 3. Create Firebase event for adding new trains to the database as multiple records. Need to use childSnapshot. 
// // Firebase is always watching for changes to the data.
// // When changes occurs it will print them to console and html. This is pulling the Child data which is represented by the new train id number in Firebase.
database.ref().on("child_added", function (childSnapshot, prevChildKey) {

  // Print the initial data to the console.
  console.log("child log: ", childSnapshot.val());

  // Log the value of the various properties
  console.log(childSnapshot.val().name);
  console.log(childSnapshot.val().dest);
  console.log(childSnapshot.val().first);
  console.log(childSnapshot.val().freq);

  // Store everything in a new variable
  var currentTrain = childSnapshot.val();
  var trainName = currentTrain.name;
  var trainDest = currentTrain.dest;
  var trainFirst = currentTrain.first;
  var trainFreq = currentTrain.freq;

  console.log("Train Name: ", trainName);
  console.log("Train Destination: ", trainDest);
  console.log("First Train Time: ", trainFirst);
  console.log("Train Frequency: ", trainFreq);

  // 4. Calculate when the next train will arrive relative to the current time ("system time").
  // (First Train time is entered by user in 24 hr. military time format - will need to be converted before using in calcs.)
  // a. Convert the entered military time of the First Train and the Current Time into the same format.
  var trainFirstConversion = moment(trainFirst, "hh:mm a").subtract(1, "years");
  console.log("First Train Time Conversion: ", trainFirstConversion);
  var currentTime = moment();
  console.log("Current Time: ", moment(currentTime).format("hh:mm a"));
  // b. Current Time - First Train = Time Difference 
  var diffTime = moment().diff(moment(trainFirstConversion), "minutes");
  console.log("Time Difference: ", diffTime);
  // c. Then, deal with the intervals between trains. Use the Modulus operator to calc the remainder of the time difference divided by frequency.
  var remainder = diffTime % trainFreq;
  // d. Subtract the remainder from the frequency to get the # of minutes until next train arrives.
  var timeToTrain = trainFreq - remainder;
  console.log("Minutes Away: " + timeToTrain);
  // e. Finally, format and add the time until next train arrives.
  // Use the "a" to get AM/PM and remove one "h" to lose the leading zero.
  var nextTrain = moment().add(timeToTrain, "minutes").format("h:mm a");
  console.log("Next Arrival Time: ", nextTrain);

  // 5. Add each train's data into the HTML table.
  $("#train-table > thead").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" +
    trainFreq + "</td><td>" + nextTrain + "</td><td>" + timeToTrain + "</td><td><button class='delRow' value='Delete'>Delete</button>");

});

// ==> BONUS: Added option to delete a train (row) from the table. I found this solution snippet on Stack. It deletes locally ONLY.
// https://stackoverflow.com/questions/13241005/add-delete-row-from-a-table
// If I have time, try this: https://stackoverflow.com/questions/43990651/remove-object-from-firebase-using-javascript
// var rootRef = firebase.database().ref().child("Assets");
// $("#train-table").on('click','.delRow', function(e){
//     var $row = $(this).closest('tr'),
//     var rowId = $row.data('id');
//     rootRef.child(rowId).remove()
//     //it should remove the firebase object in here
//     rootRef.child(assetKey).remove()
//     //after firebase confirmation, remove table row
//     .then(function() {
//       $row.remove();
//     })
//     //Catch errors
//     .catch(function(error) {
//       console.log('ERROR');
//     });  
// });

// rootRef.on("child_changed", snap => {

//   var assetKey = snap.child("id").val();
//   var name = snap.child("name").val();
//   var dest = snap.child("dest").val();
//   var first = snap.child("first").val();
//   var freq = snap.child("freq").val();

// });