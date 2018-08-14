CREATE TABLE `csrf_tokens` (
  `CsrfTokenID` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `Token` varchar(64) NOT NULL,
  `CreatedAt` date NOT NULL,
  `PhpSessionID` varchar(30) NOT NULL,
  PRIMARY KEY (`CsrfTokenID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
