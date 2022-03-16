-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.18-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             11.2.0.6213
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for softboundv1
CREATE DATABASE IF NOT EXISTS `softboundv1` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */;
USE `softboundv1`;

-- Dumping structure for table softboundv1.accounts
CREATE TABLE IF NOT EXISTS `accounts` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Email` varchar(120) DEFAULT NULL,
  `Name` varchar(120) DEFAULT NULL,
  `Password` varchar(45) DEFAULT NULL,
  `PinUser` int(5) NOT NULL,
  `Salt` varchar(10) DEFAULT NULL,
  `Session` varchar(45) DEFAULT NULL,
  `views` int(10) DEFAULT 0,
  `IsOnline` int(11) DEFAULT NULL,
  `Birthday` timestamp NULL DEFAULT NULL,
  `facebook_id` varchar(70) DEFAULT '0',
  `Username` varchar(50) DEFAULT NULL,
  `IP` varchar(45) NOT NULL DEFAULT '0.0.0.0',
  `Name2` varchar(150) DEFAULT NULL,
  `no_win_bonus` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '{}',
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Username_UNIQUE` (`Username`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8;

-- Dumping data for table softboundv1.accounts: ~39 rows (approximately)
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` (`Id`, `Email`, `Name`, `Password`, `PinUser`, `Salt`, `Session`, `views`, `IsOnline`, `Birthday`, `facebook_id`, `Username`, `IP`, `Name2`, `no_win_bonus`) VALUES
	(1, '', 'Sr.Informatico', 'katia70374302', 7754, ':', '1e3d158da20cf010dbdef05474c80611', 41, 1, '2021-03-20 21:02:27', '0', 'Sr Informatico', '127.0.0.1', NULL, '{}'),
	(3, '', 'LaJefa', 'merida8000', 1963, ':', '218251d1955e731c89d72d8a3a900e76', 2, 0, '2021-03-20 21:35:42', '0', 'LaJefa', '190.217.1.146', NULL, '{}'),
	(4, '', '*Delicia*', 'adrijoaquin', 2525, ':', '185f642514aa86c446a84a8627c0618e', 4, 0, '2021-03-21 01:10:53', '0', '*Delicia*', '190.42.16.146', NULL, '{}'),
	(5, '', 'Estrella', 'estrella', 9999, ':', '10e4a7f5046e96634687cad57c158e25', 1, 0, '2021-03-21 01:17:27', '0', 'Estrella', '190.237.172.114', NULL, '{}'),
	(6, '', 'Dios', '70116696crch14', 1437, ':', 'ba16a45bc9b054e56af328e69997f311', 2, 0, '2021-03-21 01:24:35', '0', 'Dios', '179.6.43.51', NULL, '{}'),
	(7, '', 'StoneCold', '1234abcd', 1111, ':', '78b6e9a684f4878c7d12688616576a73', 0, 0, '2021-03-21 04:00:49', '0', 'StoneCold', '190.235.15.213', NULL, '{}'),
	(8, '', 'ghosito123', 'jairo07neira', 1234, ':', 'aeac85c3373a7fcbbfc465377070cb2e', 0, 0, '2021-03-22 04:23:55', '0', 'ghosito123', '179.7.193.197', NULL, '{}'),
	(9, '', 'Mamentl', 'gogo', 1234, ':', '36beea33fa835bd18f34e6206dc6e22e', 1, 0, '2021-03-22 06:17:09', '0', 'Mamentl', '179.6.78.61', NULL, '{}'),
	(10, '', 'fghfdg', 'hfghgfh', 7754, ':', '1b7fc0045292f2a0b2cfbe594c5484cb', 0, 0, '2021-03-22 13:47:17', '0', 'fghfdg', '190.235.15.213', NULL, '{}'),
	(11, '', 'gfhdfdg', 'fghfdhgfh', 6789, ':', '0528174ac155a025d9d78d066f1168c0', 0, 0, '2021-03-22 13:50:00', '0', 'gfhdfdg', '190.235.15.213', NULL, '{}'),
	(12, '', '213sadsad', 'sadewqr', 4234, ':', '817495d2eb50082ace77bf34537f69f9', 0, 0, '2021-03-22 15:02:54', '0', '213sadsad', '190.237.172.114', NULL, '{}'),
	(13, '', 'sdfc24234', 'sdfewwr', 4354, ':', '156dba519086347981d13b1c9fad9a0d', 0, 0, '2021-03-22 15:03:05', '0', 'sdfc24234', '190.237.172.114', NULL, '{}'),
	(14, '', 'Panda', 'panda123', 123, ':', '6b23342ac2c7705591c00e8a37e7ffb3', 0, 1, '2021-03-22 15:53:14', '0', 'Panda', '201.240.196.71', NULL, '{}'),
	(15, '', 'Anthony', 'chudan', 1234, ':', '9aa3ad73fcd05fc339dc59f6e982e8e5', 2, 0, '2021-03-22 16:19:52', '0', 'AnthonyYT', '127.0.0.1', NULL, '{}'),
	(16, '', 'Jhan', 'jhan', 1234, ':', 'ebf549939b40bdf126c8df9ce1216869', 0, 0, '2021-03-22 17:11:24', '0', 'Jhan', '190.237.11.72', NULL, '{}'),
	(17, '', '~*Luiss*~', '12345678910luiss', 2003, ':', 'a576557004d1b96d6f9e9ec9410b8803', 0, 0, '2021-03-22 17:11:30', '0', '~*Luiss*~', '200.48.84.159', NULL, '{}'),
	(18, '', 'Gambites', 'adkCy8sbRGdW7BA', 1234, ':', 'f7316572b6bdf4ef9105503b366ecb19', 0, 0, '2021-03-22 17:16:43', '0', 'Gambites', '181.64.18.22', NULL, '{}'),
	(19, '', 'Phoenix7', '678dfg56', 8963, ':', '855918349ca76a579470e12794fa2e90', 0, 0, '2021-03-22 17:58:04', '0', 'Phoenix7', '177.53.153.82', NULL, '{}'),
	(20, '', 'RicardoColomo', 'Goku', 1111, ':', 'c7a78d4a70cef5a09a86093513dcdf55', 0, 0, '2021-03-22 18:02:54', '0', 'RicardoColomo', '181.54.33.231', NULL, '{}'),
	(21, '', 'anarquico', 'servermin', 2341, ':', 'f0e9e2810bcc9769c59a8cace6123b49', 0, 0, '2021-03-22 18:10:23', '0', 'anarquico', '190.237.153.244', NULL, '{}'),
	(22, '', 'ColomoPro', 'Goku', 1111, ':', '52bc4d99b5a01eed4482539413e0c4a4', 1, 0, '2021-03-22 18:37:52', '0', 'ColomoPro', '127.0.0.1', NULL, '{}'),
	(23, '', '5ytytyt', 'u7u77u', 1111, ':', 'e9844752d2eb2f890eb7c520d4716092', 0, 0, '2021-03-22 20:28:03', '0', '5ytytyt', '190.235.15.213', NULL, '{}'),
	(24, '', 'luiss', 'luissja7894ja', 1818, ':', 'f9cf66e5d808ea263b0b318fbfcaf57f', 1, 1, '2021-03-22 20:36:58', '0', 'luiss', '200.48.84.159', NULL, '{}'),
	(25, '', '#Mr~Emma*~', 'corazonj', 1919, ':', 'd9d4d9343b390437521dc75ddd59753b', 0, 0, '2021-03-22 20:37:55', '0', '12452', '200.48.84.159', NULL, '{}'),
	(26, '', '#Mr~Emma*~', 'corazonj', 2020, ':', '1c708dc0801d7f139de4a514f89d4d55', 0, 0, '2021-03-22 20:38:36', '0', '#Mr~Emma*~', '200.48.84.159', NULL, '{}'),
	(27, '', '▓Brayan~*', 'luissja7894ja', 2121, ':', '96855df226b5770ef6bc73a3fc674b67', 0, 0, '2021-03-22 20:39:31', '0', '▓Brayan~*', '200.48.84.159', NULL, '{}'),
	(28, '', '#Mr~Violeta*~', 'corazonj', 2222, ':', '94cc3d332a22d424046ea67fee7f7a1b', 0, 0, '2021-03-22 20:43:41', '0', '#Mr~Violeta*~', '200.48.84.159', NULL, '{}'),
	(29, '', 'Sr.UnLimited', 'srunlimited', 8888, ':', 'e6959e20a8fb29b97ad0012db6522c79', 0, 0, '2021-03-22 21:12:55', '0', 'Sr.UnLimited', '200.48.84.159', NULL, '{}'),
	(30, '', '~ICuCa4e', 'lucas123456789', 9999, ':', 'd271ee19b5c65c6c5f9442edb48d645a', 0, 0, '2021-03-22 21:13:23', '0', '~ICuCa4e', '200.48.84.159', NULL, '{}'),
	(31, '', 'evEr10', 'evercorazno', 5555, ':', '4ab457c668cb30858a9b158d4622b095', 0, 0, '2021-03-22 21:14:25', '0', 'evEr10', '200.48.84.159', NULL, '{}'),
	(32, '', 'anyBOT', 'assasinsur24', 2468, ':', 'f3d0aa784f3f4e66bb4ef3619fc8dd97', 0, 0, '2021-03-22 21:33:27', '0', 'anyBOT', '190.43.121.21', NULL, '{}'),
	(33, '', 'Gambites~DB', 'eliasppro7', 9807, ':', '4c49d77c4e0f8fbf42e8b06e0e48c833', 0, 0, '2021-03-22 23:13:26', '0', 'Gambites~DB', '181.64.18.22', NULL, '{}'),
	(34, '', 'Conejo!', 'marin10', 2403, ':', 'de17a6d5603e795837de50fd43adc491', 0, 0, '2021-03-23 01:04:08', '0', 'Conejo!', '190.217.14.186', NULL, '{}'),
	(35, '', 'Lucas', 'omar10', 1234, ':', '1bea768dbc082a679051a2bd5e185f9a', 0, 0, '2021-03-23 02:57:34', '0', 'Lucas', '127.0.0.1', NULL, '{}'),
	(36, '', 'ElMasNaki', 'naki', 1234, ':', 'df4456b26fc77d7639d35abe91424510', 0, 1, '2021-03-23 03:39:17', '0', 'ElMasNaki', '127.0.0.1', NULL, '{}'),
	(37, 'eddyrenatocasos@gmail.com', 'Eddy Renato Casós Gerónimo_4194925407184846', 'a2a088f1209a3680845205c664580b00', 7811, ':fbid:', '55ace7532fb10a1aec19a237c53abdda', 1, 0, '2021-03-23 05:08:29', '4194925407184846', NULL, '190.235.15.204', NULL, '{}'),
	(38, '', 'lucass', '12345s', 1234, ':', '6a781abeca11d6831f88551e0b1720db', 0, 0, '2021-03-23 12:53:10', '0', 'lucass', '127.0.0.1', NULL, '{}'),
	(39, '', 'Alidos20', 'teamftd', 1994, ':', '9750133928ac24e3906244733e7a1cd6', 0, 0, '2021-03-23 13:03:34', '0', 'Alidos20', '127.0.0.1', NULL, '{}'),
	(40, '', '~!Haku~', 'realmadrid', 1111, ':', '7e2e34f5af096756c0b971dd45d35d82', 0, 0, '2021-03-23 14:05:07', '0', '~!Haku~', '127.0.0.1', NULL, '{}'),
	(41, '', 'arom:V', 'Ps7ZrK66HTTatbM', 410, ':', '860ff0fbdf75d0fc907bb45d7bd8d740', 1, 0, '2021-03-23 15:33:48', '0', 'arom:V', '127.0.0.1', NULL, '{}'),
	(42, 'chudan34k@gmail.com', 'Anthony Chudan Crisanto_926518841219215', '9dd90bd12ccfa75c85bebd673ed14375', 9818, ':fbid:', '75eda6e35a54d774bac8316fa52b85e9', 0, 0, '2021-03-23 16:24:37', '926518841219215', NULL, '190.237.122.186', NULL, '{}');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;

-- Dumping structure for table softboundv1.account_sessions
CREATE TABLE IF NOT EXISTS `account_sessions` (
  `session_id` varchar(120) NOT NULL,
  `expires_time` varchar(80) DEFAULT NULL,
  `data_acc` varchar(400) DEFAULT NULL,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table softboundv1.account_sessions: ~85 rows (approximately)
/*!40000 ALTER TABLE `account_sessions` DISABLE KEYS */;
INSERT INTO `account_sessions` (`session_id`, `expires_time`, `data_acc`) VALUES
	('0CZ4KRJuK3yFbP-dP6qiQMJi39gsJ1q4', '1616602061', '{"cookie":{"originalMaxAge":86399996,"expires":"2021-03-24T16:07:41.138Z","secure":true,"httpOnly":true,"path":"/"},"account_id":41,"rank":0,"acc_session":"860ff0fbdf75d0fc907bb45d7bd8d740","game_id":"arom:V"}'),
	('1THBb32BSZbFcFzBxR_lBetvvzV3Zu_B', '1616534158', '{"cookie":{"originalMaxAge":86400000,"expires":"2021-03-23T21:15:57.926Z","secure":false,"httpOnly":true,"path":"/"},"account_id":31,"rank":0,"acc_session":"4ab457c668cb30858a9b158d4622b095","game_id":"evEr10"}'),
	('2BCQMxp8tQV2FJAWj0ziWAOwfbJ-2shO', '1616599770', '{"cookie":{"originalMaxAge":86399995,"expires":"2021-03-24T15:29:30.075Z","secure":false,"httpOnly":true,"path":"/"},"account_id":6,"rank":26,"acc_session":"ba16a45bc9b054e56af328e69997f311","game_id":"Dios"}'),
	('3B9nMbpXdGpbVN_BlVt17CV8I9IlmlbM', '1616524797', '{"cookie":{"originalMaxAge":86400000,"expires":"2021-03-23T18:39:56.613Z","secure":false,"httpOnly":true,"path":"/"},"account_id":22,"rank":0,"acc_session":"52bc4d99b5a01eed4482539413e0c4a4","game_id":"ColomoPro"}'),
	('abQMIYCu0vV2GVJhvBPDa6-8EGvlkqqw', '1616591884', '{"cookie":{"originalMaxAge":86399998,"expires":"2021-03-24T13:18:03.998Z","secure":true,"httpOnly":true,"path":"/"},"account_id":22,"rank":0,"acc_session":"52bc4d99b5a01eed4482539413e0c4a4","game_id":"ColomoPro"}'),
	('aoZMf7BSKj91jHsDBd7LWk_wmNOyf-qN', '1616606117', '{"cookie":{"originalMaxAge":86400000,"expires":"2021-03-24T17:15:17.223Z","secure":true,"httpOnly":true,"path":"/"},"account_id":1,"rank":31,"acc_session":"1e3d158da20cf010dbdef05474c80611","game_id":"Sr Informatico"}'),
	('c4SMNMXBziKlxCMzhX786vgSxlSqKbrx', '1616602193', '{"cookie":{"originalMaxAge":86400000,"expires":"2021-03-24T16:09:53.404Z","secure":false,"httpOnly":true,"path":"/"},"account_id":7,"rank":31,"acc_session":"78b6e9a684f4878c7d12688616576a73","game_id":"StoneCold"}'),
	('C9MqN7nrsdu4WPhikxO-VFjWzoDSsYgA', '1616547865', '{"cookie":{"originalMaxAge":86399998,"expires":"2021-03-24T01:04:25.450Z","secure":false,"httpOnly":true,"path":"/"},"account_id":34,"rank":0,"acc_session":"de17a6d5603e795837de50fd43adc491","game_id":"Conejo!"}'),
	('cOFHD151fLlqCBL9dvk2jeMRvA1_gmml', '1616531704', '{"cookie":{"originalMaxAge":86399997,"expires":"2021-03-23T20:35:03.832Z","secure":false,"httpOnly":true,"path":"/"},"account_id":23,"rank":0,"acc_session":"e9844752d2eb2f890eb7c520d4716092","game_id":"5ytytyt"}'),
	('FO4Q_jUhzm5QIutRUIVQA3U2B2CS8GzA', '1616519701', '{"cookie":{"originalMaxAge":86400000,"expires":"2021-03-23T17:15:00.865Z","secure":false,"httpOnly":true,"path":"/"},"account_id":16,"rank":0,"acc_session":"ebf549939b40bdf126c8df9ce1216869","game_id":"Jhan"}'),
	('GB7ApC1fOivtvqQyJTq0LhJHwpc8TNFI', '1616519362', '{"cookie":{"originalMaxAge":86399999,"expires":"2021-03-23T17:09:22.082Z","secure":false,"httpOnly":true,"path":"/"},"account_id":5,"rank":0,"acc_session":"10e4a7f5046e96634687cad57c158e25","game_id":"Estrella"}'),
	('HZU6z1jbi5Qx5G46Me9pWapHVDlb2Med', '1616535499', '{"cookie":{"originalMaxAge":86399992,"expires":"2021-03-23T21:38:19.116Z","secure":false,"httpOnly":true,"path":"/"},"account_id":32,"rank":0,"acc_session":"f3d0aa784f3f4e66bb4ef3619fc8dd97","game_id":"anyBOT"}'),
	('i6Z_3FIErJn6H9TKuyXZwHPje6UYBe22', '1616602011', '{"cookie":{"originalMaxAge":86399998,"expires":"2021-03-24T16:06:51.109Z","secure":true,"httpOnly":true,"path":"/"},"account_id":40,"rank":0,"acc_session":"7e2e34f5af096756c0b971dd45d35d82","game_id":"~!Haku~"}'),
	('K7TwW2adxXvIEgcs_fOWSU9Tp3jMd8u_', '1616541529', '{"cookie":{"originalMaxAge":86399997,"expires":"2021-03-23T23:18:49.370Z","secure":false,"httpOnly":true,"path":"/"},"account_id":33,"rank":0,"acc_session":"4c49d77c4e0f8fbf42e8b06e0e48c833","game_id":"Gambites~DB"}'),
	('nIBKjfTGGntTa6hasc126ATpCFfKbdNm', '1616601331', '{"cookie":{"originalMaxAge":86399998,"expires":"2021-03-24T15:55:30.692Z","secure":true,"httpOnly":true,"path":"/"},"account_id":1,"rank":31,"acc_session":"1e3d158da20cf010dbdef05474c80611","game_id":"Sr Informatico"}'),
	('nmGQ4kMoFIa8bVkZyJ_HDJvzsPuOu4cM', '1616524093', '{"cookie":{"originalMaxAge":86399998,"expires":"2021-03-23T18:28:13.470Z","secure":false,"httpOnly":true,"path":"/"},"account_id":21,"rank":0,"acc_session":"f0e9e2810bcc9769c59a8cace6123b49","game_id":"anarquico"}'),
	('nxAqUvoekf5lkAPfyH32ix_7X6uAclOo', '1616603186', '{"cookie":{"originalMaxAge":86399996,"expires":"2021-03-24T16:26:26.197Z","secure":true,"httpOnly":true,"path":"/"},"account_id":38,"rank":0,"acc_session":"6a781abeca11d6831f88551e0b1720db","game_id":"lucass"}'),
	('OmpAN4HXoexP2YdqSkt9fZHgZcDrLasJ', '1616536272', '{"cookie":{"originalMaxAge":86399993,"expires":"2021-03-23T21:51:12.092Z","secure":false,"httpOnly":true,"path":"/"},"account_id":24,"rank":0,"acc_session":"f9cf66e5d808ea263b0b318fbfcaf57f","game_id":"luiss"}'),
	('UgCU0btyA-c0HlRoD08NNSH4ADOKVGVq', '1616585272', '{"cookie":{"originalMaxAge":86399999,"expires":"2021-03-24T11:27:52.234Z","secure":false,"httpOnly":true,"path":"/"},"account_id":7,"rank":31,"acc_session":"78b6e9a684f4878c7d12688616576a73","game_id":"StoneCold"}'),
	('umUAQ0Hm_0HQMsd6JiemByNUsfDTVp9Q', '1616540540', '{"cookie":{"originalMaxAge":86400000,"expires":"2021-03-23T23:02:19.991Z","secure":false,"httpOnly":true,"path":"/"},"account_id":19,"rank":0,"acc_session":"855918349ca76a579470e12794fa2e90","game_id":"Phoenix7"}'),
	('v_o4e9u9scT5BfVtQMEwItK0Ezxng-UT', '1616535529', '{"cookie":{"originalMaxAge":86400000,"expires":"2021-03-23T21:38:49.084Z","secure":false,"httpOnly":true,"path":"/"},"account_id":18,"rank":0,"acc_session":"f7316572b6bdf4ef9105503b366ecb19","game_id":"Gambites"}'),
	('WUzTo37SreJqZx8TQSbnas3uDnEP8e0e', '1616516253', '{"cookie":{"originalMaxAge":-3249254,"expires":"2021-03-23T16:17:33.340Z","secure":true,"httpOnly":true,"path":"/"}}'),
	('ZXyiVubtRReFvRaCTVB-MpVSpqccoU-4', '1616556246', '{"cookie":{"originalMaxAge":86399998,"expires":"2021-03-24T03:24:05.695Z","secure":false,"httpOnly":true,"path":"/"},"account_id":35,"rank":0,"acc_session":"1bea768dbc082a679051a2bd5e185f9a","game_id":"Lucas"}');
/*!40000 ALTER TABLE `account_sessions` ENABLE KEYS */;

-- Dumping structure for table softboundv1.acc_sessions
CREATE TABLE IF NOT EXISTS `acc_sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires_time` int(11) unsigned NOT NULL,
  `data_acc` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table softboundv1.acc_sessions: ~0 rows (approximately)
/*!40000 ALTER TABLE `acc_sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `acc_sessions` ENABLE KEYS */;

-- Dumping structure for table softboundv1.banned
CREATE TABLE IF NOT EXISTS `banned` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `UserId` int(11) NOT NULL,
  `razon` varchar(150) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `date` varchar(15) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `gm` varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `gm_id` int(11) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table softboundv1.banned: ~0 rows (approximately)
/*!40000 ALTER TABLE `banned` DISABLE KEYS */;
/*!40000 ALTER TABLE `banned` ENABLE KEYS */;

-- Dumping structure for table softboundv1.chat_reseller
CREATE TABLE IF NOT EXISTS `chat_reseller` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) NOT NULL,
  `reseller_sms` varchar(150) CHARACTER SET utf8 NOT NULL,
  `date_sms` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table softboundv1.chat_reseller: ~0 rows (approximately)
