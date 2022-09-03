function orientate(){
  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(go_to_me);
  }
}

function go_to_me(position){
  map.panTo(new L.LatLng(position.coords.latitude, position.coords.longitude));
}

function add_marker(lat,long,text,colour){
  if (colour == "green"){
    L.marker([lat, long], {icon: green_target}).addTo(markers).bindPopup(text);
  } else{
    L.marker([lat, long], {icon: red_target}).addTo(markers).bindPopup(text);
  }
}

function plot_all(data){
  for (let i = 0; i < data.length; i++) {
    let player = data[i];
    console.log("chasing " + player.name + " at " + player.lat + ", " + player.long + ".");
    add_marker(player.lat,player.long,player.name,"red");
    console.log("chasing player" + name);
  }
}

function clear_map(){
  markers.clearLayers();
}

function update() {
  console.log("updating");
  const message = document.getElementById("state_message");
  const link = document.getElementById("register_catch_button");
  cookie = document.cookie;
  
  if (navigator.geolocation && cookie != ""){
    console.log("Navigation working and user logged in")
    navigator.geolocation.getCurrentPosition(communicate);
    link.innerHTML = "I got caught.";
  } else if (navigator.geolocation) { 
    console.warn("user not yet logged in");
    link.style.display = "none";
    message.innerHTML = "Your login details were not found.";
  } else{
    console.warn("nav unavaliable");
    link.innerHTML = "";
    message.innerHTML = "Please allow GPS to play";
  }
}

function communicate(position){
  console.log("Running communicate")
  let my_id = get_id();
  
  var lat = position.coords.latitude;
  var long = position.coords.longitude;
  const my_data = [lat,long,my_id];

  const req = new XMLHttpRequest();
  req.open("POST","/update_state");
  req.onreadystatechange = function(res){
    if (req.readyState == 4 && req.status == 200){
      console.log("Got response");
      var data = req.response;
      console.log(data);
      if (data == "1"){
        document.getElementById("state_message").innerHTML = "Game not found.";
      } else if (data == "2"){
        document.getElementById("state_message").innerHTML = "Game not running.";
      } else {
        const obj = JSON.parse(data);
        console.log(obj);
        document.getElementById("state_message").innerHTML = data.msg;
        clear_map();
        add_marker(lat,long,"me","green");
        plot_all(data.players);
      }
    }
  }
  req.send(my_data);
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
