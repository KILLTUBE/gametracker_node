-- phpMyAdmin SQL Dump
-- version 3.3.2deb1ubuntu1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jun 28, 2015 at 08:07 PM
-- Server version: 5.1.73
-- PHP Version: 5.3.2-1ubuntu4.29

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `tracker`
--

-- --------------------------------------------------------

--
-- Table structure for table `ip2country`
--

CREATE TABLE IF NOT EXISTS `ip2country` (
  `IP_FROM` bigint(20) unsigned NOT NULL,
  `IP_TO` bigint(20) unsigned NOT NULL,
  `COUNTRY_CODE2` char(2) NOT NULL,
  PRIMARY KEY (`IP_FROM`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `player_lists`
--

CREATE TABLE IF NOT EXISTS `player_lists` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) NOT NULL DEFAULT '0',
  `is_public` int(11) DEFAULT NULL,
  `last_visit` int(11) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `server_ids` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`name`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=66 ;

-- --------------------------------------------------------

--
-- Table structure for table `servers`
--

CREATE TABLE IF NOT EXISTS `servers` (
	`id` INT(10) NOT NULL AUTO_INCREMENT,
	`ip` CHAR(15) NULL DEFAULT NULL,
	`port` INT(10) NULL DEFAULT NULL,
	`time_added` BIGINT(20) NULL DEFAULT NULL,
	`last_actualize` BIGINT(10) NULL DEFAULT NULL,
	`status` TEXT NULL,
	`game` VARCHAR(10) NULL DEFAULT NULL,
	`map` VARCHAR(32) NULL DEFAULT NULL,
	`hostname` VARCHAR(512) NULL DEFAULT NULL,
	`gametype` VARCHAR(32) NULL DEFAULT NULL,
	`fs_game` VARCHAR(32) NULL DEFAULT NULL,
	`players` INT(11) NULL DEFAULT NULL,
	`max_players` INT(11) NULL DEFAULT NULL,
	`private_players` INT(11) NULL DEFAULT NULL,
	`average_ping` INT(11) NULL DEFAULT NULL,
	`version` VARCHAR(10) NULL DEFAULT NULL,
	`hostname_nocolor` VARCHAR(512) NULL DEFAULT NULL,
	`protocol` VARCHAR(10) NULL DEFAULT NULL,
	`password` INT(11) NULL DEFAULT NULL,
	`anticheat` INT(11) NULL DEFAULT NULL,
	`server_ping` INT(11) NULL DEFAULT NULL,
	`rank_sum_players` BIGINT(20) NULL DEFAULT '0',
	`rank_sum_counts` BIGINT(20) NULL DEFAULT '0',
	`rank_last_update` INT(11) NULL DEFAULT '0',
	`rank` INT(11) NULL DEFAULT NULL,
	`country` VARCHAR(2) NULL DEFAULT NULL,
	PRIMARY KEY (`id`),
	UNIQUE KEY `ip` (`ip`,`port`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=381433 ;

-- --------------------------------------------------------

--
-- Table structure for table `servers_debug`
--

CREATE TABLE IF NOT EXISTS `servers_debug` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `ip` char(15) DEFAULT NULL,
  `port` int(10) DEFAULT NULL,
  `time_added` bigint(20) DEFAULT NULL,
  `last_actualize` bigint(10) DEFAULT NULL,
  `status` text,
  `game` varchar(10) DEFAULT NULL,
  `map` varchar(32) DEFAULT NULL,
  `hostname` varchar(100) DEFAULT NULL,
  `gametype` varchar(32) DEFAULT NULL,
  `fs_game` varchar(32) DEFAULT NULL,
  `players` int(11) DEFAULT NULL,
  `max_players` int(11) DEFAULT NULL,
  `average_ping` int(11) DEFAULT NULL,
  `version` varchar(10) DEFAULT NULL,
  `hostname_nocolor` varchar(100) DEFAULT NULL,
  `protocol` varchar(10) DEFAULT NULL,
  `password` int(11) DEFAULT NULL,
  `anticheat` int(11) DEFAULT NULL,
  `server_ping` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ip` (`ip`,`port`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1460 ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name_color` varchar(32) DEFAULT NULL,
  `name_login` varchar(32) DEFAULT NULL,
  `mail` varchar(32) DEFAULT NULL,
  `pass` varchar(32) DEFAULT NULL,
  `time_of_register` int(11) DEFAULT NULL,
  `ip` varchar(15) DEFAULT NULL,
  `time_of_activation` int(11) DEFAULT NULL,
  `is_activated` int(11) DEFAULT NULL,
  `activation_code` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_login` (`name_login`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=100 ;

-- --------------------------------------------------------

--
-- Table structure for table `user_sessions`
--

CREATE TABLE IF NOT EXISTS `user_sessions` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `key` varchar(16) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `time_of_creation` int(11) DEFAULT NULL,
  `time_of_last_usage` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key` (`key`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=184 ;