/*!40000 ALTER TABLE `chat_reseller` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_reseller` ENABLE KEYS */;

-- Dumping structure for table softboundv1.commands
CREATE TABLE IF NOT EXISTS `commands` (
  `Id` int(10) NOT NULL AUTO_INCREMENT,
  `comando` varchar(10) CHARACTER SET utf8 NOT NULL,
  `gift` int(10) NOT NULL,
  `cash` varchar(10) CHARACTER SET utf8 NOT NULL,
  `text` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `gm` varchar(30) CHARACTER SET utf8 NOT NULL,
  `user` varchar(30) CHARACTER SET utf8 NOT NULL,
  `user_id` int(30) NOT NULL,
  `time` varchar(100) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table softboundv1.commands: ~0 rows (approximately)
/*!40000 ALTER TABLE `commands` DISABLE KEYS */;
/*!40000 ALTER TABLE `commands` ENABLE KEYS */;

-- Dumping structure for table softboundv1.comment_post
CREATE TABLE IF NOT EXISTS `comment_post` (
  `comment_id` int(10) NOT NULL AUTO_INCREMENT,
  `comment_user_de` int(10) NOT NULL,
  `comment_user_para` int(10) NOT NULL,
  `message_for` varchar(900) NOT NULL,
  `time_comment` varchar(50) NOT NULL,
  PRIMARY KEY (`comment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table softboundv1.comment_post: ~0 rows (approximately)
/*!40000 ALTER TABLE `comment_post` DISABLE KEYS */;
/*!40000 ALTER TABLE `comment_post` ENABLE KEYS */;

-- Dumping structure for table softboundv1.event_game
CREATE TABLE IF NOT EXISTS `event_game` (
  `Server_Id` int(10) NOT NULL AUTO_INCREMENT,
  `historychat` varchar(300) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `date` bigint(100) NOT NULL,
  `time` int(50) NOT NULL,
  `tipo` varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `server_tournament_state` int(5) NOT NULL,
  `holiday` int(10) NOT NULL,
  `server_check` int(10) NOT NULL,
  `first_important_ranks` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`Server_Id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Dumping data for table softboundv1.event_game: ~0 rows (approximately)
/*!40000 ALTER TABLE `event_game` DISABLE KEYS */;
INSERT INTO `event_game` (`Server_Id`, `historychat`, `date`, `time`, `tipo`, `server_tournament_state`, `holiday`, `server_check`, `first_important_ranks`) VALUES
	(1, 'Eber', 1596832329109, 0, 'Evento', 1, 396, 1, '[3177,1002,995]');
/*!40000 ALTER TABLE `event_game` ENABLE KEYS */;

-- Dumping structure for table softboundv1.event_game_copy
CREATE TABLE IF NOT EXISTS `event_game_copy` (
  `Server_Id` int(10) NOT NULL AUTO_INCREMENT,
  `historychat` varchar(300) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `date` bigint(100) NOT NULL,
  `time` int(50) NOT NULL,
  `tipo` varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `server_tournament_state` int(5) NOT NULL,
  `holiday` int(10) NOT NULL,
  `server_check` int(10) NOT NULL,
  `first_important_ranks` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`Server_Id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Dumping data for table softboundv1.event_game_copy: ~0 rows (approximately)
/*!40000 ALTER TABLE `event_game_copy` DISABLE KEYS */;
INSERT INTO `event_game_copy` (`Server_Id`, `historychat`, `date`, `time`, `tipo`, `server_tournament_state`, `holiday`, `server_check`, `first_important_ranks`) VALUES
	(1, 'Eber', 1596832329109, 0, 'Evento', 1, 396, 1, '[1604229,756466,366647]');
/*!40000 ALTER TABLE `event_game_copy` ENABLE KEYS */;

-- Dumping structure for table softboundv1.event_log
CREATE TABLE IF NOT EXISTS `event_log` (
  `Id` int(11) NOT NULL,
  `Event1` bigint(50) DEFAULT 0,
  `Event2` bigint(50) DEFAULT 0,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table softboundv1.event_log: ~21 rows (approximately)
/*!40000 ALTER TABLE `event_log` DISABLE KEYS */;
INSERT INTO `event_log` (`Id`, `Event1`, `Event2`) VALUES
	(1, 1616443756716, 1616478480858),
	(4, 0, 1616375468320),
	(6, 1616527763907, 1616376287782),
	(7, 0, 0),
	(9, 0, 0),
	(14, 0, 1616514801900),
	(15, 0, 0),
	(16, 0, 1616519501478),
	(17, 0, 1616519499790),
	(18, 1616463169340, 1616519975407),
	(20, 0, 0),
	(21, 0, 1616523029729),
	(22, 1616519874256, 1616524682083),
	(24, 1616462735086, 1616531827218),
	(25, 0, 1616531880770),
	(26, 1616462306564, 1616531921012),
	(28, 0, 1616532226637),
	(32, 1616462306564, 1616535217604),
	(34, 1616475856079, 0),
	(36, 1616485294751, 1616557167186),
	(39, 0, 1616591036448),
	(40, 0, 1616594732585),
	(41, 1616529677478, 1616600157706);
/*!40000 ALTER TABLE `event_log` ENABLE KEYS */;

-- Dumping structure for table softboundv1.friends
CREATE TABLE IF NOT EXISTS `friends` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_yo` int(11) NOT NULL,
  `id_amigo` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=latin1;

-- Dumping data for table softboundv1.friends: ~46 rows (approximately)
/*!40000 ALTER TABLE `friends` DISABLE KEYS */;
INSERT INTO `friends` (`id`, `id_yo`, `id_amigo`) VALUES
	(1, 1, 1),
	(2, 2, 2),
	(3, 3, 3),
	(4, 4, 4),
	(5, 5, 5),
	(6, 6, 6),
	(7, 7, 7),
	(8, 7, 1),
	(9, 1, 7),
	(10, 8, 8),
	(11, 9, 9),
	(12, 11, 11),
	(13, 12, 12),
	(14, 13, 13),
	(15, 14, 14),
	(16, 15, 15),
	(17, 16, 16),
	(18, 17, 17),
	(19, 18, 18),
	(20, 19, 19),
	(21, 20, 20),
	(22, 21, 21),
	(23, 22, 22),
	(24, 23, 23),
	(25, 24, 24),
	(26, 25, 25),
	(27, 26, 26),
	(28, 27, 27),
	(29, 26, 24),
	(30, 24, 26),
	(31, 27, 24),
	(32, 24, 27),
	(37, 28, 28),
	(38, 28, 24),
	(39, 24, 28),
	(40, 28, 26),
	(41, 26, 28),
	(42, 28, 27),
	(43, 27, 28),
	(44, 32, 32),
	(45, 33, 33),
	(46, 34, 34),
	(47, 35, 35),
	(48, 36, 36),
	(49, 38, 38),
	(50, 39, 39),
	(51, 40, 40),
	(52, 41, 41);
/*!40000 ALTER TABLE `friends` ENABLE KEYS */;

-- Dumping structure for table softboundv1.guests
CREATE TABLE IF NOT EXISTS `guests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `from_id` int(11) NOT NULL,
  `to_id` int(11) NOT NULL,
  `check_ip` varchar(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table softboundv1.guests: ~0 rows (approximately)
/*!40000 ALTER TABLE `guests` DISABLE KEYS */;
/*!40000 ALTER TABLE `guests` ENABLE KEYS */;

-- Dumping structure for table softboundv1.guild
CREATE TABLE IF NOT EXISTS `guild` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(45) NOT NULL,
  `points` int(10) NOT NULL,
  `members` int(100) NOT NULL,
  `rank` int(10) NOT NULL,
  `img` varchar(200) NOT NULL DEFAULT '/static/images/your-logo-here.png',
  `fondo` varchar(200) NOT NULL DEFAULT '/static/images/aqua_bg.jpg',
  `about` varchar(460) NOT NULL,
  `website` varchar(100) NOT NULL DEFAULT 'http://softbound.cf',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- Dumping data for table softboundv1.guild: ~4 rows (approximately)
/*!40000 ALTER TABLE `guild` DISABLE KEYS */;
INSERT INTO `guild` (`Id`, `Name`, `points`, `members`, `rank`, `img`, `fondo`, `about`, `website`) VALUES
	(1, 'GM', 0, 286, 31, 'https://dragon.cloud/qzbFO9az9wq5dvd-LDqitQ.jpg', 'https://dragon.cloud/Nhwqm9catgkF0DuzSBoDTg.png', 'Bienvenidos', 'http://softbound.cf'),
	(2, 'Vip♚', 0, 0, 0, '/static/images/your-logo-here.png', '/static/images/aqua_bg.jpg', 'Bienvenidos', 'http://softbound.cf'),
	(3, '【AMV】™', 0, 625, 0, '/static/images/your-logo-here.png', '/static/images/aqua_bg.jpg', 'Bienvenidos', 'http://softbound.cf'),
	(4, 'ZeRo.', 0, 58, 0, '/static/images/your-logo-here.png', '/static/images/aqua_bg.jpg', 'Bienvenidos', 'http://softbound.cf');
/*!40000 ALTER TABLE `guild` ENABLE KEYS */;

-- Dumping structure for table softboundv1.guild_coins
CREATE TABLE IF NOT EXISTS `guild_coins` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `guild_id` int(10) NOT NULL,
  `user_id` int(10) NOT NULL,
  `time_coin` varchar(30) CHARACTER SET utf8 NOT NULL,
  `date_coin` varchar(40) CHARACTER SET utf8 NOT NULL,
  `coin_img` varchar(32) CHARACTER SET utf8 NOT NULL DEFAULT '/static/images/guild_coin22.png',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- Dumping data for table softboundv1.guild_coins: ~2 rows (approximately)
/*!40000 ALTER TABLE `guild_coins` DISABLE KEYS */;
INSERT INTO `guild_coins` (`id`, `guild_id`, `user_id`, `time_coin`, `date_coin`, `coin_img`) VALUES
	(1, 1, 1, '2021-03-22 11:34:05.629', 'Promoted to SemiLeader', '/static/images/guild_coin22.png'),
	(2, 1, 1, '2021-03-22 11:34:08.570', 'Promoted to SemiLeader', '/static/images/guild_coin22.png');
/*!40000 ALTER TABLE `guild_coins` ENABLE KEYS */;

-- Dumping structure for table softboundv1.guild_member
CREATE TABLE IF NOT EXISTS `guild_member` (
  `rowsec` int(10) NOT NULL AUTO_INCREMENT,
  `Id` int(11) NOT NULL,
  `UserId` int(11) NOT NULL,
  `Job` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`rowsec`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

-- Dumping data for table softboundv1.guild_member: ~10 rows (approximately)
/*!40000 ALTER TABLE `guild_member` DISABLE KEYS */;
INSERT INTO `guild_member` (`rowsec`, `Id`, `UserId`, `Job`) VALUES
	(1, 1, 2, 0),
	(2, 1, 1, 1),
	(3, 1, 7, 0),
	(4, 1, 6, 0),
	(5, 1, 15, 0),
	(6, 2, 22, 1),
	(7, 3, 24, 1),
	(8, 3, 26, 0),
	(9, 3, 27, 0),
	(10, 3, 28, 0),
	(11, 4, 32, 1);
/*!40000 ALTER TABLE `guild_member` ENABLE KEYS */;

-- Dumping structure for table softboundv1.info_tournament
CREATE TABLE IF NOT EXISTS `info_tournament` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `tournament_server` int(10) NOT NULL,
  `tournament_start_time` varchar(70) NOT NULL,
  `tournament_end_time` varchar(70) NOT NULL,
  `tournament_gifts_users` int(100) NOT NULL,
  `tournament_state_server` varchar(100) NOT NULL,
  `tournament_check` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Dumping data for table softboundv1.info_tournament: ~0 rows (approximately)
/*!40000 ALTER TABLE `info_tournament` DISABLE KEYS */;
INSERT INTO `info_tournament` (`id`, `tournament_server`, `tournament_start_time`, `tournament_end_time`, `tournament_gifts_users`, `tournament_state_server`, `tournament_check`) VALUES
	(1, 5, '1599030057000', '1606893057000', 0, '0', '0');
/*!40000 ALTER TABLE `info_tournament` ENABLE KEYS */;

-- Dumping structure for table softboundv1.ip_user_banned
CREATE TABLE IF NOT EXISTS `ip_user_banned` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `ip` varchar(20) NOT NULL,
  `razon` varchar(120) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `gm` varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `IdGM` int(11) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table softboundv1.ip_user_banned: ~0 rows (approximately)
/*!40000 ALTER TABLE `ip_user_banned` DISABLE KEYS */;
/*!40000 ALTER TABLE `ip_user_banned` ENABLE KEYS */;

-- Dumping structure for table softboundv1.my_payments
CREATE TABLE IF NOT EXISTS `my_payments` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) NOT NULL,
  `Name` varchar(60) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `Date` int(30) NOT NULL,
  `cash` int(10) NOT NULL,
  `Info` varchar(60) CHARACTER SET utf8 NOT NULL,
  `Reseller` varchar(60) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table softboundv1.my_payments: ~0 rows (approximately)
/*!40000 ALTER TABLE `my_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `my_payments` ENABLE KEYS */;

-- Dumping structure for table softboundv1.pin_code
CREATE TABLE IF NOT EXISTS `pin_code` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pin` varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `seller` varchar(30) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `gm` varchar(30) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `gm_id` int(10) NOT NULL,
  `used_by` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `rode` varchar(11) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `state` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `date_time` int(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table softboundv1.pin_code: ~0 rows (approximately)
/*!40000 ALTER TABLE `pin_code` DISABLE KEYS */;
/*!40000 ALTER TABLE `pin_code` ENABLE KEYS */;

-- Dumping structure for table softboundv1.rankspecial
CREATE TABLE IF NOT EXISTS `rankspecial` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `IdAcc` int(11) NOT NULL,
  `game_id` varchar(45) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `rank` int(5) NOT NULL,
  `cash` int(11) NOT NULL,
  `time` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table softboundv1.rankspecial: ~0 rows (approximately)
/*!40000 ALTER TABLE `rankspecial` DISABLE KEYS */;
/*!40000 ALTER TABLE `rankspecial` ENABLE KEYS */;

-- Dumping structure for table softboundv1.relationship
CREATE TABLE IF NOT EXISTS `relationship` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `relationship_status` varchar(3) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT 's',
  `relationship_with_id` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=latin1;

-- Dumping data for table softboundv1.relationship: ~36 rows (approximately)
/*!40000 ALTER TABLE `relationship` DISABLE KEYS */;
INSERT INTO `relationship` (`Id`, `user_id`, `relationship_status`, `relationship_with_id`) VALUES
	(1, 1, 's', 0),
	(2, 2, 's', 0),
	(3, 3, 's', 0),
	(4, 4, 's', 0),
	(5, 5, 's', 0),
	(6, 6, 's', 0),
	(7, 7, 's', 0),
	(8, 8, 's', 0),
	(9, 9, 's', 0),
	(10, 11, 's', 0),
	(11, 12, 's', 0),
	(12, 13, 's', 0),
	(13, 14, 's', 0),
	(14, 15, 's', 0),
	(15, 16, 's', 0),
	(16, 17, 's', 0),
	(17, 18, 's', 0),
	(18, 19, 's', 0),
	(19, 20, 's', 0),
	(20, 21, 's', 0),
	(21, 22, 's', 0),
	(22, 23, 's', 0),
	(23, 24, 's', 0),
	(24, 25, 's', 0),
	(25, 26, 's', 0),
	(26, 27, 's', 0),
	(27, 28, 's', 0),
	(28, 32, 's', 0),
	(29, 33, 's', 0),
	(30, 34, 's', 0),
	(31, 35, 's', 0),
	(32, 36, 's', 0),
	(33, 37, 's', 0),
	(34, 38, 's', 0),
	(35, 39, 's', 0),
	(36, 40, 's', 0),
	(37, 41, 's', 0),
	(38, 42, 's', 0);
/*!40000 ALTER TABLE `relationship` ENABLE KEYS */;

-- Dumping structure for table softboundv1.resets_rankings
CREATE TABLE IF NOT EXISTS `resets_rankings` (
  `r` int(10) NOT NULL AUTO_INCREMENT,
  `last_reset_rankings` varchar(100) NOT NULL,
  `next_reset_rankings` varchar(100) NOT NULL,
  `time_reset` varchar(1000) NOT NULL,
  PRIMARY KEY (`r`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table softboundv1.resets_rankings: ~3 rows (approximately)
/*!40000 ALTER TABLE `resets_rankings` DISABLE KEYS */;
INSERT INTO `resets_rankings` (`r`, `last_reset_rankings`, `next_reset_rankings`, `time_reset`) VALUES
	(1, '1616517195137', '1616518995137', '30'),
	(8, '1616274811064', '1616879165615', '10080'),
	(24, '1616274363603', '1616878919848', '10080');
/*!40000 ALTER TABLE `resets_rankings` ENABLE KEYS */;

-- Dumping structure for table softboundv1.screenshot_game
CREATE TABLE IF NOT EXISTS `screenshot_game` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `screenshot_letters` varchar(20) NOT NULL,
  `partida_screenshot` varchar(2000) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- Dumping data for table softboundv1.screenshot_game: ~4 rows (approximately)
/*!40000 ALTER TABLE `screenshot_game` DISABLE KEYS */;
INSERT INTO `screenshot_game` (`id`, `screenshot_letters`, `partida_screenshot`) VALUES
	(1, '523gulz5', '"[1,1616280376574,1,1,1,4,-1,1,0,0,11,[[0,1,\\"Sr Informatico\\",31,23,2850,0],[1,60000,\\"Tutorial Bot\\",0,0,200,1]]]"'),
	(2, '7kywoys8', '"[1,1616292502738,3,1,1,4,-1,1,0,0,3,[[0,1,\\"Sr Informatico\\",0,23,2500,0],[1,60000,\\"Tutorial Bot\\",0,0,0,1]]]"'),
	(3, '3zs3y5ca', '"[1,1616415809577,3,1,1,4,-1,1,0,0,13,[[0,1,\\"Sr Informatico\\",31,20,2500,0],[1,60002,\\"Tutorial Bot\\",0,0,150,1]]]"'),
	(4, '3kr1xhfb', '"[1,1616416133125,3,1,1,4,-1,1,0,0,8,[[0,1,\\"Sr Informatico\\",31,22,2800,0],[1,60003,\\"Tutorial Bot\\",0,0,150,1]]]"');
/*!40000 ALTER TABLE `screenshot_game` ENABLE KEYS */;

-- Dumping structure for table softboundv1.tokenmail
CREATE TABLE IF NOT EXISTS `tokenmail` (
  `idCod` int(11) NOT NULL AUTO_INCREMENT,
  `token` varchar(30) DEFAULT NULL,
  `idAcc` int(11) DEFAULT NULL,
  PRIMARY KEY (`idCod`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table softboundv1.tokenmail: ~0 rows (approximately)
/*!40000 ALTER TABLE `tokenmail` DISABLE KEYS */;
/*!40000 ALTER TABLE `tokenmail` ENABLE KEYS */;

-- Dumping structure for table softboundv1.users
CREATE TABLE IF NOT EXISTS `users` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `game_id` varchar(45) DEFAULT NULL,
  `rank` int(11) DEFAULT NULL,
  `gp` int(11) DEFAULT NULL,
  `gold` int(11) DEFAULT NULL,
  `cash` int(11) DEFAULT NULL,
  `gender` char(2) DEFAULT NULL,
  `unlock` int(11) DEFAULT NULL,
  `photo_url` varchar(200) DEFAULT 'https://image.prntscr.com/image/sC3pg5sKRny_PCbrJSZgcA.jpg',
  `name_changes` int(11) DEFAULT NULL,
  `power_user` int(11) DEFAULT NULL,
  `plus10gp` int(11) DEFAULT NULL,
  `mobile_fox` int(11) DEFAULT NULL,
  `country` varchar(15) DEFAULT NULL,
  `flowers` int(11) DEFAULT NULL,
  `map_pack` int(11) DEFAULT NULL,
  `megaphones` int(11) DEFAULT NULL,
  `is_muted` varchar(15) DEFAULT '0',
  `win` int(11) DEFAULT 0,
  `loss` int(11) DEFAULT 0,
  `gm` int(2) DEFAULT 0,
  `banned` int(5) NOT NULL,
  `prixw` int(11) NOT NULL,
  `probability` int(10) NOT NULL,
  `IdAcc` int(11) NOT NULL,
  `bg_url` varchar(200) DEFAULT 'https://image.prntscr.com/image/b1951ace8fbe48a383165b53955cee02.png',
  `IP` varchar(45) NOT NULL DEFAULT '0.0.0.0',
  `block_friend` int(2) NOT NULL,
  `CashCharger` int(11) NOT NULL,
  `ranking_semanal` int(10) NOT NULL,
  `event1` varchar(500) DEFAULT NULL,
  `event2` varchar(500) DEFAULT NULL,
  `email` varchar(250) DEFAULT NULL,
  `activate` int(11) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `name2` varchar(150) DEFAULT NULL,
  `lucky_egg_sec_left` varchar(500) DEFAULT '',
  `electrico` int(10) DEFAULT NULL,
  `lucky_egg` varchar(30) DEFAULT '0',
  PRIMARY KEY (`Id`),
  KEY `FKUserAcc_idx` (`IdAcc`),
  CONSTRAINT `FKUserAcc` FOREIGN KEY (`IdAcc`) REFERENCES `accounts` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8;

-- Dumping data for table softboundv1.users: ~39 rows (approximately)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`Id`, `game_id`, `rank`, `gp`, `gold`, `cash`, `gender`, `unlock`, `photo_url`, `name_changes`, `power_user`, `plus10gp`, `mobile_fox`, `country`, `flowers`, `map_pack`, `megaphones`, `is_muted`, `win`, `loss`, `gm`, `banned`, `prixw`, `probability`, `IdAcc`, `bg_url`, `IP`, `block_friend`, `CashCharger`, `ranking_semanal`, `event1`, `event2`, `email`, `activate`, `birthday`, `name2`, `lucky_egg_sec_left`, `electrico`, `lucky_egg`) VALUES
	(1, 'Sr Informatico', 31, 1122, 2147463447, 2147225248, 'm', 0, 'https://dragon.cloud/qzbFO9az9wq5dvd-LDqitQ.jpg', 1, 0, 0, 0, 'PE', 0, 0, 0, '0', 13, 37, 1, 0, 0, 0, 1, 'https://image.prntscr.com/image/b1951ace8fbe48a383165b53955cee02.png', '127.0.0.1', 0, 0, 277, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '0'),
	(3, 'LaJefa', 0, 1000, 500000, 90000, 'f', 0, '', 0, 0, 0, 0, 'VE', 0, 0, 0, '0', 0, 0, 0, 0, 0, 0, 3, 'https://image.prntscr.com/image/b1951ace8fbe48a383165b53955cee02.png', '190.217.1.146', 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '0'),
	(4, '*Delicia*', 0, 1069, 505050, 91000, 'm', 0, '', 0, 0, 0, 0, 'PE', 0, 0, 0, '0', 5, 2, 0, 0, 0, 0, 4, 'https://image.prntscr.com/image/b1951ace8fbe48a383165b53955cee02.png', '190.42.16.146', 0, 0, 69, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '0'),
	(5, 'Estrella', 0, 995, 498500, 90000, 'f', 0, '', 0, 0, 0, 0, 'PE', 0, 0, 0, '0', 0, 1, 0, 0, 0, 0, 5, 'https://image.prntscr.com/image/b1951ace8fbe48a383165b53955cee02.png', '190.237.172.114', 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '0'),
	(6, 'Dios', 26, 1987, 2147476047, 2147474647, 'm', 0, '', 0, 0, 0, 0, 'PE', 0, 0, 0, '0', 27, 5, 0, 0, 0, 0, 6, 'https://image.prntscr.com/image/b1951ace8fbe48a383165b53955cee02.png', '179.6.43.51', 0, 0, 987, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '0'),
	(7, 'StoneCold', 31, 989, 2147476307, 2147357897, 'm', 0, '', 0, 0, 0, 0, 'PE', 0, 0, 0, '0', 2, 7, 0, 0, 0, 0, 7, 'https://image.prntscr.com/image/b1951ace8fbe48a383165b53955cee02.png', '190.235.15.213', 0, 0, 11, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '0'),
	(8, 'ghosito123', 0, 990, 497000, 90000, 'm', 0, '', 0, 0, 0, 0, 'PE', 0, 0, 0, '0', 0, 2, 0, 0, 0, 0, 8, 'https://image.prntscr.com/image/b1951ace8fbe48a383165b53955cee02.png', '179.7.193.197', 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '0'),
	(9, 'Mamentl', 0, 1000, 500000, 90000, 'm', 0, '', 0, 0, 0, 0, 'PE', 0, 0, 0, '0', 0, 0, 0, 0, 0, 0, 9, 'https://image.prntscr.com/image/b1951ace8fbe48a383165b53955cee02.png', '179.6.78.61', 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '0'),
	(10, 'fghfdg', 0, 1000, 500000, 90000, 'm', 0, '', 0, 0, 0, 0, 'PE', 0, 0, 0, '0', 0, 0, 0, 0, 0, 0, 10, 'https://image.prntscr.com/image/b1951ace8fbe48a383165b53955cee02.png', '190.235.15.213', 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '0'),
	(11, 'gfhdfdg', 0, 1000, 500000, 90000, 'm', 0, '', 0, 0, 0, 0, 'PE', 0, 0, 0, '0', 0, 0, 0, 0, 0, 0, 11, 'https://image.prntscr.com/image/b1951ace8fbe48a383165b53955cee02.png', '190.235.15.213', 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '0'),
	(12, '213sadsad', 0, 1000, 500000, 90000, 'm', 0, '', 0, 0, 0, 0, 'PE', 0, 0, 0, '0', 0, 0, 0, 0, 0, 0, 12, 'https://image.prntscr.com/image/b1951ace8fbe48a383165b53955cee02.png', '190.237.172.114', 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '0'),
	(13, 'sdfc24234', 0, 1000, 500000, 90000, 'm', 0, '', 0, 0, 0, 0, 'PE', 0, 0, 0, '0', 0, 0, 0, 0, 0, 0, 13, 'https://image.prntscr.com/image/b1951ace8fbe48a383165b53955cee02.png', '190.237.172.114', 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '0'),
	(14, 'Panda', 0, 990, 498000, 5000, 'm', 0, '', 0, 0, 0, 0, 'PE', 0, 0, 0, '0', 0, 2, 0, 0, 0, 0, 14, 'https://image.prntscr.com/image/b1951ace8fbe48a383165b53955cee02.png', '201.240.196.71', 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '0'),
	(15, 'AnthonyYT', 26, 1000, 2147477927, 2147128928, 'm', 0, '', 1, 1, 1, 0, 'PE', 0, 0, 100, '0', 0, 0, 0, 0, 0, 0, 15, 'https://image.prntscr.com/image/b1951ace8fbe48a383165b53955cee02.png', '127.0.0.1', 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '0'),
	(16, 'Jhan', 0, 1027, 504850, 91000, 'm', 0, '', 0, 0, 0, 0, 'PE', 0, 0, 0, '0', 2, 2, 0, 0, 0, 0, 16, 'https://image.prntscr.com/image/b1951ace8fbe48a383165b53955cee02.png', '190.237.11.72', 0, 0, 32, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '0'),
	(17, '~*Luiss*~', 0, 1025, 501100, 91000, 'm', 0, '', 0, 0, 0, 0, 'PE', 0, 0, 0, '0', 1, 2, 0, 0, 0, 0, 17, 'https://image.prntscr.com/image/b1951ace8fbe48a383165b53955cee02.png', '200.48.84.159', 0, 0, 30, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '0'),
	(18, 'Gambites', 0, 1022, 5050, 1300, 'm', 0, '', 0, 0, 0, 0, 'PE', 0, 0, 0, '0', 1, 0, 0, 0, 0, 0, 18, 'https://image.prntscr.com/image/b1951ace8fbe48a383165b53955cee02.png', '181.64.18.22', 0, 0, 22, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '0'),
	(19, 'Phoenix7', 0, 1000, 500000, 90000, 'm', 0, '', 0, 0, 0, 0, 'RW', 0, 0, 0, '0', 0, 0, 0, 0, 0, 0, 19, 'https://image.prntscr.com/image/b1951ace8fbe48a383165b53955cee02.png', '177.53.153.82', 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '0'),
	(20, 'RicardoColomo', 0, 1000, 500000, 90000, 'm', 0, '', 0, 0, 0, 0, 'CO', 0, 0, 0, '0', 0, 0, 0, 0, 0, 0, 20, 'https://image.prntscr.com/image/b1951ace8fbe48a383165b53955cee02.png', '181.54.33.231', 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '0'),
	(21, 'anarquico', 3, 1515, 551600, 58001, 'm', 0, '', 0, 1, 1, 0, 'PE', 0, 0, 0, '0', 21, 0, 0, 0, 0, 0, 21, 'https://image.prntscr.com/image/b1951ace8fbe48a383165b53955cee02.png', '190.237.153.244', 0, 0, 515, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '0'),
	(22, 'ColomoPro', 0, 995, 500, 1300, 'm', 0, '', 0, 0, 0, 0, 'CO', 0, 0, 0, '0', 0, 1, 0, 0, 0, 0, 22, 'https://image.prntscr.com/image/b1951ace8fbe48a383165b53955cee02.png', '127.0.0.1', 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '0'),
	(23, '5ytytyt', 0, 998, 498500, 90000, 'm', 0, '', 0, 0, 0, 0, 'PE', 0, 0, 0, '0', 0, 3, 0, 0, 0, 0, 23, 'https://image.prntscr.com/image/b1951ace8fbe48a383165b53955cee02.png', '190.235.15.213', 0, 0, 3, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '0'),
	(24, 'luiss', 3, 1556, 67050, 1300, 'm', 0, '', 0, 0, 0, 0, 'PE', 0, 0, 0, '0', 33, 5, 0, 0, 0, 0, 24, 'https://image.prntscr.com/image/b1951ace8fbe48a383165b53955cee02.png', '200.48.84.159', 0, 0, 566, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '0'),
	(25, '12452', 0, 1000, 501000, 91000, 'm', 0, '', 1, 0, 0, 0, 'PE', 0, 0, 0, '0', 0, 0, 0, 0, 0, 0, 25, 'https://image.prntscr.com/image/b1951ace8fbe48a383165b53955cee02.png', '200.48.84.159', 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '0'),
	(26, '#Mr~Emma*~', 0, 1006, 501100, 7300, 'f', 0, '', 0, 0, 0, 0, 'PE', 0, 0, 0, '0', 3, 0, 0, 0, 0, 0, 26, 'https://image.prntscr.com/image/b1951ace8fbe48a383165b53955cee02.png', '200.48.84.159', 0, 0, 6, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '0'),
	(27, '▓Brayan~*', 0, 1053, 504350, 6000, 'm', 0, '', 0, 0, 0, 0, 'PE', 0, 0, 0, '0', 3, 0, 0, 0, 0, 0, 27, 'https://image.prntscr.com/image/b1951ace8fbe48a383165b53955cee02.png', '200.48.84.159', 0, 0, 53, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '0'),
	(28, '#Mr~Violeta*~', 0, 1000, 500450, 7000, 'f', 0, '', 0, 0, 0, 0, 'PE', 0, 0, 0, '0', 3, 0, 0, 0, 0, 0, 28, 'https://image.prntscr.com/image/b1951ace8fbe48a383165b53955cee02.png', '200.48.84.159', 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '0'),
	(29, 'Sr.UnLimited', 0, 1000, 500000, 90000, 'm', 0, '', 0, 0, 0, 0, 'PE', 0, 0, 0, '0', 0, 0, 0, 0, 0, 0, 29, 'https://image.prntscr.com/image/b1951ace8fbe48a383165b53955cee02.png', '200.48.84.159', 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '0'),
	(30, '~ICuCa4e', 0, 1000, 500000, 90000, 'm', 0, '', 0, 0, 0, 0, 'PE', 0, 0, 0, '0', 0, 0, 0, 0, 0, 0, 30, 'https://image.prntscr.com/image/b1951ace8fbe48a383165b53955cee02.png', '200.48.84.159', 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '0'),
	(31, 'evEr10', 0, 1000, 500000, 90000, 'm', 0, '', 0, 0, 0, 0, 'PE', 0, 0, 0, '0', 0, 0, 0, 0, 0, 0, 31, 'https://image.prntscr.com/image/b1951ace8fbe48a383165b53955cee02.png', '200.48.84.159', 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '0'),
	(32, 'anyBOT', 0, 1058, 6150, 20302, 'm', 0, '', 0, 1, 1, 0, 'PE', 0, 0, 0, '0', 3, 0, 0, 0, 0, 0, 32, 'https://image.prntscr.com/image/b1951ace8fbe48a383165b53955cee02.png', '190.43.121.21', 0, 0, 58, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '0'),
	(33, 'Gambites~DB', 0, 990, 497000, 90000, 'm', 0, '', 0, 0, 0, 0, 'PE', 0, 0, 0, '0', 0, 2, 0, 0, 0, 0, 33, 'https://image.prntscr.com/image/b1951ace8fbe48a383165b53955cee02.png', '181.64.18.22', 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '0'),
	(34, 'Conejo!', 0, 1000, 501000, 90300, 'm', 0, '', 0, 0, 0, 0, 'VE', 0, 0, 0, '0', 0, 0, 0, 0, 0, 0, 34, 'https://image.prntscr.com/image/b1951ace8fbe48a383165b53955cee02.png', '190.217.14.186', 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '0'),
	(35, 'Lucas', 0, 1000, 500000, 90000, 'm', 0, '', 0, 0, 0, 0, 'PE', 0, 0, 0, '0', 0, 0, 0, 0, 0, 0, 35, 'https://image.prntscr.com/image/b1951ace8fbe48a383165b53955cee02.png', '127.0.0.1', 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '0'),
	(36, 'ElMasNaki', 0, 1000, 502000, 75300, 'm', 0, '', 0, 0, 0, 0, 'PE', 0, 0, 0, '0', 0, 0, 0, 0, 0, 0, 36, 'https://image.prntscr.com/image/b1951ace8fbe48a383165b53955cee02.png', '127.0.0.1', 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '0'),
	(37, 'Eddy Renato Casós Gerónimo', 0, 1000, 800000, 50000, 'm', 0, '4194925407184846', 0, 0, 0, 0, 'PE', 0, 0, 0, '0', 0, 0, 0, 0, 0, 0, 37, 'https://image.prntscr.com/image/b1951ace8fbe48a383165b53955cee02.png', '190.235.15.204', 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '0'),
	(38, 'lucass', 0, 1000, 500000, 90000, 'm', 0, '', 0, 0, 0, 0, 'PE', 0, 0, 0, '0', 0, 0, 0, 0, 0, 0, 38, 'https://image.prntscr.com/image/b1951ace8fbe48a383165b53955cee02.png', '127.0.0.1', 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '0'),
	(39, 'Alidos20', 0, 1000, 501000, 1000, 'm', 0, '', 0, 0, 0, 0, 'PE', 0, 0, 0, '0', 0, 0, 0, 0, 0, 0, 39, 'https://image.prntscr.com/image/b1951ace8fbe48a383165b53955cee02.png', '127.0.0.1', 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '0'),
	(40, '~!Haku~', 2, 1272, 535850, 10000, 'm', 0, '', 0, 0, 0, 0, 'PE', 0, 0, 0, '0', 15, 3, 0, 0, 0, 0, 40, 'https://image.prntscr.com/image/b1951ace8fbe48a383165b53955cee02.png', '127.0.0.1', 0, 0, 277, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '0'),
	(41, 'arom:V', 2, 1311, 537800, 21300, 'm', 0, '', 0, 0, 0, 0, 'PE', 0, 0, 0, '0', 14, 2, 0, 0, 0, 0, 41, 'https://image.prntscr.com/image/b1951ace8fbe48a383165b53955cee02.png', '127.0.0.1', 0, 0, 316, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '0'),
	(42, 'Anthony Chudan Crisanto', 0, 1000, 800000, 50000, 'm', 0, '926518841219215', 0, 0, 0, 0, 'PE', 0, 0, 0, '0', 0, 0, 0, 0, 0, 0, 42, 'https://image.prntscr.com/image/b1951ace8fbe48a383165b53955cee02.png', '190.237.122.186', 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '0');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

-- Dumping structure for table softboundv1.user_avatars
CREATE TABLE IF NOT EXISTS `user_avatars` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `UserId` int(11) DEFAULT NULL,
  `aId` int(11) DEFAULT NULL,
  `type` int(11) DEFAULT 0,
  `expire` datetime DEFAULT NULL,
  `is_cash` int(2) DEFAULT 0,
  `is_gift` int(2) DEFAULT 0,
  `gift_sent_by` int(10) NOT NULL,
  `amount` int(11) DEFAULT 0,
  `expire_time` bigint(40) DEFAULT 0,
  `date_ava_time` bigint(50) NOT NULL,
  `remove_ava` int(10) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=98 DEFAULT CHARSET=utf8;

-- Dumping data for table softboundv1.user_avatars: ~78 rows (approximately)
/*!40000 ALTER TABLE `user_avatars` DISABLE KEYS */;
INSERT INTO `user_avatars` (`Id`, `UserId`, `aId`, `type`, `expire`, `is_cash`, `is_gift`, `gift_sent_by`, `amount`, `expire_time`, `date_ava_time`, `remove_ava`) VALUES
	(1, 1, 3101, 0, NULL, 1, 0, 0, 0, 1616880479190, 1616275679190, 1),
	(2, 1, 3113, 0, NULL, 1, 0, 0, 0, 1616884676046, 1616279876046, 1),
	(3, 6, 3216, 2, NULL, 1, 0, 0, 0, 0, 1616290073374, 0),
	(4, 6, 3111, 1, NULL, 1, 0, 0, 0, 0, 1616290081564, 0),
	(5, 6, 3097, 0, NULL, 1, 0, 0, 0, 0, 1616290109920, 0),
	(6, 1, 3115, 1, NULL, 1, 0, 0, 0, 0, 1616295870307, 0),
	(7, 1, 3217, 2, NULL, 1, 0, 0, 0, 0, 1616295875423, 0),
	(8, 1, 3238, 3, NULL, 1, 0, 0, 0, 0, 1616295882392, 0),
	(9, 1, 3193, 0, NULL, 1, 0, 0, 0, 0, 1616295923209, 0),
	(10, 1, 3194, 1, NULL, 1, 0, 0, 0, 0, 1616295931928, 0),
	(11, 2, 180, 0, NULL, 1, 0, 0, 0, 0, 1616298671056, 0),
	(12, 2, 316, 1, NULL, 1, 0, 0, 0, 0, 1616298725250, 0),
	(13, 2, 317, 1, NULL, 1, 0, 0, 0, 0, 1616298733944, 0),
	(14, 2, 1151, 2, NULL, 1, 0, 0, 0, 0, 1616298759645, 0),
	(15, 2, 1272, 3, NULL, 1, 0, 0, 0, 0, 1616298809911, 0),
	(16, 2, 1130, 3, NULL, 1, 0, 0, 0, 0, 1616298820080, 0),
	(17, 2, 1125, 3, NULL, 1, 0, 0, 0, 0, 1616298822825, 0),
	(18, 2, 1110, 3, NULL, 1, 0, 0, 0, 0, 1616298835083, 0),
	(19, 2, 1101, 3, NULL, 1, 0, 0, 0, 0, 1616298843286, 0),
	(20, 2, 1099, 3, NULL, 1, 0, 0, 0, 0, 1616298845586, 0),
	(21, 2, 1100, 3, NULL, 1, 0, 0, 0, 0, 1616298847510, 0),
	(22, 2, 1098, 3, NULL, 1, 0, 0, 0, 0, 1616298851190, 0),
	(23, 2, 418, 4, NULL, 1, 0, 0, 0, 0, 1616298875646, 0),
	(24, 1, 3117, 0, NULL, 1, 0, 0, 0, 0, 1616394705154, 0),
	(25, 1, 3119, 1, NULL, 1, 0, 0, 0, 0, 1616394727385, 0),
	(26, 1, 3216, 2, NULL, 1, 0, 0, 0, 0, 1616394928628, 0),
	(27, 1, 3235, 3, NULL, 1, 0, 0, 0, 0, 1616394957327, 0),
	(28, 1, 516, 4, NULL, 1, 0, 0, 0, 0, 1616395040910, 0),
	(29, 1, 430, 5, NULL, 1, 0, 0, 0, 0, 1616395735201, 0),
	(30, 14, 1151, 2, NULL, 1, 0, 0, 0, 0, 1616428652412, 0),
	(31, 14, 2448, 3, NULL, 1, 0, 0, 0, 0, 1616428805086, 0),
	(32, 14, 2176, 0, NULL, 1, 0, 0, 0, 0, 1616428945506, 0),
	(33, 14, 1199, 1, NULL, 1, 0, 0, 0, 0, 1616428962069, 0),
	(34, 21, 549, 0, NULL, 1, 0, 0, 0, 0, 1616436690668, 0),
	(35, 21, 3217, 2, NULL, 1, 0, 0, 0, 1617041496620, 1616436696620, 0),
	(36, 21, 3235, 3, NULL, 1, 0, 0, 0, 1617041506032, 1616436706032, 0),
	(37, 21, 464, 6, NULL, 1, 0, 0, 0, 1617041512021, 1616436712021, 0),
	(38, 21, 893, 6, NULL, 1, 0, 0, 0, 1617041514306, 1616436714306, 0),
	(39, 22, 3097, 0, NULL, 1, 0, 0, 0, 0, 1616438366262, 0),
	(40, 22, 3111, 1, NULL, 1, 0, 0, 0, 0, 1616438369728, 0),
	(41, 22, 3217, 2, NULL, 1, 0, 0, 0, 0, 1616438373104, 0),
	(42, 7, 3097, 0, NULL, 1, 0, 0, 0, 0, 1616445059243, 0),
	(43, 7, 3111, 1, NULL, 1, 0, 0, 0, 0, 1616445067944, 0),
	(44, 7, 3216, 2, NULL, 1, 0, 0, 0, 0, 1616445077653, 0),
	(45, 7, 3235, 3, NULL, 1, 0, 0, 0, 0, 1616445094971, 0),
	(46, 24, 3097, 0, NULL, 1, 0, 0, 0, 0, 1616445916765, 0),
	(47, 24, 3111, 1, NULL, 1, 0, 0, 0, 0, 1616445921778, 0),
	(48, 24, 3217, 2, NULL, 1, 0, 0, 0, 0, 1616445934696, 0),
	(49, 26, 1185, 0, NULL, 1, 0, 0, 0, 0, 1616445969808, 0),
	(50, 26, 1199, 1, NULL, 1, 0, 0, 0, 0, 1616445999879, 0),
	(51, 26, 1107, 3, NULL, 1, 0, 0, 0, 0, 1616446030304, 0),
	(52, 26, 853, 2, NULL, 1, 0, 0, 0, 0, 1616446041238, 0),
	(53, 27, 1176, 0, NULL, 1, 0, 0, 0, 0, 1616446420158, 0),
	(54, 28, 1185, 0, NULL, 1, 0, 0, 0, 0, 1616446461136, 0),
	(55, 28, 1199, 1, NULL, 1, 0, 0, 0, 0, 1616446482175, 0),
	(56, 27, 1199, 1, NULL, 1, 0, 0, 0, 0, 1616446499958, 0),
	(57, 27, 1107, 3, NULL, 1, 0, 0, 0, 0, 1616446527579, 0),
	(58, 28, 853, 2, NULL, 1, 0, 0, 0, 0, 1616446550123, 0),
	(59, 27, 853, 2, NULL, 1, 0, 0, 0, 0, 1616446605179, 0),
	(60, 28, 1107, 3, NULL, 1, 0, 0, 0, 0, 1616446642595, 0),
	(61, 18, 3111, 1, NULL, 1, 0, 0, 0, 0, 1616448795989, 0),
	(62, 18, 3097, 0, NULL, 1, 0, 0, 0, 0, 1616448803305, 0),
	(63, 18, 3216, 2, NULL, 1, 0, 0, 0, 0, 1616448818103, 0),
	(64, 32, 842, 0, NULL, 1, 0, 0, 0, 1617053695270, 1616448895270, 0),
	(65, 32, 550, 1, NULL, 1, 0, 0, 0, 1617053713581, 1616448913581, 0),
	(66, 32, 840, 2, NULL, 1, 0, 0, 0, 1617053729797, 1616448929797, 0),
	(67, 32, 866, 3, NULL, 1, 0, 0, 0, 1617053748861, 1616448948861, 0),
	(68, 32, 7807, 4, NULL, 1, 0, 0, 0, 0, 1616448985339, 0),
	(69, 32, 430, 5, NULL, 1, 0, 0, 0, 0, 1616448999989, 0),
	(70, 32, 464, 6, NULL, 1, 0, 0, 0, 1617053803407, 1616449003407, 0),
	(71, 32, 893, 6, NULL, 1, 0, 0, 0, 1617053807916, 1616449007916, 0),
	(72, 18, 2705, 4, NULL, 0, 0, 0, 0, 0, 1616449051478, 0),
	(73, 18, 2581, 5, NULL, 0, 0, 0, 0, 0, 1616449128463, 0),
	(74, 36, 555, 2, NULL, 1, 0, 0, 0, 0, 1616470949030, 0),
	(75, 1, 2319, 6, NULL, 1, 0, 0, 0, 1617077368935, 1616472568935, 0),
	(76, 39, 3097, 0, NULL, 1, 0, 0, 0, 0, 1616504757008, 0),
	(77, 39, 3111, 1, NULL, 1, 0, 0, 0, 0, 1616504763011, 0),
	(78, 39, 3235, 3, NULL, 1, 0, 0, 0, 0, 1616504769453, 0),
	(79, 40, 3097, 0, NULL, 1, 0, 0, 0, 0, 1616509150927, 0),
	(80, 40, 1199, 1, NULL, 1, 0, 0, 0, 0, 1616509194005, 0),
	(81, 40, 3235, 3, NULL, 1, 0, 0, 0, 0, 1616509201584, 0),
	(82, 41, 9989, 4, NULL, 1, 0, 0, 0, 0, 1616515413256, 0),
	(83, 41, 3097, 0, NULL, 1, 0, 0, 0, 0, 1616515424173, 0),
	(84, 41, 3235, 3, NULL, 1, 0, 0, 0, 0, 1616515432899, 0),
	(85, 15, 3097, 0, NULL, 1, 0, 0, 0, 0, 1616516582634, 0),
	(86, 15, 3098, 1, NULL, 1, 0, 0, 0, 0, 1616516586631, 0),
	(87, 15, 3216, 2, NULL, 1, 0, 0, 0, 0, 1616516590946, 0),
	(88, 15, 3235, 3, NULL, 1, 0, 0, 0, 0, 1616516597550, 0),
	(89, 15, 8159, 4, NULL, 1, 0, 0, 0, 0, 1616516604150, 0),
	(90, 15, 2319, 6, NULL, 1, 0, 0, 0, 1619108614309, 1616516614309, 0),
	(91, 15, 893, 6, NULL, 1, 0, 0, 0, 1619108618295, 1616516618295, 0),
	(92, 15, 464, 6, NULL, 1, 0, 0, 0, 1619108621993, 1616516621993, 0),
	(93, 15, 894, 6, NULL, 1, 0, 0, 0, 0, 1616516626037, 0),
	(94, 15, 1061, 6, NULL, 1, 0, 0, 0, 0, 1616516630141, 0),
	(95, 15, 1062, 6, NULL, 1, 0, 0, 0, 0, 1616516633032, 0),
	(96, 15, 1063, 6, NULL, 1, 0, 0, 0, 0, 1616516637182, 0),
	(97, 15, 1060, 6, NULL, 1, 0, 0, 0, 0, 1616516639721, 0);
/*!40000 ALTER TABLE `user_avatars` ENABLE KEYS */;

-- Dumping structure for table softboundv1.user_avatar_equiped
CREATE TABLE IF NOT EXISTS `user_avatar_equiped` (
  `Id` int(11) NOT NULL,
  `head` int(11) DEFAULT NULL,
  `body` int(11) DEFAULT NULL,
  `eyes` int(11) DEFAULT NULL,
  `flag` int(11) DEFAULT NULL,
  `background` int(11) DEFAULT NULL,
  `foreground` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table softboundv1.user_avatar_equiped: ~40 rows (approximately)
/*!40000 ALTER TABLE `user_avatar_equiped` DISABLE KEYS */;
INSERT INTO `user_avatar_equiped` (`Id`, `head`, `body`, `eyes`, `flag`, `background`, `foreground`) VALUES
	(1, 3117, 3119, 3216, 3235, 516, 430),
	(2, 180, 316, 1151, 1125, 418, 0),
	(3, 3, 4, 0, 0, 0, 0),
	(4, 1, 2, 0, 0, 0, 0),
	(5, 3, 4, 0, 0, 0, 0),
	(6, 3097, 3111, 3216, 0, 0, 0),
	(7, 3097, 3111, 3216, 3235, 0, 0),
	(8, 1, 2, 0, 0, 0, 0),
	(9, 1, 2, 0, 0, 0, 0),
	(10, 1, 2, 0, 0, 0, 0),
	(11, 1, 2, 0, 0, 0, 0),
	(12, 1, 2, 0, 0, 0, 0),
	(13, 1, 2, 0, 0, 0, 0),
	(14, 2176, 1199, 1151, 2448, 0, 0),
	(15, 3097, 3098, 3216, 3235, 8159, 0),
	(16, 1, 2, 0, 0, 0, 0),
	(17, 1, 2, 0, 0, 0, 0),
	(18, 3097, 3111, 3216, 0, 2705, 2581),
	(19, 1, 2, 0, 0, 0, 0),
	(20, 1, 2, 0, 0, 0, 0),
	(21, 549, 2, 3217, 0, 0, 0),
	(22, 3097, 3111, 3217, 0, 0, 0),
	(23, 1, 2, 0, 0, 0, 0),
	(24, 3097, 3111, 3217, 0, 0, 0),
	(25, 1, 2, 0, 0, 0, 0),
	(26, 1185, 1199, 853, 1107, 0, 0),
	(27, 1176, 1199, 853, 1107, 0, 0),
	(28, 1185, 1199, 853, 1107, 0, 0),
	(29, 1, 2, 0, 0, 0, 0),
	(30, 1, 2, 0, 0, 0, 0),
	(31, 1, 2, 0, 0, 0, 0),
	(32, 842, 550, 840, 866, 7807, 430),
	(33, 1, 2, 0, 0, 0, 0),
	(34, 1, 2, 0, 0, 0, 0),
	(35, 1, 2, 0, 0, 0, 0),
	(36, 1, 2, 0, 0, 0, 0),
	(37, 1, 2, 0, 0, 0, 0),
	(38, 1, 2, 0, 0, 0, 0),
	(39, 3097, 3111, 0, 3235, 0, 0),
	(40, 3097, 1199, 0, 3235, 0, 0),
	(41, 3097, 2, 0, 3235, 9989, 0),
	(42, 1, 2, 0, 0, 0, 0);
/*!40000 ALTER TABLE `user_avatar_equiped` ENABLE KEYS */;

-- Dumping structure for table softboundv1.user_post
CREATE TABLE IF NOT EXISTS `user_post` (
  `post_id` int(10) NOT NULL AUTO_INCREMENT,
  `user_de` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `user_para` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `texto` varchar(900) COLLATE utf8_unicode_ci NOT NULL,
  `fecha` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table softboundv1.user_post: ~0 rows (approximately)
/*!40000 ALTER TABLE `user_post` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_post` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
