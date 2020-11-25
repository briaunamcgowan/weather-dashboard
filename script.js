$(document).ready(function(){ 

    
    
    
//when user enters a city and clicks search, display user city in jumbotron header
$(".searchCityButton").on("click", function(){
    


   const citySearch = $(".searchCityInput").val();
   
    
     
    $(".searchCityInput").val(""); //empty input field

    loadJumbotron(citySearch);
   

});
//get cities from local storage 
var citylist = JSON.parse(localStorage.getItem("citylist")) || [];
//set citylist search to correct length
if (citylist.length > 0) {
    loadJumbotron(citylist[citylist.length -1]);

}
//make row for each index in citylist array
for (var i = 0; i < citylist.length; i++) {
    createList(citylist[i]);
}
   
function createList(text) {
    var list = $("<li>").addClass("list-group-item").text(text);
    $(".citylist").append(list);
}
//list item on click functionality
$(".citylist").on("click", "li", function(){
    loadJumbotron($(this).text());
   
});



//pulling weather data based off user input
    function loadJumbotron(x){

        var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + x + "&units=imperial&appid=4e1d3f7a2819df21862189cf606302c7"
        

        $.ajax({
            url: queryURL,
            method: "GET",

        }).then(function(data){
            if(citylist.indexOf(x) === -1) {
                citylist.push(x);
                localStorage.setItem("citylist", JSON.stringify(citylist));
                createList(x);
            }
        
            
        
    
            $.ajax({
                url:"http://api.openweathermap.org/data/2.5/weather?q=" + x + "&units=imperial&appid=4e1d3f7a2819df21862189cf606302c7",
                method: "GET",
            }).then(function(response){
            console.log(response);

            //set variables for weather images
            var ID = response.weather[0].id;
            var Icon;
    
            // Thunderstorm
            if (ID >= 200 && ID <= 232) {
                Icon = 'https://openweathermap.org/img/wn/11d.png';
                // Drizzle and rain
            } else if ((ID >= 300 && ID <= 321) || (ID >= 500 && ID <= 531)) {
                Icon = 'https://openweathermap.org/img/wn/10d.png';
                // Snow
            } else if (ID >= 600 && ID <= 622) {
                Icon = 'https://openweathermap.org/img/wn/13d.png';
                // Clear
            } else if (ID === 800) {
                Icon = 'https://openweathermap.org/img/wn/01d.png';
                // Cloudy
            } else if (ID >= 801 && ID <= 804) {
                Icon = 'https://openweathermap.org/img/wn/03d.png';
                // Atmosphere
            } else if (ID >= 701 && ID <= 781) {
                Icon = 'https://openweathermap.org/img/wn/50d.png';
                // If anything else, put clouds
            } else {
                Icon = 'https://openweathermap.org/img/wn/02d.png';
            }

            $(".resultHeader").empty()
            $(".date").empty()

            var city = response.name;
            var img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png")

            $(".resultHeader").append(city, img )
            $(".date").text(new Date().toLocaleDateString())
            
            var currentTemp = Math.floor(response.main.temp)
            var currentHum = Math.floor(response.main.humidity)
            var currentWind = Math.floor(response.wind.speed)

            //pull lat and lon from weather data for uv index
            var currentLat = Math.floor(response.coord.lat)
            var currentLon = Math.floor(response.coord.lon)
            
           
            
            

            //display data results to assigned span class 
        
            $(".currentDayTemp").text(currentTemp + "°F")
            $(".currentDayHum").text(currentHum + "%")
            $(".currentDayWind").text(currentWind + "MPH")


            $("#fiveDay").empty()
            $("#forecastHeader").empty()

            $.ajax({
                url: "https://api.openweathermap.org/data/2.5/forecast?q=" + x + "&appid=4e1d3f7a2819df21862189cf606302c7&units=imperial",
                method: "GET",

    

            }).then(function (response) { console.log(response)
                $("#forecastHeader").append("<h3>5-Day Forecast:</h3><br>")
                for (i = 0; i < response.list.length; i++) {
                    if (response.list[i].dt_txt.indexOf("12:00:00") !== -1) {{
                        var newCol = $("<div>").attr("class", "col-md-2 forecast");
                        
                        var displayDay = $("<h5>").text(new Date(response.list[i].dt_txt).toLocaleDateString());$(newCol).append(displayDay);
    
                        var nextDayTemp = Math.round(response.list[i].main.temp);
                        $(newCol).append("Temp: " + nextDayTemp + "° F<br>");
    
                        var nextDayHumidity = response.list[i].main.humidity;
                        $(newCol).append("Humidity: " + nextDayHumidity + "%");

                        var image = "https://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png";
                        $(newCol).append("<img src='" + image + "'><br>");
    
                        $("#fiveDay").append(newCol);

                    }

                }
            }})
           
            //calculate uv index
            calcUVIndex(currentLat,currentLon)

        })
    
    });
    
    
        //use new api url to get uv index
    function calcUVIndex(x, y){
        
        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/uvi?lat=" + x + "&lon=" + y + "&appid=4e1d3f7a2819df21862189cf606302c7",
            method: "GET"

        }).then(function(response){
            console.log(response);
        
            var uvIndex = Math.floor(response.value)

            $(".currentDayUV").text(uvIndex);

            
        });

        
        
    }}})