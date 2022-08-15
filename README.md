# NavCS
NavCS is a system which enables users to set up and play games such as hide and seek across entire cities using GPS. I'm making it with Flask and hosting on Heroku, and at the moment it is still very much in development (still getting it to the point where my team and I can use it to test and optimise different gamemodes) but hopefully it'll be ready to launch soonish.

At it's base the system will allow a user to create a game in their chosen mode and at their date/time of choice, then it will give them a code which they can send to their friends, then they can log in and the system will add them to a database. The website will then contact the server periodically to send it the locaiton of the player, and in return the server will send them the location of their target (depending on the game mode). When a player gets "tagged" by another player they will press a button on their website which will then add a point to the player who caught them, then give the player a new target.

If you're interested I'm afraid the code is very messy (I'll fix that soon), but hopefully it's not completely unreadably. The program is far from complete but we're hoping to get a skeleton product up and running soon (probably just one game mode, with no nice styling, and not yet optimised for the number of visitors we're expecting - not many but more than just us) so we can get onto game testing with our amazing volunteer testers :)

Thanks,
-NavCS team

p.s. the name NavCS probably wont stay for long, so if you want to search us up later we may not be using the name NavCS.
