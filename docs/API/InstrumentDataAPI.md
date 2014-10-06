This file describes the REST API to be implemented for interacting with Loris data
====

Instrument API:

-- For getting/updating forms/rules.
GET /api/v0.0.1a-dev/Instrument/Form/$InstrumentName?Form=true&Rules=true
POST /api/v0.0.1a-dev/Instrument/Form/$InstrumentName?Form=true&Rules=true

GET /api/v0.0.1a-dev/Instrument/Flags/$CommentID
POST /api/v0.0.1a-dev/Instrument/Flags/$CommentID

GET /api/v0.0.1a-dev/Instrument/Data/$CommentID
POST /api/v.0.1a-dev/Instrument/Data/$CommentID
-- Returns JSON
-- Body includes JSON of instrument

Candidate API:
-- Getting Candidate data (such as list of Visits):
GET /api/v0.0.1a-dev/$CandID
-- Getting session data (such as list of instruments, files, documents..)
GET /api/v0.0.1a-dev/$CandID/$VisitLabel?IncludeInstruments=true&IncludeImages=true&IncludeDocuments=false
-- Getting / updating instrument data through candidate API
-- Behaviour mirrors instrument API, but does not require knowledge of
-- CommentID
GET /api/v0.0.1a-dev/$CandID/$VisitLabel/Instruments/$InstrumentName&DDE=false
POST /api/v0.0.1a-dev/$CandID/$VisitLabel/Instruments/$InstrumentName&DDE=false
GET /api/v0.0.1a-dev/$CandID/$VisitLabel/Instruments/$InstrumentName/Flags&DDE=false
POST /api/v0.0.1a-dev/$CandID/$VisitLabel/Instruments/$InstrumentName/Flags&DDE=false
