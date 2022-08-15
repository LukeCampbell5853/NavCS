function join(){
  var name = document.getElementById("f_name").value + " " + document.getElementById("l_name").value;
  var code = document.getElementById("code").value;
  
  const data = {
    "name":name,
    "code":code
  }
  console.log(data)
  
  const req = new XMLHttpRequest();
  req.open("POST","/connect");
  req.onreadystatechange = function(res){
    if (req.readyState == 4 && req.status == 200){
      var code = req.responseText
      if (code == "[invalid code]"){
        console.log("invalid code")
      }
      else if (code == "[error]"){
        console.log("An unknown error occured")
      }
      else {
        console.log("game created with code: " + code)
      }
    }
  }
  req.send(data)
}
