const parse = require("./logicParser.js").parse;


class InstrumentLogicParser {
    static evaluate(logicString, context) {
        
        if (!logicString) {
            throw new Error('You must pass a non-empty string');
        }
        const expression = parse(logicString);
        return  new Function('return ' + expression).call(context);

    }
}

export default InstrumentLogicParser;
