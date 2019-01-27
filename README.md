# gametracker

Supported game servers:

 - Call Of Duty 2

Install:

 - Install nodejs and npm

		apt-get install nodejs
		apt-get install libssl1.0-dev
		apt-get install nodejs-dev
		apt-get install node-gyp
		apt-get install npm
		npm update
		npm upgrade

 - Import the `tracker.sql` into your MySQL database

		mysql -u some_user -p
		CREATE DATABASE gametracker;
		GRANT ALL PRIVILEGES ON `gametracker`.* to `some_user`@localhost;
		FLUSH PRIVILEGES;
		USE gametracker;
		source /home/some_user/tracker/tracker.sql

 - Fill in the MySQL config data into `config.ts` and

 - Run `doit_start_gametracker.sh` in a `screen` session

Live demo:

 - http://tracker.killtube.org
