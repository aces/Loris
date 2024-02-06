CREATE TABLE `openid_connect_providers` (
    `OpenIDProviderID` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `Name` varchar(255) NOT NULL,
    `BaseURI` text NOT NULL, -- the provider's base uri that hosts .well-known/openid-configuration
    `ClientID` text NOT NULL,
    `ClientSecret` text NOT NULL,
    `RedirectURI` text NOT NULL, -- our local redirectURI that the provider is configured to authorize
                                 -- should be something like "https://something.loris.ca/oidc/callback"
    PRIMARY KEY (`OpenIDProviderID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `openid_connect_csrf` (
    `State` varchar(64) NOT NULL UNIQUE,
    `OpenIDProviderID` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `Nonce` varchar(64) NOT NULL,
    `Created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`State`),
    CONSTRAINT `FK_openid_provider` FOREIGN KEY (`OpenIDProviderID`) REFERENCES `openid_connect_providers` (`OpenIDProviderID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
