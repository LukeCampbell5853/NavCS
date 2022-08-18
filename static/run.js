function orientate(){
  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(go_to_me);
  }
}

function go_to_me(position){
  map.panTo(new L.LatLng(position.coords.latitude, position.coords.longitude));
}

function update() {
  let cookie = document.cookie;
  if (navigator.geolocation && cookie != ""){
    navigator.geolocation.getCurrentPosition(communicate);
  } else if (navigator.geolocation) { 
    console.log("user not yet logged in");
  } else{
    console.log("nav unavaliable")
  }
}

function communicate(position){
  console.log("starting communication")
  
  let cookie = document.cookie
  let stage1 = cookie.split(":")[1]
  let my_id = stage1.substr(0,stage1.length)
  
  var my_lat = position.coords.latitude;
  var my_long = position.coords.longitude;
  const my_data = [my_lat,my_long,my_id];
  add_marker(my_lat,my_long,"me","green");

  const req = new XMLHttpRequest();
  req.open("POST","/update_state");
  req.onreadystatechange = function(res){
    if (req.readyState == 4 && req.status == 200){
      var data = req.response;
      if (data == "1"){
        console.log("[no active targets]");
      } else if (data == "2"){
        console.log("[invalid game mode]");
      } else if (data == "3"){
        console.log("[game not currently running]");
      } else if (data == "4"){
        console.log("[game not found]")
      } else {
        const obj = JSON.parse(data);
        console.log("[target info gained]");
        analyse(obj["info"]);
      }
    }
  }
  req.send(my_data);
}

function clear_map(){
  markers.clearLayers();
}

function add_marker(lat,long,text,colour){
  L.marker([lat, long], {
    icon: new L.divIcon({
      html: '<p color="'+colour+'">'+name+'</p>'
    })
  }).addTo(markers);
}

function analyse(data){
  //const json = JSON.parse(data);
  const json = data
  if (json.length > 0){
    for (let i = 0; i < json.length; i++) {
      let name = json[i].name;
      let lat = json[i].lat;
      let long = json[i].long;
      console.log(name + " is at (" + lat + "," + long + ")");
      add_marker(lat,long,name,"red");
    }
  }
}
