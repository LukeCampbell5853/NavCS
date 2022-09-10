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

function change_stage(num){
  stage = "{cutout at stage [" + num + "]}";
  document.getElementById("stage_indicator").innerHTML = stage;
  console.log("at stage " + num);
}

function update() {
  change_stage(1);
  const message = document.getElementById("state_message");
  const link = document.getElementById("register_catch_button");
  cookie = document.cookie;
  
  if (navigator.geolocation && cookie != ""){
    change_stage(2);
    navigator.geolocation.getCurrentPosition(communicate,showError);
    link.innerHTML = "I got caught.";
  } else if (navigator.geolocation) { 
    console.warn("user not yet logged in");
    link.style.display = "none";
    message.innerHTML = "Your login details were not found.";
    change_stage("end");
  } else{
    console.warn("nav unavaliable");
    link.innerHTML = "";
    message.innerHTML = "Please allow GPS to play";
    change_stage("end");
  }
}

function communicate(position){
  change_stage(3);
  my_id = get_id();
  var lat = position.coords.latitude;
  var long = position.coords.longitude;
  const my_data = [lat,long,my_id];

  const req = new XMLHttpRequest();
  change_stage(4);
  req.open("POST","/update_state");
  change_stage(5);
  req.onreadystatechange = function(res){
    if (req.readyState == 4 && req.status == 200){
      change_stage(6);
      var data = req.response;
      if (data == "1"){
        document.getElementById("state_message").innerHTML = "Game not found.";
        change_stage("end");
      } else if (data == "2"){
        document.getElementById("state_message").innerHTML = "Waiting for game to start...";
        change_stage("end");
      } else if (data == "3"){
        console.log("game finished, relocating");
        window.location.href = "/finished";
      } else {
        change_stage(7);
        const obj = JSON.parse(data);
        console.log(obj);
        document.getElementById("state_message").innerHTML = obj.msg;
        change_stage(8);
        clear_map();
        add_marker(lat,long,"me","green");
        plot_all(obj.players);
        change_stage("end");
      }
    }
  }
  req.send(my_data);
  change_stage(5);
}

function showError(error){
  change_stage("end");
  switch(error.code) {
    case error.PERMISSION_DENIED:
      document.getElementById("state_message").innerHTML = "Please allow location services access to play."
      break;
    case error.POSITION_UNAVAILABLE:
      document.getElementById("state_message").innerHTML = "There was an issue with your location services."
      break;
    case error.TIMEOUT:
      document.getElementById("state_message").innerHTML = "Location services took too long to respond."
      break;
    case error.UNKNOWN_ERROR:
      document.getElementById("state_message").innerHTML = "An unknown error occurred."
      break;
  }
}

function register_catch(){
  console.log("registering catch");
  let my_id = get_id();
  console.log("id: " + my_id);
  
  const req = new XMLHttpRequest();
  req.open("POST","/register_catch");
  req.send(my_id);
}

function get_id(){  
  let decodedCookie = decodeURIComponent(document.cookie);
  let whole = decodedCookie.split(';');
  let my_id = "";
  for(let i = 0; i < whole.length; i++) {
    let sect = whole[i];
    while (sect.charAt(0) == ' ') {
      sect = sect.substring(1);
    }
    if (sect.indexOf(name) == 0) {
      my_id = sect.substring(3, sect.length);
    }
  }
  return(my_id)
}
