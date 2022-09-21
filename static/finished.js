function get_places(){
  id = get_id();
  
  const req = new XMLHttpRequest();
  req.open("POST","/update_state");
  req.onreadystatechange = function(res){
    if (req.readyState == 4 && req.status == 200){
      var content = req.response;
      document.getElementById("place_display").innerHTML = content;
    }
  }
  req.send(id);
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
  console.log("user id: " + my_id);
  return(my_id)
}
