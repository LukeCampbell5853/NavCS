from datetime import datetime
from backend import data,mode

def create_game(start,duration,Imode):
  if start < datetime.now():
    return("1")#Game start set in the past
  elif not Imode in mode.valid_modes:
    return("2")#Invalid game mode
  else:
    start = datetime.strftime(start,"%d/%m/%Y %H:%M:%S")
    game = data.new_game(start,duration,Imode)
    return(game.code)

def join_game(name,code):
  if code in data.all_games():
    game = data.game(code)
    if not game.started:
      me = data.new_player(name,code)
      return(me.code)
    else:
      return("2")#Game started
  else:
    return("1")#Invalid game code 

def update(Ilat,Ilong,id):
  me = data.player(id)
  me.update(lat = Ilat,long = Ilong)
  if me.game in data.all_games():
    game = data.game(me.game)
    if game.started and not game.finished:
      if game.mode == "HaS":
        program = mode.HaS(me,game)
      elif game.mode == "Tag":
        program = mode.Tag(me,game)
      else:
        return("1")
      if not program.assigned:
        program.assign_targets()
        print("ASSIGNING TARGETS")
      info = program.get_info()
      return(info)
    else:
      return("2")#Game not running
  else:
    return("1")#Game not found

def register_catch(id):
  me = data.player(id)
  game = data.game(me.game)
  if game.started and not game.finished:
    if game.mode == "HaS":
      program = mode.HaS(me,game)
    elif game.mode == "Tag":
      program = mode.Tag(me,game)
    program.adjust_targets()
