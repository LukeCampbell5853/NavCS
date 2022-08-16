from datetime import datetime as dt
from datetime import timedelta
import sqlite3
from random import randint as r

def time_string(s,m,h,D,M,Y):
  v = []
  for i in [D,M,Y,h,m,s]:
    if i == Y:
      v.append(str(i).zfill(4))
    else:
      v.append(str(i).zfill(2))
  return(f"{v[0]}/{v[1]}/{v[2]} {v[3]}:{v[4]}:{v[5]}")

def time_object(s,m,h,D,M,Y):
  string = time_string(s,m,h,D,M,Y)
  time = dt.strptime(string,"%d/%m/%Y %H:%M:%S")
  return(time)

#(ip,name,game,target,location,score)
class player:
  def __init__(self,ip,name,code):
    self.ip = ip
    self.name = name
    self.code = code
    self.score = 0
    self.update = dt.now().strftime("%d/%m/%Y %H:%M:%S")
  
  def register(self,package):
    c,con = package
    data = (self.ip,self.name,self.code,"-","-",0,self.update)
    print("data:",data)
    c.execute("INSERT INTO players (ip,name,game,target,location,score,last_contact) VALUES(?,?,?,?,?,?,?)",data)

class game:
  def __init__(self,start,duration,code,mode):
    self.duration = round(duration,3)
    self.code = code
    self.mode = mode
    self.start = start

  def register(self,package):
    c,con = package
    data = (self.start,self.duration,self.code,self.mode)
    c.execute("INSERT INTO games (start,duration,code,mode) VALUES(?,?,?,?)",data)

def init_SQL():
  con = sqlite3.connect("NavCS_database.db")
  c = con.cursor()
  return((c,con))

def end_query(package):
  c,con = package
  c.close()
  
def confirm_tables(package):
  c,con = package
  #Ensure table [locations] exists
  c.execute("SELECT count(name) FROM sqlite_master WHERE type='table' AND name='players'")
  if not c.fetchone()[0]==1: 
  	con.execute("CREATE TABLE players (ip,name,game,target,location,score,last_contact)")

  #Ensure table [games] exists
  c.execute("SELECT count(name) FROM sqlite_master WHERE type='table' AND name='games'")
  if not c.fetchone()[0]==1 : 
  	con.execute("CREATE TABLE games (start,duration, code,mode)")

def game_running(package,code):
  c,con = package
  game_exists = False
  game_started = False
  game_ended = False
  c.execute("SELECT * FROM games")
  for data in c.fetchall():
    if data[2] == code:
      game_exists = True
      break
  if game_exists:
    game = get_game(package,code)

    start = dt.strptime(game.start,"%d/%m/%Y %H:%M:%S")

    end = start + timedelta(hours=game.duration)
    now = dt.now()

    if is_before(start,now):
      game_started = True
    else:
      game_started = False
    if is_before(end,now):
      game_ended = True
    else:
      game_ended = False
    return((game_started,game_ended))
  else:
    return(False)  

def get_game(package,code):
  c,con = package
  c.execute("SELECT * FROM games WHERE code=?",(code,))
  data = c.fetchone()
  object = game(data[0],data[1],data[2],data[3])
  return(object)
  
def reset_games(package):
  c,con=package
  c.execute("DROP TABLE games")
  con.execute("CREATE TABLE games (start,duration, code,mode)")

def reset_players(package):
  c,con=package
  c.execute("DROP TABLE players")
  con.execute("CREATE TABLE players (ip,name,start,game,target,location,score,last_contact)")

def save(package):
  c,con = package
  con.commit()
  con.close()

def generate_code():
  chars = "abcdefghijklmnopqrstuvwxyz"
  code = ""
  for i in range(0,4):
    code += chars[r(0,25)]
  return(code)

def is_before(time1,time2):
  order1 = [time1.year,time1.month,time1.day,time1.hour,time1.minute,time1.second]
  order2 = [time2.year,time2.month,time2.day,time2.hour,time2.minute,time2.second]
  if order1 < order2:
    return(True)
  else:
    return(False)

