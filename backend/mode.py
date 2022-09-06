from backend import data
from random import randint

valid_modes = ["HaS","Tag"]

class HaS:
  def __init__(self,player,game):
    self.player = player
    self.game = game
    self.players = []
    self.ids = []
    self.hiders = []
    self.seekers = []
    self.assigned = False
    for player in game.players:
      self.players.append(data.player(player))
      self.ids.append(player)
    for player in self.players:
      if player.targets == []:
        self.hiders.append(player.code)
      else:
        self.seekers.append(player.code)
        self.assigned = True
        
  def assign_targets(self):
    seeker_index = randint(0,len(self.ids)-1)
    seeker_id = self.ids[seeker_index]
    seeker = self.players[seeker_index]
    print("seeker:",seeker.name)
    self.hiders = self.ids
    self.hiders.remove(seeker_id)
    seeker.update(targets=self.hiders)

  def adjust_targets(self):
    if self.player.code in self.hiders:
      if len(self.hiders) > 1:
        self.hiders.remove(self.player.code)
        self.seekers.append(self.player.code)
        for seeker in self.seekers:
          seeker = data.player(seeker)
          seeker.update(targets=self.hiders)
        for hider in self.hiders:
          hider = data.player(hider)
          points = hider.score + 1
          hider.update(score=points)
      else:
        self.hiders = self.seekers
        self.seekers = [self.player.code]
        for hider in self.hiders:
          hider = data.player(hider)
          hider.update(targets=[""])
        self.player.update(targets = self.hiders)

  def get_info(self):
    objects = []
    targets = self.player.targets
    for target in targets:
      target = data.player(target)
      obj = {}
      obj["name"] = target.name
      obj["lat"] = target.lat
      obj["long"] = target.long
      objects.append(obj)
    if len(objects) > 0:
      msg = "You are a seeker.";
    else:
      msg = "You are a hider.";
    return({"players":objects,"msg":msg})

class Tag:
  def __init__(self,player,game):
    self.player = player
    self.game = game
    self.players = []
    self.ids = []
    self.assigned = False
    for player in game.players:
      self.players.append(data.player(player))
      self.ids.append(player)
    for player in self.players:
      if player.targets != []:
        self.assigned = True
        break
        
  def assign_targets(self):
    for i in range(0,len(self.ids)):
      player = data.player(self.ids[i])
      if i < len(self.ids)-1:
        target = self.ids[i+1]
      else:
        target = self.ids[0]
      player.update(targets = [target])
  
  def adjust_targets(self):
    me = self.player
    for chaser in me.chasers:
      player = data.player(chaser)
      new_target = self.ids[randint(0,len(self.players)-1)]
      points = player.score
      timeout = 0
      while (new_target == chaser or new_target == data.player(chaser).targets[0]) and timeout < 10:
        new_target = self.ids[randint(0,len(self.players)-1)]
        timeout += 1
      player.update(targets=[new_target],score=points)
  
  def get_info(self):
    objects = []
    targets = self.player.targets
    for target in targets:
      target = data.player(target)
      obj = {}
      obj["name"] = target.name
      obj["lat"] = target.lat
      obj["long"] = target.long
      objects.append(obj)
    name = data.player(self.player.targets[0]).name
    msg = "You are chasing " + name + "."
    return({"players":objects,"msg":msg})
