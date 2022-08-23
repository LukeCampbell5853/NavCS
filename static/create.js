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
    alert("Please fill out all fields");
  }
  else{
    const data = [time,date,timeadj,hours,minutes,mode]
    const req = new XMLHttpRequest();
    req.open("POST","/submit_application");
    req.onreadystatechange = function(res){
      if (req.readyState == 4 && req.status == 200){
        var code = req.responseText
        if (code == "!"){
          document.getElementById("message").innerHTML = "Sorry, there was an error creating your game. If your game has a start date and time in the past, please change this.";
        }
        else{
          document.getElementById("message").innerHTML = "Your game is being created, access it with the code '" + code + "'. Enjoy!";
          document.getElementById("go").remove();
        }
      }
    }
    req.send(data)
  }
}
