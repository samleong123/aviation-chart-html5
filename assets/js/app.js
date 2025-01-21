let data = []; // Global variable to store decoded data

document.addEventListener("DOMContentLoaded", () => {
    retrieveData();
});


function retrieveData() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "./assets/js/data.json", true);
    xhr.onload = function () {
        if (xhr.status === 200) {
			
            data = JSON.parse(xhr.responseText);
            renderAirportSelection(); // Call renderAirportSelection after decoding
			document.getElementById("search-airport").addEventListener("input", filterAirports);
            customAlert("Success","All charts and airports data has been loaded!","success");
			
        } else {
            customAlert("Error", "Failed to load data", "error");
        }
    };
    xhr.onerror = function () {
        customAlert("Error", "Failed to load data", "error");
    };
    xhr.send();

}

function renderAirportSelection() {
    const airportListContainer = document.getElementById("available-airport-list");
    const template = document.getElementById("box-list-tmpl").innerHTML;

    // Clear previous contents
    airportListContainer.innerHTML = "";

    // Render each airport
    data.forEach((airport, index) => {
        const renderedHTML = Mustache.render(template, {
            type: "airport",
            count: index,
            value: airport.value,
            name: airport.name,
        });
        airportListContainer.innerHTML += renderedHTML;
    });

    // Add event listener to each airport card
    document.querySelectorAll(".airport").forEach((airportCard) => {
        airportCard.addEventListener("click", function () {
            renderChartSelection(this);
        });
    });
}

function renderChartSelection(airportElement) {
    const airportValue = airportElement.getAttribute("airport");
    const selectedAirport = data.find((airport) => airport.value === airportValue);

    if (selectedAirport) {
        const chartListContainer = document.getElementById("available-chart-list");
        const template = document.getElementById("box-list-tmpl").innerHTML;

        // Clear previous contents
        chartListContainer.innerHTML = "";

        // Render each chart
        selectedAirport.charts.forEach((chart, index) => {
            const renderedHTML = Mustache.render(template, {
                type: "chart",
                count: index,
                value: chart.value,
                name: chart.name,
            });
            chartListContainer.innerHTML += renderedHTML;
        });

        // Add event listener to each chart card
        document.querySelectorAll(".chart").forEach((chartCard) => {
            chartCard.addEventListener("click", function () {
                renderChart(this.getAttribute("chart"));
            });
        });
    } else {
		customAlert("Error", "Airport data not found", "error");
    }
}

function renderChart(chartValue) {
    const selectedChart = data
        .flatMap((airport) => airport.charts) // Combine all charts into a single array
        .find((chart) => chart.value === chartValue);

    if (selectedChart) {

        const chartView = document.getElementById("chart-view-iframe");
        if (determineDevice() == "Android"){
            var urlencoded_url = encodeURIComponent(selectedChart.value);
            var proxy_url = `https://cfboost.samsam123.name.my/?url=${urlencoded_url}`;
            var viewer_url = `./jsviewer.html#${proxy_url}`; 
            chartView.src = viewer_url;
        } else {
            chartView.src = selectedChart.value;
        }
      
        document.getElementById("chart-view").classList.remove("d-none"); // Display

		

    } else {
        customAlert("Error", "Chart data not found", "error");
    }
}

function filterAirports() {
    const searchInput = document.getElementById("search-airport").value.toLowerCase(); // Get input value and convert to lowercase
    const airportCards = document.querySelectorAll("#available-airport-list .airport"); // Get all rendered airport elements

    // Loop through each airport card and hide/show based on the search text
    airportCards.forEach((card) => {
        const airportName = card.querySelector("h5").textContent.toLowerCase(); // Get the airport name inside <h5>
        if (airportName.includes(searchInput)) {
            card.style.display = "block"; // Show the card if it matches the search
        } else {
            card.style.display = "none"; // Hide the card if it doesn't match
        }
    });
}

function customAlert(title, message, type){
    Swal.fire({
        title: title,
        text: message,
        icon: type
      });
}

function determineDevice(){
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // iOS / iPadOS / MacOS
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    } 

    // Android
    if (/android/i.test(userAgent)) {
        return "Android";
    } 
}