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
  const link = document.getElementById("register_catch_button");
  cookie = document.cookie;
  
  if (navigator.geolocation && cookie != ""){
    console.log("Navigation working and user logged in")
    resp = navigator.geolocation.getCurrentPosition(communicate);
    console.log(resp);
    link.innerHTML = "I got caught.";
  } else if (navigator.geolocation) { 
    console.warn("user not yet logged in");
    link.style.display = "none";
    resp = [{"players":[],"msg":"User not yet logged in."},0,0];
  } else{
    console.warn("nav unavaliable");
    link.innerHTML = "";
    resp = [{"players":[],"msg":"Please allow GPS to play."},0,0];
  }
  return(resp);
}

function communicate(position){
  console.log("Running communicate")
  let my_id = get_id();
  
  var my_lat = position.coords.latitude;
  var my_long = position.coords.longitude;
  const my_data = [my_lat,my_long,my_id];

  const req = new XMLHttpRequest();
  req.open("POST","/update_state");
  req.onreadystatechange = function(res){
    if (req.readyState == 4 && req.status == 200){
      console.log("Got response");
      var data = req.response;
      console.log(data);
      return([data,my_lat,my_long]);
    }
  }
  req.send(my_data);
}

function clear_map(){
  markers.clearLayers();
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
