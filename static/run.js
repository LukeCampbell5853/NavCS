function update() {
  let cookie = document.cookie;
  if (navigator.geolocation && cookie != ""){
    navigator.geolocation.getCurrentPosition(communicate);
  } else if (navigator.geolocation) { 
    console.log("nav unavailable - participation temperorarily suspended");
  } else{
    console.log("user not yet logged in")
  }
}

function communicate(position){
  console.log("starting communication")
  
  let cookie = document.cookie
  let stage1 = cookie.split(":")[1]
  let id = stage1.substr(0,stage1.length)
  console.log(cookie)
  console.log(id)
  
  var lat = position.coords.latitude;
  var long = position.coords.longitude;
  const data = [lat,long]

  const req = new XMLHttpRequest();
  req.open("POST","/update_state");
  req.onreadystatechange = function(res){
    if (req.readyState == 4 && req.status == 200){
      var data = req.responseText;
      if (data == "!"){
        console.log("game not currently running")
      } else {
        console.log("game data updated")
        var coors = (req.responseText).split(",");
        var lat = parseFloat(coors[0]);
        var long = parseFloat(coors[1]);
        console.log([lat,long])
        map.panTo(new L.LatLng(lat, long));
        L.marker([lat, long]).addTo(markers);   
      }
    }
  }
  req.send(data);
}

function clear_map(){
  markers.clearLayers();
}
