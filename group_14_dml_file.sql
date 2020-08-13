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

-- Query for filtering Museums entries
-- : character being used for showing variables from backend
SELECT
    museumID,
    name,
    city,
    country,
    museumType
FROM
    Museums
WHERE
    name LIKE :nameTextBox;

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

-- Query for filtering Visitors entries
-- : character being used for showing variables from backend
SELECT
    visitorID,
    email,
    firstName,
    lastName,
    IF(isMember, 'True', 'False') AS isMember
FROM
    Visitors
WHERE
    lastName LIKE :nameTextBox;

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
    med.mediaType,
    med.name,
    med.artist,
    DATE_FORMAT(med.mediaDate, '%Y') AS mediaDate,
    mus.name AS museum
FROM
    Media AS med
LEFT JOIN Museums AS mus
    USING (museumID);

-- Query for filtering Media entries
-- : character being used for showing variables from backend
SELECT
    med.mediaID,
    med.mediaType,
    med.name,
    med.artist,
    DATE_FORMAT(med.mediaDate, '%Y') AS mediaDate,
    mus.name AS museum
FROM
    Media AS med
LEFT JOIN Museums AS mus
    USING (museumID)
WHERE
    med.name LIKE :nameTextBox;

-- Query for updating Media
-- : character being used for showing variables from backend
UPDATE Media
SET
    mediaType = :mediaTypeInput,
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
INSERT INTO Tours(date, startTime, endTime, price, capacity, numberEnrolled, museumID)
VALUES
    (:dateInput, :startTimeInput, :endTimeInput, :priceInput, :capacityInput, :numberEnrolledInput, :museumIdInput);

-- Query for viewing Tours entries
SELECT
    tour.tourID,
    DATE_FORMAT(tour.date, '%m/%d/%Y') AS date,
    TIME_FORMAT(tour.startTime, '%h:%i %p') AS startTime,
    TIME_FORMAT(tour.endTime, '%h:%i %p') AS endTime,
    tour.price,
    tour.capacity,
    tour.numberEnrolled,
    mus.name AS museum
FROM
    Tours AS tour
INNER JOIN Museums AS mus
    USING (museumID);

-- Query for filtering Tours entries
-- : character being used for showing variables from backend
SELECT
    tour.tourID,
    DATE_FORMAT(tour.date, '%m/%d/%Y') AS date,
    TIME_FORMAT(tour.startTime, '%h:%i %p') AS startTime,
    TIME_FORMAT(tour.endTime, '%h:%i %p') AS endTime,
    tour.price,
    tour.capacity,
    tour.numberEnrolled,
    mus.name AS museum
FROM
    Tours AS tour
INNER JOIN Museums AS mus
    USING (museumID)
WHERE
    price = :priceTextBox;

-- Query for updating Tours
-- : character being used for showing variables from backend
UPDATE Tours
SET
    date = :dateInput
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
    mus.name AS museum,
    CONCAT_WS(', ', vis.lastName, vis.firstName) AS visitor,
    DATE_FORMAT(visitDate, '%Y-%m-%d') AS visitDate,
    mus.museumID AS museumID,
    vis.visitorID AS visitorID
FROM
    Museums_Visitors
INNER JOIN Museums AS mus
    USING (museumID)
INNER JOIN Visitors AS vis
    USING (visitorID)
ORDER BY visitDate ASC;

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
    mus.name as museum,
    DATE_FORMAT(tour.date, '%m/%d/%Y') as date,
    TIME_FORMAT(tour.startTime, '%h:%i %p') as startTime,
    tourID,
    CONCAT_WS(', ', vis.lastName, vis.firstName) AS visitor,
    visitorID
FROM
    Tours_Visitors
INNER JOIN Visitors AS  vis
    USING (visitorID)
INNER JOIN Tours AS tour
    USING (tourID)
INNER JOIN Museums AS mus
    ON mus.museumID = tour.museumID
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