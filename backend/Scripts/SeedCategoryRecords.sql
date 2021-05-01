DECLARE @CategoryId INT;
SET @CategoryId = 2;

DELETE FROM Records
WHERE CategoryId = @CategoryId;

INSERT INTO Records VALUES
	('2021-04-25T12:00:00', NULL, 5,  @CategoryId),
	('2021-04-25T18:00:00', NULL, 10, @CategoryId),
	('2021-04-26T12:00:00', NULL, 12, @CategoryId),
	('2021-04-26T18:00:00', NULL, 0,  @CategoryId),
	('2021-04-27T12:00:00', NULL, -3, @CategoryId),
	('2021-04-30T09:00:00', NULL, 6,  @CategoryId);