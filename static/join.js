function join(){
  console.log("joining game");
  var name = document.getElementById("f_name").value + " " + document.getElementById("l_name").value;
  var code = document.getElementById("code").value;
  const id = Math.random().toString(36).substring(2,7);
  
  console.log("name: " + name);
  console.log("code: " + code);
  console.log("player id: " + id);
  document.cookie = "player_id:"+id;
  
  const data = {
    "name":name,
    "code":code,
    "player_id":id
  }
  console.log(data)
}
