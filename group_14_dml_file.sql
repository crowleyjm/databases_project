-- Query for adding to Museums
-- : character being used for showing variables from backend
INSERT INTO Museums(name, city, country, museumType)
VALUES 
    (:nameInput:, :cityInput, :countryInput, :museumTypeInput);

-- Query for viewing Museums entries
SELECT
    museumID,
    name,
    city,
    country,
    museumType
FROM
    Museums;

-- Query for updating Museums
-- : character being used for showing variables from backend
UPDATE Museums
SET
    name = :nameInput,
    city = :cityInput,
    country = :countryInput,
    museumType = :museumTypeInput
WHERE
    museumID = :museumIdInput;

-- Query for deleting from Museums
-- : character being used for showing variables from backend
DELETE FROM Museums
WHERE
    museumID = :museumIdInput;

-- Query for adding to Visitors
-- : character being used for showing variables from backend
INSERT INTO Visitors(email, firstName, lastName, isMember)
VALUES
    (:emailInput, :firstNameInput, :lastNameInput, :isMemberDropdownInput);

-- Query for viewing Visitors entries
SELECT
    visitorID,
    email,
    firstName,
    lastName,
    IF(isMember, 'True', 'False') AS isMember
FROM
    Visitors;

-- Query for updating Visitors
-- : character being used for showing variables from backend
UPDATE Visitors
SET
    email = :emailInput,
    firstName = :firstNameInput,
    lastName = :lastNameInput,
    isMember = :isMemberDropdownInput
WHERE
    visitorID = :visitorIdInput;

-- Query for deleting from Visitors
-- : character being used for showing variables from backend
DELETE FROM Visitors
WHERE
    visitorID = :visitorIdInput;

-- Query for adding to Media
-- : character being used for showing variables from backend
INSERT INTO Media(mediaType, name, artist, mediaDate, museumID)
VALUES
    (:mediaTypeInput, :nameInput, :artistInput, :mediaDateInput, :museumIdInput);

-- Query for viewing Media entries
SELECT
    med.mediaID,
    med.name,
    med.artist,
    DATE_FORMAT(med.mediaDate, '%Y') as mediaDate,
    mus.name as Museum
FROM
    Media as med
INNER JOIN Museums as mus
    USING (museumID);

-- Query for updating Media
-- : character being used for showing variables from backend
UPDATE Media
SET
    name = :nameInput,
    artist = :atristInput,
    mediaDate = :mediaDateInput,
    museumID = :museumIdInput
WHERE
    mediaID = :mediaIdInput;

-- Query for deleting from Media
-- : character being used for showing variables from backend
DELETE FROM Media
WHERE
    mediaID = :mediaIdInput;

-- Query for adding to Tours
-- : character being used for showing variables from backend
INSERT INTO Tours(startTime, endTime, price, capacity, numberEnrolled, museumID)
VALUES
    (:startTimeInput, :endTimeInput, :priceInput, :capacityInput, :numberEnrolledInput, :museumIdInput);

-- Query for viewing Tours entries
SELECT
    tour.tourID,
    tour.startTime,
    tour.endTime,
    tour.price,
    tour.capacity,
    tour.numberEnrolled,
    mus.name as Museum
FROM
    Tours as tour
INNER JOIN Museums as mus
    USING (museumID);

-- Query for updating Tours
-- : character being used for showing variables from backend
UPDATE Tours
SET
    startTime = :startTimeInput,
    endTime = :endTimeInput,
    price = :priceInput,
    capacity = :capacityInput
    numberEnrolled = :numberEnrolledInput
    musuemID = :museumIdInput
WHERE
    tourID = :tourIdInput;

-- Query for deleting from Tours
-- : character being used for showing variables from backend
DELETE FROM Tours
WHERE
    tourID = :tourIdInput;

-- Query for adding to Museums_Visitors
-- : character being used for showing variables from backend
INSERT INTO Museums_Visitors(museumID, visitorID, visitDate)
VALUES
    (:museumIdInput, :visitorIdInput, :visitDateInput);

-- Query for viewing Museums_Visitors entries
SELECT
    mus.name as Museum,
    CONCAT_WS(', ', vis.lastName, vis.firstName) as Visitor,
    visitDate
FROM
    Museums_Visitors
INNER JOIN Museums as mus
    USING (museumID)
INNER JOIN Visitors as vis
    USING (visitorID);

-- Query for updating Museums_Visitors
-- : character being used for showing variables from backend
UPDATE Museums_Visitors
SET
    museumID = :museumIdInput,
    visitorID = :visitorIdInput,
    visitDate = :visitDateInput,
WHERE
    museumID = :currentMuseumId AND
    visitorID = :currentVisitorId AND
    visitDate = :currentVisitDate;

-- Query for deleting from Museums_Visitors
-- : character being used for showing variables from backend
DELETE FROM Museums_Visitors
WHERE
    museumID = :currentMuseumId AND
    visitorID = :currentVisitorId AND
    visitDate = :currentVisitDate;

-- Query for adding to Tours_Visitors
-- : character being used for showing variables from backend
INSERT INTO Tours_Visitors (tourID, visitorID)
VALUES
    (tourIdInput, visitorIdInput);

-- Query for viewing Tours_Visitors entries
SELECT
    tourID,
    CONCAT_WS(', ', vis.lastName, vis.firstName) as Visitor
FROM
    Tours_Visitors
INNER JOIN Visitors as  vis
    USING (visitorID)
ORDER BY tourID ASC;

-- Query for updating Tours_Visitors
-- : character being used for showing variables from backend
UPDATE Tours_Visitors
SET
    tourID = :tourIdInput,
    visitorID = :visitorIdInput,
WHERE
    tourID = :currentTourId AND
    visitorID = :currentVisitorId;

-- Query for deleting from Tours_Visitors
-- : character being used for showing variables from backend
DELETE FROM Tours_Visitors
WHERE
    tourID = :currentTourId AND
    visitorID = :currentVisitorId;