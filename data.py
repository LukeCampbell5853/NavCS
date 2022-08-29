import sqlite3
from random import randint as r
from datetime import datetime,timedelta

#Class containing all the database stuff
class database:
  def __init__(self):
    #Connect to the database
    self.con = sqlite3.connect("game_data.db")
    self.c = self.con.cursor()

    #Check if the table 'players' exists
    self.c.execute("SELECT count(name) FROM sqlite_master WHERE type='table' AND name='players'")
    if not self.c.fetchone()[0]==1:
      #Creating the table 'players'
      self.con.execute("CREATE TABLE players (id,name,game,targets,location,score,last_contact)")

    #Check if the table 'games' exists
    self.c.execute("SELECT count(name) FROM sqlite_master WHERE type='table' AND name='games'")
    if not self.c.fetchone()[0]==1 :
      #Creating the table 'games'
      self.con.execute("CREATE TABLE games (start,duration,code,mode)")

  #Delete old players and games
  def clean_up(self):
    #Get data for games
    self.c.execute("SELECT code,start,duration FROM games")
    #Loop through data for games
    for code,start,duration in self.c.fetchall():
      #Calculate end time
      finish = datetime.strptime(start,"%d/%m/%Y %H:%M:%S") + timedelta(hours=duration) + timedelta(minutes=10)
      if finish < datetime.now():
        #Delete game
        self.c.execute("DELETE FROM games WHERE code=?",(code,))

    #Get data for players
    self.c.execute("SELECT id,last_contact FROM players")
    #Loop through data for players
    for code,last_contact in self.c.fetchall():
      #Calculate end time
      finish = datetime.strptime(last_contact,"%d/%m/%Y %H:%M:%S")+ timedelta(minutes=10)
      if finish < datetime.now():
        #Delete player
        self.c.execute("DELETE FROM players WHERE id=?",(code,))
        

  #Commit new data to the database
  def update(self):
    self.con.commit()

  #End connection to the database
  def end_query(self):
    self.con.close()

#Return a list of all game codes
def all_games():
  #Connect to database
  db = database()
  #Get data
  db.c.execute("SELECT code FROM games")
  output = []
  #Loop through data
  for code in db.c.fetchall():
    output.append(code[0])
  #End connection
  db.end_query()
  return(output)

#Returning a list of all players
def all_players():
  #Get data
  db = database()
  db.c.execute("SELECT id FROM players")
  output = []
  #Loop through data
  for code in db.c.fetchall():
    output.append(code[0])
  #Close connection
  db.end_query()
  return(output)

#Generate unique code
def new_code(set):
  c = "abcdefghijklmnopqrstuvwxyz"
  #Generate a code
  code = c[r(0,25)] + c[r(0,25)] + c[r(0,25)] + c[r(0,25)]
  timeout = 0
  #Make sure it's unique
  while code in set and timeout < 100:
    code = c[r(0,25)] + c[r(0,25)] + c[r(0,25)] + c[r(0,25)]
  return(code)

#Register a new game
def new_game(start,duration,mode):
  code = new_code(all_games())
  #Set up database connection
  db = database()
  db.clean_up()
  db.update()
  #Insert row
  db.c.execute("INSERT INTO games (start,duration,code,mode) VALUES (?,?,?,?)",(start,duration,code,mode))
  #Update and close connection
  db.update()
  db.end_query()
  t_game = game(code)
  return(t_game)

#Game object
class game:
  #Open the game object
  def __init__(self,code):
    #Connect to the database
    db = database()
    #Get the data for the game
    db.c.execute("SELECT * FROM games WHERE code=?",(code,))
    #Save the data for the game
    self.start,self.duration,self.code,self.mode = db.c.fetchone()
    #Proccess the data
    self.start_obj = datetime.strptime(self.start,"%d/%m/%Y %H:%M:%S")
    #Add some more data
    self.finish_obj = self.start_obj + timedelta(hours=self.duration)
    self.started = self.start_obj < datetime.now()
    self.finished = self.finish_obj < datetime.now()
    db.c.execute("SELECT id FROM players WHERE game=?",(code,))
    self.players = []
    for player in db.c.fetchall():
      self.players.append(player[0])
    db.end_query()

#Register a new player
def new_player(name,game):
  id = new_code(all_players())
  #Connect to the database
  db = database()
  #Get the current time to update the 'last contact'
  last_contact = datetime.strftime(datetime.now(),"%d/%m/%Y %H:%M:%S")
  #Insert into the database
  db.c.execute("INSERT INTO  players (id,name,game,targets,location,score,last_contact) VALUES (?,?,?,?,?,?,?)",(id,name,game,"",False,0,last_contact))
  #Save and close connection
  db.update()
  db.end_query()
  t_player = player(id)
  return(t_player)
  
#Player object
class player:
  #Open the player object
  def __init__(self,code):
    #Connect to the database
    db = database()
    #Get the data
    db.c.execute("SELECT * FROM players WHERE id=?",(code,))
    #Save the data
    self.code,self.name,self.game,targets,location,self.score,self.last_contact = db.c.fetchone()
    #Proccess the data
    if len(targets) != 0:
      self.targets = targets.split(";")
    else:
      self.targets = []
    if location:
      self.lat,self.long = location.split(",")
    else:
      self.lat,self.long = 0,0
    #Close connection

    db.c.execute("SELECT id,targets FROM players WHERE game=?",(self.game,))
    self.chasers = []
    for player in db.c.fetchall():
      if self.code in player[1]:
        self.chasers.append(player[0])
    db.end_query()

  def update(self,targets = False, lat = False, long=False, score = False):
    if targets:
      self.targets = targets
    if lat:
      self.lat = lat
    if long:
      self.long = long
    if score:
      self.score = score
    
    target_str = ";".join(self.targets)
    location_str = str(self.lat) + "," + str(self.long)
    last_contact = datetime.strftime(datetime.now(),"%d/%m/%Y %H:%M:%S")
    data = [self.code,self.name,self.game,target_str,location_str,self.score,last_contact]
    
    db = database()
    db.c.execute("DELETE FROM players WHERE id=?",(self.code,))
    db.c.execute("INSERT INTO players (id,name,game,targets,location,score,last_contact) VALUES(?,?,?,?,?,?,?)",data)
    db.update()
    db.end_query()