function orientate(){
  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(go_to_me);
  }
}

function go_to_me(position){
  map.panTo(new L.LatLng(position.coords.latitude, position.coords.longitude));
}

function update() {
  console.log("updating");
  const message = document.getElementById("state_message");
  
  if (navigator.geolocation && cookie != ""){
    navigator.geolocation.getCurrentPosition(communicate);
  } else if (navigator.geolocation) { 
    console.warn("user not yet logged in");
    message.innerHTML = "Unfortunately we could not find your log in details.";
  } else{
    console.warn("nav unavaliable");
    message.innerHTML = "Navigation is unavaliable.";
  }
}

function communicate(position){
  let my_id = get_id();
  
  var my_lat = position.coords.latitude;
  var my_long = position.coords.longitude;
  const my_data = [my_lat,my_long,my_id];
  add_marker(my_lat,my_long,"me","green");

  const req = new XMLHttpRequest();
  req.open("POST","/update_state");
  req.onreadystatechange = function(res){
    if (req.readyState == 4 && req.status == 200){
      var data = req.response;
      const message = document.getElementById("state_message");
      if (data == "1"){
        message.innerHTML = "You are being chased, either keep moving or find a good hiding spot.";
      } else if (data == "2"){
        message.innerHTML = "Invalid game mode.";
      } else if (data == "3"){
        message.innerHTML = "Waiting for game to start.";
      } else if (data == "4"){
        message.innerHTML = "Game finished.";
      } else if (data == "5"){
        message.innerHTML = "Game not found.";
      } else {
        const obj = JSON.parse(data);
        analyse(obj["info"]);
        message.innerHTML = "Your targets are shown on the map below, go find them!";
      }
    }
  }
  req.send(my_data);
}

function clear_map(){
  markers.clearLayers();
}

function add_marker(lat,long,text,colour){
  const string = "<p style='color:" + colour + "'>(" + text + ")</p>";
  L.marker([lat, long], {
    icon: new L.divIcon({
      html: string
    })
  }).addTo(markers);
}

function analyse(data){
  const json = data
  if (json.length > 0){
    for (let i = 0; i < json.length; i++) {
      let name = json[i].name;
      let lat = json[i].lat;
      let long = json[i].long;
      add_marker(lat,long,name,"red");
    }
  }
}

function register_catch(){
  console.log("registering catch");
  let my_id = get_id();
  console.log("id: " + my_id);
  
  const req = new XMLHttpRequest();
  req.open("POST","/register_catch");
  req.onreadystatechange = function(res){
    if (req.readyState == 4 && req.status == 200){
      console.log(req.response);
    }
  }
  req.send(my_id);
}

function get_id(){  
  let cookie = document.cookie;
  let stage1 = cookie.split(":")[1];
  let my_id = stage1.substr(0,stage1.length);
  return(my_id);
}
