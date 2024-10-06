// Function to get the selected Bathroom value
function getBathValue() {
    var uiBathrooms = document.getElementsByName("uiBathrooms");
    for (var i = 0; i < uiBathrooms.length; i++) {
        if (uiBathrooms[i].checked) {
            return parseInt(uiBathrooms[i].value); // Get actual value, not index
        }
    }
    return -1; // Invalid value if none are selected
}

// Function to get the selected BHK value
function getBHKValue() {
    var uiBHK = document.getElementsByName("uiBHK");
    for (var i = 0; i < uiBHK.length; i++) {
        if (uiBHK[i].checked) {
            return parseInt(uiBHK[i].value); // Get actual value, not index
        }
    }
    return -1; // Invalid value if none are selected
}

// Function to estimate home price when button is clicked
function onClickedEstimatePrice() {
    console.log("Estimate price button clicked");

    var sqft = document.getElementById("uiSqft").value; // Get square feet input value
    var bhk = getBHKValue(); // Get BHK value
    var bathrooms = getBathValue(); // Get Bathroom value
    var location = document.getElementById("uiLocations").value; // Get selected location
    var estPrice = document.getElementById("uiEstimatedPrice"); // Get result element

    if (sqft === "" || location === "") {
        estPrice.innerHTML = "<h2>Please fill in all fields.</h2>";
        return;
    }

    var url = "/api/predict_home_price"; // API endpoint

    // Send POST request with input data
    $.post(url, {
        total_sqft: parseFloat(sqft),
        bhk: bhk,
        bath: bathrooms,
        location: location
    }, function(data, status) {
        if (status === "success" && data.estimated_price) {
            console.log(data.estimated_price);
            estPrice.innerHTML = "<h2>" + data.estimated_price.toString() + " Lakh</h2>"; // Display estimated price
        } else {
            estPrice.innerHTML = "<h2>Could not estimate price. Try again.</h2>";
        }
    }).fail(function() {
        estPrice.innerHTML = "<h2>Error with the API call.</h2>"; // Error handling
    });
}

// Function to load the page and populate location names
function onPageLoad() {
    console.log("Document loaded");

    var url = "/api/get_location_names"; // API endpoint for locations
    $.get(url, function(data, status) {
        console.log("Got response for get_location_names request");

        if (data && status === "success") {
            var locations = data.locations; // Array of location names
            var uiLocations = document.getElementById("uiLocations");

            // Clear current options and repopulate with new locations
            $('#uiLocations').empty();
            $('#uiLocations').append('<option value="" disabled selected>Choose a Location</option>'); // Default option

            for (var i in locations) {
                var opt = new Option(locations[i]);
                $('#uiLocations').append(opt); // Add each location option
            }
        }
    }).fail(function() {
        console.error("Error fetching location names.");
    });
}

// Load locations when the page is fully loaded
window.onload = onPageLoad;
