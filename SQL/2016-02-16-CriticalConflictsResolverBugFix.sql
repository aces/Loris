ALTER TABLE conflicts_unresolved MODIFY COLUMN Value1 text;
ALTER TABLE conflicts_unresolved MODIFY COLUMN Value2 text;
ALTER TABLE conflicts_resolved MODIFY COLUMN OldValue1 text;
ALTER TABLE conflicts_resolved MODIFY COLUMN OldValue2 text;
ALTER TABLE conflicts_resolved MODIFY COLUMN NewValue text;