def get_codes(package):
  c,con = package
  c.execute("SELECT code FROM games")
  data = []
  for i in c.fetchall():
    try:
      data.append(i[0])
    except:
      data.append(i)
  return(data)

def ip_already_in(package,ip):
  c,con = package
  c.execute("SELECT ip FROM players WHERE ip=?",(ip,))
  if len(c.fetchall())>0:
    return(True)
  else:
    return(False)

def maintain_db(package):
  c,con = package
  confirm_tables(package)
  del_codes = []
  c.execute("SELECT code,start,duration FROM games")
  for game in c:
    start = dt.strptime(game[1],"%d/%m/%Y %H:%M:%S")
    cancel_time = start + timedelta(hours=game[2]) + timedelta(minutes=10)
    if is_before(cancel_time,dt.now()):
      del_codes.append(game[0])
  for code in del_codes:
    c.execute("DELETE FROM games WHERE code=?",(code,))

  c.execute("SELECT ip, last_contact FROM players")
  for player in c:
    cancel_time = dt.strptime(player[1],"%d/%m/%Y %H:%M:%S") + timedelta(minutes = 10)
    if is_before(cancel_time,dt.now()):
      c.execute("DELETE FROM players WHERE ip=?",(player[0],))
  
  record = open("last_check.txt","w")
  record.write(dt.strftime(dt.now(),"%d/%m/%Y %H:%M:%S"))
  record.close()

def scan_needed():
  next_scan = dt.strptime(open("last_check.txt","r").read(),"%d/%m/%Y %H:%M:%S") + timedelta(minutes=10)
  return(is_before(next_scan,dt.now()))

def update_location(package,ip,location):
  c,con = package
  try:
    c.execute("SELECT * FROM players WHERE ip=?",(ip,))
    data = c.fetchone()
    time= dt.strftime(dt.now(),"%d/%m/%Y %H:%M:%S")
    data = [data[0],data[1],data[2],data[3],location,data[5],time]
    c.execute("DELETE FROM players WHERE ip=?",(ip,))
    c.execute("INSERT INTO players (ip,name,game,target,location,score,last_contact) VALUES(?,?,?,?,?,?,?)",data)
  except:
    pass

def get_code(package,ip):
  c,con = package
  c.execute("SELECT game FROM players WHERE ip=?",(ip,))
  try:
    code = c.fetchone()[0]
  except:
    code = c.fetchone()
  return(code)

def get_mode(package,code):
  c,con = package
  c.execute("SELECT mode FROM games WHERE code=?",(code,))
  return(c.fetchone()[0])

def get_players(package,code):
  c,con = package
  c.execute("SELECT ip,name,target,location,score FROM players WHERE game=?",(code,))
  return(c.fetchall())

#(ip,name,start,game,target,location,score,last_contact)
def update_targets(package,ip,targets):
  
  target_string = ""
  for target in targets:
    target_string += target + ";"
  targets = target_string[:-1]
  
  c,con = package
  c.execute("SELECT * FROM players WHERE ip=?",(ip,))
  ip,name,game,target,location,score,last_contact = c.fetchone()
  c.execute("DELETE FROM players WHERE ip=?",(ip,))
  c.execute("INSERT INTO players (ip,name,game,target,location,score,last_contact) VALUES(?,?,?,?,?,?,?)",(ip,name,game,targets,location,score,last_contact))

def get_player_data(package,ip):
  c,con = package
  c.execute("SELECT * FROM players WHERE ip=?",(ip,))

def get_target_locations(package,id):
  print("Getting target locations for player: " + id)
  c,con = package
  c.execute("SELECT target FROM players WHERE ip=?",(id,))
  try:
    targets = c.fetchone()[0]
    print("- got with index selection")
  except:
    targets = c.fetchone()
    print("- got without index selection")
  print("- unprocessed targets: " + targets)
  data = []
  if targets == "-":
    print("- no targets for this player")
  else:
    print("- targets for this player: ")
    for target in targets.split(";"):
      c.execute("SELECT name,location FROM players WHERE ip=?",(target,))
      name,location = c.fetchone()
      lat,long = [float(x) for x in location.split(",")]
      data.append([target,(lat,long)])
  return(data)
