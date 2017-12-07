// Initialize Firebase
var config = {
    apiKey: "AIzaSyAH2OC1t_QSiIb3gdZt5C3JWIaJ7iUMLxw",
    authDomain: "errands247-187219.firebaseapp.com",
    databaseURL: "https://errands247-187219.firebaseio.com",
    projectId: "errands247-187219",
    storageBucket: "",
    messagingSenderId: "408159602363"
};

firebase.initializeApp(config);


var database = firebase.database();

// 2. Button for adding order
$("#add-order-btn").on("click", function(event) {
    event.preventDefault();

    // Grabs user input
    var pickUpAddress = $("#pickUp-input").val().trim();
    var items = $("#order-input").val().trim();
    var name = $("#name-input").val().trim();
    var dropOffAddress = $("#dropOff-input").val().trim();
    var timeOf = moment().format('LLL');
    var status = 0

    // Creates local "temporary" object for holding all order data
    var newOrder = {
        pickUpAddress: pickUpAddress,
        items: items,
        name: name,
        dropOffAddress: dropOffAddress,
        timeOf: timeOf
    };

    // Uploads train data to the database
    database.ref().push(newOrder);

    // Logs everything to console
    console.log(newOrder.pickUpAddress);
    console.log(newOrder.items);
    console.log(newOrder.name);
    console.log(newOrder.dropOffAddress);
    console.log(newOrder.timeOf);


    // Alert
    alert("Order successfully added");

    // Clears all of the text-boxes
    $("#pickUp-input").val("");
    $("#order-input").val("");
    $("#name-input").val("");
    $("#dropOff-input").val("");

    
});

// 3. Create Firebase event for adding order to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

    // console.log(childSnapshot.val());

    // Store everything into a variable.
    var pickUpAddy = childSnapshot.val().pickUpAddress;
    var allItems = childSnapshot.val().items;
    var customerName = childSnapshot.val().name;
    var dropOffAddy = childSnapshot.val().dropOffAddress;

    var tempRow = $('<tr>')
    var tableJunk = "<td>" + pickUpAddy + "</td><td>" + allItems + "</td><td>" +
        customerName + "</td><td>" + dropOffAddy + "</td><td><input type='button'value='status'id ='status'/></td>";

    tempRow.append(tableJunk)

    $("#time-table > tbody").append(tempRow)
    tempRow.status = 0
    // tempRow.UNIQUE FIREBASE IDENTIFIER

    // event listener for status button
    tempRow.on('click', function() { //do something})
        event.preventDefault();
        console.log("status updated")
        tempRow.status++
            if (tempRow.status == 1) {
                console.log("red")
                $(tempRow.children()[4].children[0]).css({ 'background': 'red' })
            }
        if (tempRow.status == 2) {
            console.log("purple")
            $(tempRow.children()[4].children[0]).css({ 'background': 'purple' })
        }
        if (tempRow.status == 3) {
            console.log("blue")
            $(tempRow.children()[4].children[0]).css({ 'background': 'blue' })
        }
        console.log(tempRow.status)
    });

});

// Google API Stuff Starts --------------------------**

function initAutocomplete() {
        var map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 33.717471, lng: -117.831143 },
            zoom: 11,
            mapTypeId: 'roadmap'
        });

        // Create the search box and link it to the UI element.
        var input = document.getElementById('pickUp-input');
        var address = document.getElementById('dropOff-input');
        var searchBox = new google.maps.places.SearchBox(input);
        var addressBox = new google.maps.places.SearchBox(address);
        // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
            searchBox.setBounds(map.getBounds());
            addressBox.setBounds(map.getBounds());
        });

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
            var places = searchBox.getPlaces();

            if (places.length == 0) {
                return;
            }

            // Clear out the old markers.
            markers.forEach(function(marker) {
                marker.setMap(null);
            });
            markers = [];

            // For each place, get the icon, name and location.
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function(place) {
                if (!place.geometry) {
                    console.log("Returned place contains no geometry");
                    return;
                }
                var icon = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };

                // Create a marker for each place.
                markers.push(new google.maps.Marker({
                    map: map,
                    icon: icon,
                    title: place.name,
                    position: place.geometry.location
                }));

                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            });
            map.fitBounds(bounds);
        });
    }


    // function for adding dummy data on click

        $("#send_email").click(function() {
        event.preventDefault()
        store_location = $("#store_location").val();
        order = $("#order").val();
        name = $("#name").val();
        dropOff = $("#dropOff").val();
        to = "errandsbiz24@gmail.com";
        subject = "Order";
        $("#main").text("Sending E-mail...Please wait");
        // data = {to:to,subject:subject,location:location,order:order,name:name,dropOff:dropOff}
        data = { to, subject, text: `Store Location: ${store_location}, \n order: ${order}, \n name: ${name}, \n dropOff: ${dropOff}` }
        $.ajax({
            type: "POST",
            url: 'http://localhost:3000/send',
            data: data,
            success: function(data) {
                console.log('mail response:', data);

                if (data == "sent") {
                    $("#main").empty().html("Email is been sent. " + name + " Your order is on the way!");
                }
            }
        })
        //         $.get("http://localhost:3000/send",{to:to,subject:subject,location:location,order:order,name:name,dropOff:dropOff},function(data){
        //         if(data=="sent")
        //         {
        //             $("#main").empty().html("Email is been sent at "+to+". Your order is on it's way!");
        //         }

        // });
    });
    