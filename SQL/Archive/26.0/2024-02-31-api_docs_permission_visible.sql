UPDATE permissions SET moduleID = (SELECT ID FROM modules WHERE Name='api_docs'), description = "LORIS API Manual", `action` = "View" WHERE code = "api_docs";

