import database_manager as db_man
import sqlite3
from random import randint as r

class HideAndSeek:
  def __init__(self,ip):
    db = db_man.init_SQL()
    self.code = db_man.get_code(db,ip)
    self.ip = ip
    self.players = {}
    db = db_man.init_SQL()
    for player in db_man.get_players(db,self.code):
      data = {}
      data["name"] = player[1]
      data["target"] = player[2]
      data["location"] = player[3]
      data["score"] = player[4]
      self.players[player[0]] = data

  def assigned(self):
    result = False
    for player in self.players:
      print(player)
      if player["target"] != "-":
        result = True
        break
    return(result)

  def assign_targets(self):
    all_players = list(self.players.keys())
    seeker = all_players[r(0,len(all_players)-1)]
    hiders = all_players
    hiders.remove(seeker)
    self.players[seeker][target] = hiders
    db = db_man.init_SQL()
    db_man.update_targets(db,seeker,hiders)
