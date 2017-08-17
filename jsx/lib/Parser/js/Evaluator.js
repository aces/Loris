import Functions from './Functions';
import { parser } from './logicParser';

function evalAST(tree, scope) {
  switch(tree.tag) {
    case 'String': {
      return String(tree.args[0].slice(1,-1));
    }
    case 'Literal': {
      return tree.args[0];
    }
    case 'Variable': {
      if (typeof scope[tree.args[0]] === 'undefined') {
        throw new UndefinedVariableError(`Unbound variable: ${tree.args[0]}`);
      }
      if (scope[tree.args[0]] === null) {
        throw new NullVariableError(`Null variable: ${tree.args[0]}`);
      }
      return scope[tree.args[0]];
    }
    case 'NestedVariables': {
      if (typeof scope[tree.args[0]] === 'undefined') {
        throw new UndefinedVariableError(`Unbound variable: ${tree.args[0]}`);
      }
      if (scope[tree.args[0]] === null) {
        throw new NullVariableError(`Null variable: ${tree.args[0]}`);
      }
      var res = scope[tree.args[0]];
      for (var i = 0; i < tree.args[1].length; i++) {
        if (typeof res[tree.args[1][i]] === 'undefined') {
          throw new UndefinedVariableError(`Unbound sub-variable: ${tree.args[0]}`);
        }
        if (res[tree.args[1][i]] === null) {
          throw new NullVariableError(`Null sub-variable: ${tree.args[0]}`);
        }
        res = res[tree.args[1][i]];
      }
      return res;
    }
    case 'FuncApplication': {
      if (tree.args[0] === 'if') {
        if (evalAST(tree.args[1][0], scope)) {
          return evalAST(tree.args[1][1],scope);
        }
        return evalAST(tree.args[1][2],scope);
      }
      if (!Functions[tree.args[0]]) {
        throw new Error(`${tree.args[0]} is not a defined function.`);
      }
      const funcArgs = tree.args[1].map(ast => evalAST(ast, scope));
      return Functions[tree.args[0]](...funcArgs);
    }
    case 'NestedExpression': {
      return evalAST(tree.args[0], scope);
    }
    case 'UnaryOp': {
      return Functions[tree.op](evalAST(tree.args[0],scope));
    }
    case 'BinaryOp': {
      const funcArgs = tree.args.map(ast => evalAST(ast, scope));
      const castedFuncArgs = funcArgs.map(arg => (Number(arg) || Number(arg) === 0) ? Number(arg) : arg);
      return Functions[tree.op](...castedFuncArgs);
    }
  }
}

export default function Evaluator(stringExpression, scope = {}) {
  if (stringExpression === '') {
      return '';
  }
  if (stringExpression === null) {
      return null;
  }
  let tree;
  try {
      tree = parser.parse(stringExpression);
  } catch (e) {
      throw new ParseError(`Parsing error; please review Syntax\n${e}`);
  }
  return evalAST(tree, scope);
}

class ParseError {
  constructor(message) {
    this.name = 'ParseError';
    this.message = message;
    this.stack = new Error().stack;
  }
}

ParseError.prototype = Object.create(Error.prototype);

class UndefinedVariableError {
  constructor(message) {
    this.name = 'UndefinedVariableError';
    this.message = message;
    this.stack = new Error().stack;
  }
}
UndefinedVariableError.prototype = Object.create(Error.prototype);


class NullVariableError {
  constructor(message) {
    this.name = 'NullVariableError';
    this.message = message;
    this.stack = new Error().stack;
  }
}

NullVariableError.prototype = Object.create(Error.prototype);

export { ParseError, UndefinedVariableError, NullVariableError };
