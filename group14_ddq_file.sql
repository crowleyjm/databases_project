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
    `tourID` INT(11) NOT NULL,
    `visitorID` INT(11) NOT NULL,
    PRIMARY KEY (`tourID`, `visitorID`),
    FOREIGN KEY (`tourID`) REFERENCES `Tours` (`tourID`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`visitorID`) REFERENCES `Visitors` (`visitorID`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- Insert sample data into Museums
INSERT INTO `Museums` (`name`, `city`, `country`, `museumType`)
VALUES
    ('Metropolitan Museum of Art', 'New York City', 'United States', 'Art'),
    ('National Air and Space Museum', 'Washington, D.C.', 'United States', 'Science'),
    ('National Museum of Natural History', 'Washington, D.C.', 'United States', 'Natural History');

-- Insert sample data into Visitors
INSERT INTO `Visitors` (`email`, `firstName`, `lastName`, `isMember`)
VALUES
    ('john@smith.com', 'John', 'Smith', true),
    ('jane@doe.com', 'Jane', 'Doe', true),
    ('steve@johnson.com', 'Steve', 'Johnson', false);

-- Insert sample data into Media
INSERT INTO `Media` (`mediaType`, `name`, `artist`, `mediaDate`, `museumID`)
VALUES
    ('Art', 'Washington Crossing the Delaware', 'Emanuel Leutze', '1851-1-1', 1),
    ('Fossil', 'Wankel Rex', null, null, 3),
    ('Display', 'Apollo 11 Command Module Columbia', null, null, 2);

-- Insert sample data into Tours
INSERT INTO `Tours` (`startTime`, `endTime`, `price`, `capacity`, `numberEnrolled`, `museumID`)
VALUES
    ('2020-1-1 12:00:00', '2020-1-1 13:00:00', 25.00, 100, 25, 1),
    ('2020-6-5 8:00:00', '2020-6-5 10:00:00', 40.00, 75, 42, 3),
    ('2020-3-4 15:00:00', '2020-3-4 15:30:00', 20.00, 100, 32, 2);

-- Insert sample data into Museums_Visitors
INSERT INTO `Museums_Visitors` (`museumID`, `visitorID`, `visitDate`)
VALUES
    (1, 1, '2020-1-1'),
    (2, 2, '2020-3-4'),
    (3, 3, '2020-2-3');

-- Insert sample data into Tours_Visitors
INSERT INTO `Tours_Visitors` (`tourID`, `visitorID`)
VALUES
    (1, 1),
    (3, 2),
    (2, 3);