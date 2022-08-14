function getLocation() {
  if (confirm("Cookies are needed to play this game, if you don't wish to allow cookies press 'cancel', you wont be able to play but you can still read about and book games") == false){
    console.log("Cookies not allowed
    document.getElementById("cont_link").remove();
  }
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else { 
    document.getElementById("coordinates").innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  var lat = position.coords.latitude;
  var long = position.coords.longitude;
  document.getElementById("coordinates").innerHTML = "location: " + position.coords.latitude + ", " + position.coords.longitude;
  document.getElementById("cont_link").innerHTML = "this shows my location, continue >>";
  document.getElementById("cont_link").setAttribute("href","/join")
          
  var map = L.map('map').setView([lat, long], 17);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);
  var marker = L.marker([lat, long]).addTo(map);
}

function showError(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      document.getElementById("coordinates").innerHTML = "It seems location has been blocked on your device. To play please change your permissions."
      break;
    case error.POSITION_UNAVAILABLE:
      document.getElementById("coordinates").innerHTML = "Location information is unavailable on this device, please use another device to join."
      break;
    case error.TIMEOUT:
      document.getElementById("coordinates").innerHTML = "Location information is unavailable on this device, please use another device to join."
      break;
    case error.UNKNOWN_ERROR:
      document.getElementById("coordinates").innerHTML = "Location information is unavailable on this device, please use another device to join."
      break;
  }
}
