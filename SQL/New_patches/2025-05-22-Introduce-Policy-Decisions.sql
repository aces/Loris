CREATE TABLE policies (
    PolicyID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Version INT NOT NULL,
    ModuleID INT NOT NULL, -- Show in the header for a module
    PolicyRenewalTime INT DEFAULT 7, -- Number of days before the policy is renewed
    PolicyRenewalTimeUnit enum('D','Y','M','H') DEFAULT 'D', -- Unit of the renewal time
    Content TEXT NULL,
    SwalTitle VARCHAR(255) DEFAULT 'Terms of Use',
    HeaderButton enum('Y','N') DEFAULT 'Y',
    HeaderButtonText VARCHAR(255) DEFAULT 'Terms of Use',
    Active enum('Y','N') DEFAULT 'Y',
    AcceptButtonText VARCHAR(255) DEFAULT 'Accept',
    DeclineButtonText VARCHAR(255) DEFAULT 'Decline',
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE user_policy_decision (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    PolicyID INT NOT NULL,
    Decision enum('Accepted','Declined') NOT NULL,
    DecisionDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO modules (`Name`, `Active`) VALUES ('policy_tracker','Y');