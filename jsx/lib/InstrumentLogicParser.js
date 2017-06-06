class InstrumentLogicParser {
    var parser = require("./logicParser.js").parser;
    static parse(logicString) {
        if (!logicString) {
            throw new Error('You must pass a non-empty string');
        }
        return 'return ' + parser.parse(logicString);
    }
}

export default InstrumentLogicParser;
