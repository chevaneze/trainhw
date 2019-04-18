    var config = {
        apiKey: "AIzaSyDDMhB8veBnh-LFVN_WqzskPUG-Ka-tJKY",
        authDomain: "ucfchevaneze.firebaseapp.com",
        databaseURL: "https://ucfchevaneze.firebaseio.com",
        projectId: "ucfchevaneze",
        storageBucket: "ucfchevaneze.appspot.com",
        messagingSenderId: "144042213434"
      };
      firebase.initializeApp(config);

    var database = firebase.database();

    var name;
    var destination;
    var firstTrain;
    var frequency = 0;

    $("#add-train").on("click", function() {
        event.preventDefault();
        name = $("#train-name").val().trim();
        destination = $("#destination").val().trim();
        firstTrain = $("#first-train").val().trim();
        frequency = $("#frequency").val().trim();

        database.ref().push({
            name,
            destination,
            firstTrain,
            frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        $("form")[0].reset();
    });

    database.ref().on("child_added", function(childSnapshot) {
        var nextArr;
        var minAway;
        var firstTrainNew = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
        var diffTime = moment().diff(moment(firstTrainNew), "minutes");
        var remainder = diffTime % childSnapshot.val().frequency;
        var minAway = childSnapshot.val().frequency - remainder;
        var nextTrain = moment().add(minAway, "minutes");
        nextTrain = moment(nextTrain).format("hh:mm");

        $("#add-row").append("<tr><td>" + childSnapshot.val().name +
                "</td><td>" + childSnapshot.val().destination +
                "</td><td>" + childSnapshot.val().frequency +
                "</td><td>" + nextTrain + 
                "</td><td>" + minAway + "</td></tr>");

        }, function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
    });

    database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
        $("#train-name").html(snapshot.val().name);
        $("#destination").html(snapshot.val().destination);
        $("#first-train").html(snapshot.val().firstTrain);
        $("#frequency").html(snapshot.val().frequency);
    });