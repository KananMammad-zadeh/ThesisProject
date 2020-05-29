
    let userpos;    // Defining position variable
    let map;        // Defining map variable
    let infoWindow; // Defining infoWindow variable (Stage 2)
    let currentInfoWindow; // Defining current Window variable (Stage 2)
    let service;    // Defining new variable to define service parameter (Stage 3)
    let bounds;     // Defining new variable to define bounds (Stage 3)
    let infoPane;   // Defining new variable to define info Panel (Stage 4)
    let searchkey;
   

    
    function initMap() { 
      
         // With initMap function we define the default center point, zoom level and request API for the map.
        userpos = { lat: 40.378740, lng: 49.849221 };
    bounds = new google.maps.LatLngBounds();  // Adding new variable to define bounds (Stage 3)
    infoWindow = new google.maps.InfoWindow;  // Adding new variable to define screen (Stage 3)
    currentInfoWindow = infoWindow;
    infoPane = document.getElementById('panel'); // Adding information Panel (Stage 4)
   
    // This if statement is run if user allows the browser to use his/her geolocation (Stage 2)
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            userpos = {                         // If user allows this section is used to get user's geolocation (Stage 2)
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          map = new google.maps.Map(document.getElementById('map'), {
            center: userpos,
            zoom: 18
          });

          infoWindow.setPosition(userpos);        // This command sets position to the users'. (Stage 2)
          infoWindow.setContent('You are here');  // This command call the message. (Stage 2)
          infoWindow.open(map);                   // This command call to open the map. (Stage 2)
          map.setCenter(userpos);                 // This command sets map's center to user's location. (Stage 2)
          getNearbyPlaces(userpos);

        },


    // This statement is used if user doesn't allow for geolocation information. (Stage 2)
    function() {    
          handleLocationError(true, infoWindow);
    });
    } 
    
    // This function is run if the geolocation service failed. (Stage 2)
    else {
        handleLocationError(false, infoWindow);
      }
    
    function handleLocationError(browserHasGeolocation, infoWindow) {
        map = new google.maps.Map(document.getElementById('map'), {
            center: userpos,
            zoom: 18
          });
      infoWindow.setPosition(userpos);
      infoWindow.setContent(browserHasGeolocation ?
                            'You denied geolocation access permission.' :
                            'Error: Your browser doesn\'t support geolocation.');
      infoWindow.open(map);
      currentWindow = infoWindow;
      getNearbyPlaces(userpos);

    }
    }
  
     

// Adding function to get nearby places by given keyword (Stage 3)

function getNearbyPlaces(position) {
  var searchkey = prompt("Find nearby places", "ATMs, cafes, restaurants etc."); //  Adding search for required places
  let request = {
    location: position,
    rankBy: google.maps.places.RankBy.DISTANCE,
    keyword: searchkey,
  };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, nearbyCallback);
  }

// Adding function to get markers for found places (Stage 3)
  function nearbyCallback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    createMarkers(results);
  }
  }


// Adding function to create markers for each found places (Stage 3)
function createMarkers(places) {
  places.forEach(place => {
    let marker = new google.maps.Marker({
      position: place.geometry.location,
      map: map,
      title: place.name
    });

    google.maps.event.addListener(marker, 'click', () => { // Adding Listener to click action for each marker (Stage 4)
      let request = {
        placeId: place.place_id,
        fields: ['name', 'formatted_address', 'geometry', 'rating', 
          'website', 'photos']
      };

      service.getDetails(request, (placeResult, status) => { // Gettin details (Stage 4)
        showDetails(placeResult, marker, status)
      });
    });


    bounds.extend(place.geometry.location);
  });
  
  map.fitBounds(bounds);
}

function showDetails(placeResult, marker, status) { // Function to show details by giving parameters (Stage 4)
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    let placeInfowindow = new google.maps.InfoWindow();
    placeInfowindow.setContent('<div><strong>' + placeResult.name +
      '</strong><br>' + 'Rating: ' + placeResult.rating + '</div>');
    placeInfowindow.open(marker.map, marker);
    currentInfoWindow.close();
    currentInfoWindow = placeInfowindow;
    showPanel(placeResult);
  } else {
    console.log('showDetails failed: ' + status);
  }
}

function showPanel(placeResult) { // This function is used to show the panel (Stage 4)
  if (infoPane.classList.contains("open")) {
    infoPane.classList.remove("open");
  }

  while (infoPane.lastChild) {
    infoPane.removeChild(infoPane.lastChild);
  }

  if (placeResult.photos != null) { // Image of the location (Stage 4)
    let firstPhoto = placeResult.photos[0];
    let photo = document.createElement('img');
    photo.classList.add('hero');
    photo.src = firstPhoto.getUrl();
    infoPane.appendChild(photo);
  }
  
  let name = document.createElement('h1'); // Name of the location (Stage 4)
  name.classList.add('place');
  name.textContent = placeResult.name;
  infoPane.appendChild(name);
  if (placeResult.rating != null) {
    let rating = document.createElement('p'); // Rating of the location (Stage 4)
    rating.classList.add('details');
    rating.textContent = `Rating: ${placeResult.rating} \u272e`;
    infoPane.appendChild(rating);
  }
  let address = document.createElement('p'); // Address of the location (Stage 4)
  address.classList.add('details');
  address.textContent = placeResult.formatted_address;
  infoPane.appendChild(address);
  if (placeResult.website) { // Link to the location (Stage 4)
    let websitePara = document.createElement('p');
    let websiteLink = document.createElement('a');
    let websiteUrl = document.createTextNode(placeResult.website);
    websiteLink.appendChild(websiteUrl);
    websiteLink.title = placeResult.website;
    websiteLink.href = placeResult.website;
    websitePara.appendChild(websiteLink);
    infoPane.appendChild(websitePara);
  }

  infoPane.classList.add("open"); // Opening the panel (Stage 4)
}

    