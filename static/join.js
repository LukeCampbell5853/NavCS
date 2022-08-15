function join(){
  var name = document.getElementById("f_name").value + " " + document.getElementById("l_name").value;
  var code = document.getElementById("code").value;
  
  const data = [name,code];
  console.log(data)
  
  const req = new XMLHttpRequest();
  req.open("POST","/connect2");
  req.onreadystatechange = function(res){
    if (req.readyState == 4 && req.status == 200){
      var resp = req.responseText
      if (resp == "[invalid code]"){
        console.log("invalid code")
      }
      else if (resp == "[game started]"){
        console.log("game already started")
      }
      else if (resp == "[error]){
        console.log("an unknown error occured")
      }
      else {
        console.log("user logged with id: " resp)
      }
    }
  }
  req.send(data)
}
