function join(){
  var f_name = document.getElementById("f_name").value;
  var l_name = document.getElementById("l_name").value;
  var name = f_name + " " + l_name;
  var code = document.getElementById("code").value;
  
  if (f_name == "" || code == ""){
    document.getElementById("message").innerHTML = "Please fill in all required fields."
  } else {
    const data = [name,code];
    console.log(data)

    const req = new XMLHttpRequest();
    req.open("POST","/connect2");
    const message = document.getElementById("message");
    req.onreadystatechange = function(res){
      if (req.readyState == 4 && req.status == 200){
        var resp = req.responseText;
        if (resp == "[invalid code]"){
          console.log("invalid code");
          message.innerHTML = "The code you entered didn't match up with any of the games";
        }
        else if (resp == "[game started]"){
          console.log("game already started");
          message.innerHTML = "The game has already started.";
        }
        else if (resp == "[error]"){
          console.log("an unknown error occured");
          message.innerHTML = "An unknown error occured.";
        }
        else {
          console.log("user logged with id: " + resp);
          if (!(navigator.cookieEnabled)){
            message.innerHTML = "Please enable cookies to play.";
          } else if (!(navigator.location)){
            message.innerHTML = "Please enable location to play.";
          } else{
            document.cookie = "id:"+resp +";";
            window.location.href = "/run";
          }
        }
      }
    }
    req.send(data);
  }
}
