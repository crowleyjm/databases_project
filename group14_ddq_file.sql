CREATE TABLE `Museums` (
    `museumID` int(11) NOT NULL AUTO_INCREMENT,
) ENGINE = InnoDB;

CREATE TABLE `Visitors` (
    `visitorID` int(11) NOT NULL AUTO_INCREMENT,
) ENGINE = InnoDB;

CREATE TABLE `Media` (
    `mediaID` int(11) NOT NULL AUTO_INCREMENT,
) ENGINE = InnoDB;

CREATE TABLE `Tours` (
    `tourID` int(11) NOT NULL AUTO_INCREMENT,
) ENGINE = InnoDB;

CREATE TABLE `Museums_Visitors` (
) ENGINE = InnoDB;

CREATE TABLE `Tours_Visitors` (
) ENGINE = InnoDB;