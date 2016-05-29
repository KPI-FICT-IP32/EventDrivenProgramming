/**
 * This is a module for "parsing" simple formulas
 *
 */

;(function() {
  "use strict";

  const root = this;
  const previous_formula = root.formula;

  const formula = {};


  formula.Formula = class {
    constructor(str, re) {
      this._str = str;
      this._cell_regex = re || /[A-Z]+[1-9][0-9]*/g;

      this.cell_names = str.match(this._cell_regex) || [];
      this._prepared = formula.Formula._prepare(this._str, this._cell_regex);
    }

    static _prepare(str, re) {
      // Remove spaces from beginning and end 
      const trimmed = str.trim();

      // Formula should start from '=' sign. Otherwise it is a text
      if (trimmed.indexOf('=') !== 0)
        return str;

      const prepared = (
        trimmed
        .slice(1)  // Remove '=' from the beginning
        .replace(re, (match) => `this.${match}`)  // TODO: improve this
      );

      return prepared;
    }

    evaluate(context) {
      const prepared = this._prepared;  // To avoid issues with context
      const _str = this._str
      /* 
       * FIXME: this is a terrible security issue
       * Any code injection is possible here
       */
      return (function() { return prepared === "" ? _str : eval(prepared); }).call(context);
    }
  }


  formula.noConflict = function() {
    root.formula = previous_formula;
    return formula;
  }


  // Export
  // Borrowed from http://goo.gl/DjzSUh
  if (typeof exports !== 'undefined' ) {
    if (typeof module !== 'undefined' && module.exports ) {
      exports = module.exports = formula
    }
    exports.formula = formula
  }
  else {
    root.formula = formula
  }
}).call(this);


/* vim: set ts=2 sw=2 tw=0 et : */
