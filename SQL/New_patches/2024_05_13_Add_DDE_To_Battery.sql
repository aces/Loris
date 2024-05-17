ALTER TABLE test_battery ADD COLUMN DoubleDataEntryEnabled BOOLEAN DEFAULT FALSE;

UPDATE test_battery SET DoubleDataEntryEnabled = 1 WHERE Test_name IN (
    SELECT Value from Config WHERE ConfigID = (SELECT ID FROM ConfigSettings WHERE Name = 'DoubleDataEntryInstruments')
)

DELETE FROM Config WHERE ConfigID IN (SELECT ID FROM ConfigSettings WHERE Name = 'DoubleDataEntryInstruments');

DELETE FROM ConfigSettings WHERE Name = 'DoubleDataEntryInstruments';
