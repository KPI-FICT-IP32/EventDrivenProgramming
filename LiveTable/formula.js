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

      const {is_fm, prep} = formula.Formula._process_string(
        this._str,        // Input string
        this._cell_regex  // Cell regex
      );
      this.is_fm = is_fm;
      this._prepared = prep;
    }

    static _process_string(str, re) {
      // Formula should start from '=' sign. Otherwise it is a text
      if (str.indexOf('=') !== 0)
        return {
          is_fm: false,  // This is not a formula, but const expr
          prep : str,    // Hence return it as is
        };

      const prepared = (
        trimmed
        .slice(1)  // Remove '=' from the beginning
        .replace(re, (match) => `this.${match}`)  // TODO: improve this
      );

      return {
        is_fm: true,      // This is a calculable formula
        prep : prepared,  // Return prepared for ``eval`` string
      };
    };

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
