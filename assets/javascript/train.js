var config = {
    apiKey: "AIzaSyDjiFek3szYG5vKxfua9mSPRuswBnRkSK8",
    authDomain: "train-time-40a20.firebaseapp.com",
    databaseURL: "https://train-time-40a20.firebaseio.com",
    projectId: "train-time-40a20",
    storageBucket: "train-time-40a20.appspot.com",
    messagingSenderId: "104589541528"
  };

  firebase.initializeApp(config);

  // Create a variable to reference the database
  var database = firebase.database();

  // Initial Variables
  // Note remember to create these same variables in Firebase!
  var name = "";
  var dest = "";
  var freq = "";
  var first = "";
  var next = "";
  var mins = "";
  

  // Submit Button changes what is stored in firebase
  $("#submit-button").on("click", function () {

    // Prevent the page from refreshing
    event.preventDefault();

    // Get inputs
    name = $("#name-input").val().trim();
    dest = $("#dest-input").val().trim();
    first = $("#first-time-input").val().trim();
    freq = $("#freq-input").val().trim();
    
    console.log("Name: ", name);
    console.log("Destination: ", dest);
    console.log("First Train Time: ", first);
    console.log("Frequency: ", freq);

    // Creates local "temporary" object for holding input data
    var newTrain = {
      name: name,
      dest: dest,
      first: first,
      freq: freq
    };

    // Push data to Firebase 
    database.ref().push(newTrain);
  });

  // // Firebase is always watching for changes to the data.
  // // When changes occurs it will print them to console and html. This is pulling the Child data which is represented by the emp id
  database.ref().on("child_added", function(childSnapshot, prevChildKey) {

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

          console.log(trainName);

      // Clears all the text boxes
      name = $("#name-input").val("");
      dest = $("#dest-input").val("");
      first = $("#first-time-input").val("");
      freq = $("#freq-input").val("");

    
    // Calculate when the next train will arrive relative to the current time ("system/UNIX time").
    // First Train time is entered by user in 24 hr. military time format.
        // 1. Convert the entered time of the First Train and the Current Time into seconds.
        // 2. Convert Train Frequency to seconds.
        // 3. Current Time (in seconds) - First Train (in seconds) = Total time 
        // 4. Have to factor in the intervals????

    //   var trainMinutes = "";
    //   var timeFormat = "hh:mm";
    
    // //   var convertedDate = moment(trainFirst, timeFormat);
    // console.log(moment("13:00", 'HH:mm').format('hh:mm a'));
    // //   var totalMonths = moment(convertedDate).diff(moment(), "months");
    // //   var totalBilled = totalMonths * empRate;

    //  // Change the HTML
    //  $("train-table" > "tbody").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" + trainFreq + "</td><td>");
  });


   



  //           // If any errors are experienced, log them to console.
          // }, function(errorObject) {
          //   console.log("The read failed: " + errorObject.code);
          