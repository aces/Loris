CREATE TABLE `csrf_tokens` (
  `CsrfTokenID` int(11) NOT NULL AUTO_INCREMENT,
  `Token` varchar(64) NOT NULL,
  `CreatedAt` date NOT NULL,
  `PhpSessionID` varchar(30) NOT NULL,
  PRIMARY KEY (`CsrfTokenID`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=latin1;
