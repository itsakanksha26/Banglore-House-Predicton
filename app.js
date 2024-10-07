function getBathValue() {
    var uiBathrooms = document.getElementsByName("uiBathrooms");
    for (var i = 0; i < uiBathrooms.length; i++) {
        if (uiBathrooms[i].checked) {
            return parseInt(uiBathrooms[i].value);
        }
    }
    return -1; // Invalid Value
}

function getBHKValue() {
    var uiBHK = document.getElementsByName("uiBHK");
    for (var i = 0; i < uiBHK.length; i++) {
        if (uiBHK[i].checked) {
            return parseInt(uiBHK[i].value);
        }
    }
    return -1; // Invalid Value
}

function onClickedEstimatePrice() {
    console.log("Estimate price button clicked");

    var sqft = parseFloat(document.getElementById("uiSqft").value); // Correctly parsing sqft value
    var bhk = getBHKValue(); // Get the BHK value
    var bathrooms = getBathValue(); // Get the Bathroom value
    var location = document.getElementById("uiLocations").value; // Get selected location
    var estPrice = document.getElementById("uiEstimatedPrice");

    // Validate input
    if (isNaN(sqft) || sqft <= 0) {
        alert("Please enter a valid area in square feet.");
        return;
    }
    if (bhk === -1) {
        alert("Please select the number of BHK.");
        return;
    }
    if (bathrooms === -1) {
        alert("Please select the number of bathrooms.");
        return;
    }
    if (!location) {
        alert("Please select a location.");
        return;
    }

    var url = "http://127.0.0.1:5000/predict_home_price"; 
    //var url = "/api/predict_home_price"; // Use this if you are using nginx. i.e tutorial 8 and onwards

    $.post(url, {
        total_sqft: sqft, // Use the parsed sqft value
        bhk: bhk,
        bath: bathrooms,
        location: location
    }, function(data, status) {
        console.log(data.estimated_price);
        estPrice.innerHTML = "<h2>" + data.estimated_price.toString() + " Lakh</h2>";
        console.log(status);
    });
}

function onPageLoad() {
    console.log("document loaded");
    // var url = "http://127.0.0.1:5000/get_location_names"; // Use this if you are NOT using nginx which is first 7 tutorials
    var url = "/api/get_location_names"; // Use this if you are using nginx. i.e tutorial 8 and onwards
    $.get(url, function(data, status) {
        console.log("got response for get_location_names request");
        if (data) {
            var locations = data.locations;
            var uiLocations = document.getElementById("uiLocations");
            $('#uiLocations').empty(); // Clear existing options
            for (var i in locations) {
                var opt = new Option(locations[i]);
                $('#uiLocations').append(opt);
            }
        }
    });
}

window.onload = onPageLoad;
