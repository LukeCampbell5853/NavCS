function modal(){
  var f_name = document.getElementById("f_name").value;
  var l_name = document.getElementById("l_name").value;
  var code = document.getElementById("code").value;
  if (f_name == "" || l_name == "" || code == ""){
    document.getElementById("message").innerHTML = "Please fill in all fields.";
  } else {
    document.getElementById("modal").style.visibility = "visible";
  }
}

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
        document.getElementById("modal").style.visibility = "hidden";
      }
      else if (resp == "[game started]"){
        console.log("game already started");
        message.innerHTML = "The game has already started.";
        document.getElementById("modal").style.visibility = "hidden";
      }
      else if (resp == "[error]"){
        console.log("an unknown error occured");
        message.innerHTML = "An unknown error occured.";
        document.getElementById("modal").style.visibility = "hidden";
      }
      else {
        console.log("user logged with id: " + resp);
        document.cookie = "id:"+resp +";";
        document.getElementById("modal").style.visibility = "visible";
      }
    }
  }
  req.send(data);
  }
}
