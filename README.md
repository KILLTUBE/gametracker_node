# Gameserver Tracker

Supported games: 
 - Call Of Duty 2

Install:
 - Install nodejs
 - Import the `tracker.sql` into your MySQL database

		mysql -u some_user -p
		CREATE DATABASE tracker;
		GRANT ALL PRIVILEGES ON `tracker`.* to `some_user`@localhost;
		flush privileges;
		use tracker
		source /home/some_user/tracker/tracker.sql

 - run `tracker.sh` in a `screen` session
 - open up the `public_html` folder directly with `mod_userdir` or point a subdomain to that dir
 - fill in the MySQL config data into `config_example.js` and `public_html\config_example.php` and remove the `_example`

Live demo:
 - http://tracker.killtube.org
