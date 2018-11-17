// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyBF2DvvgxWX409hDN6drBvdczCym0pvimE",
    authDomain: "train-schedule-64d80.firebaseapp.com",
    databaseURL: "https://train-schedule-64d80.firebaseio.com",
    projectId: "train-schedule-64d80",
    storageBucket: "train-schedule-64d80.appspot.com",
    messagingSenderId: "60164550036"
};
firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding trains
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#Destination-input").val().trim();
    var firstTrain = $("#first-train-input").val().trim();
    var trainFrequency = $("#Frequency-input").val().trim();

    // Creates local "temporary" object for holding new train data
    var newTrain = {
        name: trainName,
        destination: trainDestination,
        first: firstTrain,
        speed: trainFrequency,
    };

    // Uploads train data to the database
    database.ref().push(newTrain);

    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.first);
    console.log(newTrain.speed);

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#Destination-input").val("");
    $("#first-train-input").val("");
    $("#Frequency-input").val("");
});

//Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var firstTrain = childSnapshot.val().first;
    var trainFrequency = childSnapshot.val().speed;


    var timeArray = firstTrain.split(":")
    var trainTime = moment().hours(timeArray[0]).minutes(timeArray[1]);
    var maxMoment = moment(trainTime);
    var nextArrival;
    var trainMinutes;


    if (maxMoment === trainTime) {
        nextArrival = trainTime.format("hh:mm A");
        trainMinutes = trainTime.diff(moment(), "minutes");
    } else {
        var DiffTIme = moment().diff(trainTime, "minutes");
        var remainder = DiffTIme % trainFrequency;
        trainMinutes = trainFrequency - remainder;
        nextArrival = moment().add(trainMinutes, "m").format("hh:mm A");
    }

    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDestination),
        $("<td>").text(trainFrequency),
        $("<td>").text(nextArrival),
        $("<td>").text(trainMinutes)

    );

    // Append the new row to the table
    $("#train-table > tbody").append(newRow);

});
