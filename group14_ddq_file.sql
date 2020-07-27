CREATE TABLE `Museums` (
    `museumID` INT(11) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `city` VARCHAR(255) NOT NULL,
    `country` VARCHAR(255) NOT NULL,
    `museumType` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`museumID`)
) ENGINE = InnoDB;

CREATE TABLE `Visitors` (
    `visitorID` INT(11) NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `firstName` VARCHAR(255) NOT NULL,
    `lastName` VARCHAR(255) NOT NULL,
    `isMember` BOOLEAN,
    PRIMARY KEY (`visitorID`)
) ENGINE = InnoDB;

CREATE TABLE `Media` (
    `mediaID` INT(11) NOT NULL AUTO_INCREMENT,
    `mediaType` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255),
    `artist` VARCHAR(255),
    `mediaDate` DATE,
    `museumID` INT(11) NOT NULL,
    FOREIGN KEY (`museumID`) REFERENCES `Museums` (`museumID`),
    PRIMARY KEY (`mediaID`)
) ENGINE = InnoDB;

CREATE TABLE `Tours` (
    `tourID` INT(11) NOT NULL AUTO_INCREMENT,
    `startTime` DATETIME NOT NULL,
    `endTime` DATETIME NOT NULL,
    `price` DECIMAL(5, 2) NOT NULL,
    `capacity` INT(11) NOT NULL,
    `numberEnrolled` INT(11) NOT NULL,
    `museumID` INT(11) NOT NULL,
    FOREIGN KEY (`museumID`) REFERENCES `Museums` (`museumID`),
    PRIMARY KEY (`tourID`)
) ENGINE = InnoDB;

CREATE TABLE `Museums_Visitors` (
    `museumID` INT(11) NOT NULL,
    FOREIGN KEY (`museumID`) REFERENCES `Museums` (`museumID`),
    `visitorID` INT(11) NOT NULL,
    FOREIGN KEY (`visitorID`) REFERENCES `Visitors` (`visitorID`),
    `visitDate` DATE,
    PRIMARY KEY (`museumID`, `visitorID`, `visitDate`)
) ENGINE = InnoDB;

CREATE TABLE `Tours_Visitors` (
    `museumID` INT(11) NOT NULL,
    FOREIGN KEY (`museumID`) REFERENCES `Museums` (`museumID`),
    `visitorID` INT(11) NOT NULL,
    FOREIGN KEY (`visitorID`) REFERENCES `Visitors` (`visitorID`),
    PRIMARY KEY (`museumID`, `visitorID`)
) ENGINE = InnoDB;