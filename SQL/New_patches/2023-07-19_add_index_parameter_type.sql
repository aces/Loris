-- Index on parameter_type table to speed up the "Description" field on conflict_resolver.
CREATE INDEX idx_conflictResolverDesc ON parameter_type(SourceFrom(255),SourceField(255));