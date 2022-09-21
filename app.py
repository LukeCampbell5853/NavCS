from flask import *
from datetime import datetime,timedelta
from backend import process,mode
import os

#Set up Flask app
app = Flask(__name__, static_url_path='/static')

#Start page
@app.route("/")

def index():
  return(render_template("home.html"))

#Go to create page
@app.route("/create")

def create():
  return(render_template("create.html"))

#Create a game
@app.route("/submit_application", methods=["POST","GET"])

def submit_application():
  data = request.data
  time,date,timeadj,hours,minutes,mode = str(data).strip("b").strip("'").split(",")
  H,M = [int(x) for x in time.split(":")]
  y,m,d = [int(x) for x in date.split("-")]
  duration = round(int(hours)+int(minutes)/60,2)
  print(duration)
  start = datetime(y,m,d,H,M) + timedelta(minutes = int(timeadj))
  
  msg = process.create_game(start,duration,mode)
  return(msg)

#Go to join page
@app.route("/join")

def join():
  return(render_template("join.html", message="Please enter your details to join a game:"))

#Add player to game
@app.route("/connect",methods=["POST"])

def connect():
  name,code = str(request.data).strip("b").strip("'").split(",")
  code = code.lower()
  
  msg = process.join_game(name,code)
  return(msg)

@app.route("/run")

def run():
  return(render_template("run.html"))

@app.route("/update_state", methods=["POST","GET"])

def update_state():
  lat,long,id = str(request.data).strip("b").strip("'").split(",")
  lat,long = float(lat),float(long)
  
  msg = process.update(lat,long,id)
  return(msg)
  
@app.route("/register_catch", methods=["POST","GET"])

def register_catch():
  id = str(request.data).strip("b").strip("'")
  
  process.register_catch(id)

@app.route("/finished")

def finished():
  id = str(request.data).strip("b").strip("'")
  content = process.top_players(id)
  
  return(render_template("finished.html",content=content))

if __name__ == '__main__':
  port = int(os.environ.get("PORT", 5000))
  app.run(debug = True, port=port)
