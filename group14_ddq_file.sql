-- Drop tables if they exist
DROP TABLE IF EXISTS `Tours_Visitors`;
DROP TABLE IF EXISTS `Museums_Visitors`;
DROP TABLE IF EXISTS `Tours`;
DROP TABLE IF EXISTS `Media`;
DROP TABLE IF EXISTS `Visitors`;
DROP TABLE IF EXISTS `Museums`;

-- Create Museums table
CREATE TABLE `Museums` (
    `museumID` INT(11) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `city` VARCHAR(255) NOT NULL,
    `country` VARCHAR(255) NOT NULL,
    `museumType` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`museumID`)
) ENGINE = InnoDB;

-- Create Visitors table
CREATE TABLE `Visitors` (
    `visitorID` INT(11) NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `firstName` VARCHAR(255) NOT NULL,
    `lastName` VARCHAR(255) NOT NULL,
    `isMember` BOOLEAN,
    PRIMARY KEY (`visitorID`)
) ENGINE = InnoDB;

-- Create Media table
CREATE TABLE `Media` (
    `mediaID` INT(11) NOT NULL AUTO_INCREMENT,
    `mediaType` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255),
    `artist` VARCHAR(255),
    `mediaDate` DATE,
    `museumID` INT(11) NOT NULL,
    PRIMARY KEY (`mediaID`),
    FOREIGN KEY (`museumID`) REFERENCES `Museums` (`museumID`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- Create Tours table
CREATE TABLE `Tours` (
    `tourID` INT(11) NOT NULL AUTO_INCREMENT,
    `startTime` DATETIME NOT NULL,
    `endTime` DATETIME NOT NULL,
    `price` DECIMAL(5, 2) NOT NULL,
    `capacity` INT(11) NOT NULL,
    `numberEnrolled` INT(11) NOT NULL,
    `museumID` INT(11) NOT NULL,
    PRIMARY KEY (`tourID`),
    FOREIGN KEY (`museumID`) REFERENCES `Museums` (`museumID`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- Create Museums_Visitors table
CREATE TABLE `Museums_Visitors` (
    `museumID` INT(11) NOT NULL,
    `visitorID` INT(11) NOT NULL,
    `visitDate` DATE,
    PRIMARY KEY (`museumID`, `visitorID`, `visitDate`),
    FOREIGN KEY (`museumID`) REFERENCES `Museums` (`museumID`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`visitorID`) REFERENCES `Visitors` (`visitorID`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- Create Tours_Visitors table
CREATE TABLE `Tours_Visitors` (
    `museumID` INT(11) NOT NULL,
    `visitorID` INT(11) NOT NULL,
    PRIMARY KEY (`museumID`, `visitorID`),
    FOREIGN KEY (`museumID`) REFERENCES `Museums` (`museumID`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`visitorID`) REFERENCES `Visitors` (`visitorID`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;