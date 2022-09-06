function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

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
  }
}

function clear_map(){
  markers.clearLayers();
}

function update() {
  const message = document.getElementById("state_message");
  const link = document.getElementById("register_catch_button");
  cookie = document.cookie;
  
  if (navigator.geolocation && cookie != ""){
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
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  let my_id = "";
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      my_id = c.substring(3, c.length);
    }
  }
  console.log("user is at [" + my_id + "]");
  
  var lat = position.coords.latitude;
  var long = position.coords.longitude;
  const my_data = [lat,long,my_id];

  const req = new XMLHttpRequest();
  req.open("POST","/update_state");
  req.onreadystatechange = function(res){
    if (req.readyState == 4 && req.status == 200){
      var data = req.response;
      if (data == "1"){
        document.getElementById("state_message").innerHTML = "Game not found.";
      } else if (data == "2"){
        document.getElementById("state_message").innerHTML = "Waiting for game to start...";
      } else if (data == "3"){
        console.log("game finished, relocating");
        window.location.href = "/finished";
      } else {
        const obj = JSON.parse(data);
        console.log(obj);
        document.getElementById("state_message").innerHTML = obj.msg;
        clear_map();
        add_marker(lat,long,"me","green");
        plot_all(obj.players);
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
  req.send(my_id);
}
