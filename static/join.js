function join(){
  var name = document.getElementById("f_name").value + " " + document.getElementById("l_name").value;
  var code = document.getElementById("code").value;
  
  const data = {
    "name":name,
    "code":code
  }
  console.log(data)
  
  const test_data_type = [name,code];
  console.log(test_data_type)
  
  const req = new XMLHttpRequest();
  req.open("POST","/connect2");
  req.onreadystatechange = function(res){
    if (req.readyState == 4 && req.status == 200){
      var resp = req.responseText
      if (resp == "[invalid code]"){
        console.log("invalid code")
      }
      else if (resp == "[error]"){
        console.log("An unknown error occured")
      }
      else {
        console.log("game created with code: " + resp)
      }
    }
  }
  req.send(test_data_type)
}
