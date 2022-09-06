function nothing(position){}

function join(){
  var name = document.getElementById("name").value;
  var code = document.getElementById("code").value;
  navigator.geolocation.getCurrentPosition(nothing)
  document.cookie = "id:;";
  
  if (name == "" || code == ""){
    document.getElementById("message").innerHTML = "Please fill in all required fields."
  } else if (!(navigator.cookieEnabled)){
    message.innerHTML = "Please enable cookies to play.";
  } else if (!(navigator.geolocation)){
    message.innerHTML = "Please enable location to play.";
  } else {
    const data = [name,code];
    console.log(data)

    const req = new XMLHttpRequest();
    req.open("POST","/connect");
    const message = document.getElementById("message");
    req.onreadystatechange = function(res){
      if (req.readyState == 4 && req.status == 200){
        var resp = req.responseText;
        if (resp == "1"){
          console.log("invalid code");
          message.innerHTML = "The code you entered didn't match up with any of the games";
        } else if (resp == "2"){
          console.log("game already started");
          message.innerHTML = "The game has already started.";
        }else if (resp == "3"){
          console.log("game already finished");
          message.innerHTML = "The game has already finished.";
        }else if (resp == "4"){
          console.log("an unknown error occured");
          message.innerHTML = "An unknown error occured.";
        }else {
          console.log("user logged with id: " + resp);
          const d = new Date();
          d.setTime(d.getTime() + (24*60*60*1000));
          document.cookie = "id=" + resp + ";expires=" + d.toUTCString() + ";path=/";
          window.location.href = "/run";
        }
      }
    }
    req.send(data);
  }
}
