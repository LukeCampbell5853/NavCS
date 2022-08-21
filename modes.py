import database_manager as db_man
import sqlite3
from random import randint as r

class HideAndSeek:
  def __init__(self,ip):
    db = db_man.init_SQL()
    self.code = db_man.get_code(db,ip)
    self.ip = ip
    self.players = {}
    for player in db_man.get_players(db,self.code):
      data = {}
      data["name"] = player[1]
      data["target"] = player[2]
      data["location"] = player[3]
      data["score"] = player[4]
      self.players[player[0]] = data
    db_man.end_query(db)

  def assigned(self):
    result = False
    for player,data in self.players.items():
      if data["target"] != "-":
        result = True
        break
    return(result)

  def assign_targets(self):
    all_players = list(self.players.keys())
    seeker = all_players[r(0,len(all_players)-1)]
    hiders = all_players
    hiders.remove(seeker)
    self.players[seeker]["target"] = hiders
    db = db_man.init_SQL()
    db_man.update_targets(db,seeker,hiders)
    db_man.save(db)
  
  def register_catch(self,id):
    print("     -REGISTERING CATCH FOR PLAYER [" + id + "]")
    db = db_man.init_SQL()
    hiders = []
    seekers = []
    all_players = db_man.get_players(db,self.code)
    all_ids = []
    for player in all_players:
      player_id = player[0]
      player_targets = player[2]
      print("     -targets of ["+ player_id + "] are " + str(player_targets))
      if player_targets != "-":
        seekers.append(player_id)
        all_ids.append(player_id)
        print("     -[" + player_id + "] is a seeker.")
      elif player_id == id:
        seekers.append(id)
        all_ids.append(id)
        print("     -[" + player_id + "] is becoming a seeker.")
      else:
        hiders.append(player_id)
        all_ids.append(player_id)
        print("     -[" + player_id + "] is a hider.")
    if len(hiders) > 0:
      for seeker in seekers:
        print("     -player [" + seeker + "] is a seeker chasing hiders " + str(hiders))
        db_man.update_targets(db,seeker,hiders)
    else:
      print("     -no hiders left, reassigning")
      print(all_ids)
      hiders = all_ids.remove(id)
      db_man.update_targets(db,id,hiders)
      for hider in hiders:
        print("     -removing targets for [" + hider + "]")
        db_man.update_targets(db,hider,"-")
    db_man.save(db)
    print("     -finished [back to main]")
