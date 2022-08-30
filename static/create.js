function set_max_date(){
  var today = new Date();
  var max = new Date(today.setDate(today.getDate() + 14)).toISOString().slice(0,10);
  document.getElementById("date_val").max = max;
}

function submit() {
  var time = document.getElementById("time_val").value;
  var date = document.getElementById("date_val").value;
  var hours = document.getElementById("hours").value;
  var minutes = document.getElementById("minutes").value;
  var mode = document.getElementById("mode").value;

  const d = new Date();
  let timeadj = d.getTimezoneOffset();

  if (time == "" || date == "" || hours == "" || minutes == ""){
    document.getElementById("message").innerHTML = "Please fill out all fields.";
  }
  else{
    const data = [time,date,timeadj,hours,minutes,mode]
    const req = new XMLHttpRequest();
    req.open("POST","/submit_application");
    req.onreadystatechange = function(res){
      if (req.readyState == 4 && req.status == 200){
        var code = req.responseText
        if (code == "1"){
          document.getElementById("message").innerHTML = "Please set your game to start in the future.";
        } else if (code == "2"){
          document.getElementByID("message").innerHTML = "An error occured while creating your game.";
        } else{
          document.getElementById("message").innerHTML = "Your game is being created, access it with the code '" + code + "'.";
          document.getElementById("go").remove();
        }
      }
    }
    req.send(data)
  }
}
