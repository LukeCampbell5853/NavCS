import database_manager as db_man
import sqlite3
from random import randint as r

class HideAndSeek:
  def __init__(self,ip):
    print("+++RUNNING HideAndSeek __init__+++")
    db = db_man.init_SQL()
    self.code = db_man.get_code(db,ip)
    self.ip = ip
    self.players = {}
    print(self.code)
    for player in db_man.get_players(db,self.code):
      print(player)
      data = {}
      data["name"] = player[1]
      data["target"] = player[2]
      data["location"] = player[3]
      data["score"] = player[4]
      self.players[player[0]] = data
  print("---END FUNCTION---")

  def assigned(self):
    print("+++RUNNING HideAndSeek assigned+++")
    result = False
    for player,data in self.players.items():
      print("printing player [v]")
      print(player)
      print(data)
      if data["target"] != "-":
        result = True
        break
    print("---END FUNCTION---")
    return(result)

  def assign_targets(self):
    print("+++RUNNING HideAndSeek assign_targets+++")
    all_players = list(self.players.keys())
    print("ALL PLAYERS [v]")
    print(all_players)
    seeker = all_players[r(0,len(all_players)-1)]
    print("SEEKER [v]")
    print(seeker)
    hiders = all_players
    hiders.remove(seeker)
    print("HIDERS [v]")
    print(hiders)
    self.players[seeker]["target"] = hiders
    db = db_man.init_SQL()
    print("updating data [v]")
    print(self.players[seeker])
    db_man.update_targets(db,seeker,hiders)
    db_man.save(db)
    print("---END FUNCTION---")
