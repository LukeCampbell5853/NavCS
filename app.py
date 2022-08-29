from flask import *
from datetime import datetime,timedelta
import data_manager as db
import database_manager as db_man
import modes
import os

#Set up Flask app
app = Flask(__name__, static_url_path='/static')

#Start page
@app.route("/")

def index():
  return(render_template("home.html"))

#Page for players to join a game
@app.route("/join")

def join():
  return(render_template("join.html", message="Please enter your details to join a game:"))

@app.route("/connect",methods=["POST"])

def connect():
  name,code = str(request.data).strip("b").strip("'").split(",")
  code = code.lower()
  
  success = False
  error = "[unknown error]"
  
  if code in db.all_games():
    game = db.game(code)
    if not game.started and not game.finished:
      me = db.new_player(name,code)
      return(me.code)
    elif game.started:
      return("2")
    elif game.started:
      return("3")
    else:
      return("4")
  else:
    return("1")

@app.route("/create")

def create():
  return(render_template("create.html"))

@app.route("/submit_application", methods=["POST","GET"])

def submit_application():
  data = request.data
  time,date,timeadj,hours,minutes,mode = str(data).strip("b").strip("'").split(",")
  H,M = [int(x) for x in time.split(":")]
  y,m,d = [int(x) for x in date.split("-")]
  start = db_man.time_object(0,M,H,d,m,y) + timedelta(minutes = int(timeadj))
  start_str = datetime.strftime(start,"%d/%m/%Y %H:%M:%S")
  duration = int(hours) + int(minutes)/60
  if start > datetime.now():
    game = db.new_game(start_str,duration,mode)
    return(game.code)
  else:
    return("!")

@app.route("/run")

def run():
  return(render_template("run.html"))

@app.route("/update_state", methods=["POST","GET"])

def update_state():
  mlat,mlong,id = str(request.data).strip("b").strip("'").split(",")
  mlat,mlong = float(lat),float(long)
  
  player = db.player(id)
  game = db.game(player.game)
  if game.started and not game.finished:
    player.update(lat = mlat, long = mlong)
    if player.mode == "HaS" or player.mode == "Tag":
      if player.mode == "HaS":
        program = modes.HideAndSeek(player)
      elif:
        program = modes.Tag(player)
      if not program.assigned():
        program.assign_targets()
      return(program.info)
    else:
      return("2") #Invalid game mode
  elif not game.started:
    return("3") #Game not started
  else:
    return("4") #Game finished

@app.route("/register_catch", methods=["POST","GET"])

def register_catch():
  id = str(request.data).strip("b").strip("'")
  
  db = db_man.init_SQL()
  game = db_man.get_code(db,id)
  game_state = db_man.game_running(db,game)
  if game_state:
    print("  >game exists")
    if game_state[0] and not game_state[1]:
      print("  >game is running")
      db_man.save(db)
      db = db_man.init_SQL()
      mode = db_man.get_mode(db,game)
      if mode == "HaS" or mode == "Tag":
        db_man.end_query(db)
        if mode == "HaS":
          print("  >game is 'hide and seek'")
          program = modes.HideAndSeek(id)
        else:
          print("  >game is 'tag'")
          program = modes.Tag(id)
        program.register_catch(id)
        print("  >registered game [exit]")
        return("5") #success
      else:
        print("  >invalid game mode [exit]")
        return("1") #invalid game mode
    elif not game_state[1]:
      print("  >game not started [exit]")
      return("2") #game not started
    else:
      db_man.end_query(db)
      print("  >game finished [exit]")
      return("3") #game finished
  else:
    db_man.end_query(db)
    print("  >game not found[exit]")
    return("4") #game not found

if __name__ == '__main__':
  port = int(os.environ.get("PORT", 5000))
  app.run(debug = True, port=port)
