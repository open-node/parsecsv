/**
 * parse maker
 * @param Hash opts
 *   opts.separator defaultValue ','
 *   opts.escape defaultValue '"'
 *   opts.columns defaultValue 0 require column length match this value when not equal 0
 *
 * @return Function parser
 */
module.exports = function(opts) {
  opts = opts || {};
  var separator = opts.separator || ','
    , escape = opts.escape || '"'
    , columns = +opts.columns || 0;

  /**
   * parser
   * @param String line
   *
   * @return Array []
   */
  return function(line) {
    var l, i = 0, row = [], cell = head = char = lastChar = ''
      , cellDone = function() {
        row.push(cell);
        cell = head = lastChar = '';
      };
    if (('string' !== typeof line) || (0 === (l = line.length))) {
      if (0 === columns) return row;
      throw Error('Argument isnt a string or empty string');
    }
    while (i < l) {
      char = line[i]
      if (cell === '') { // new cell
        if (char === escape) { // "xxx
          if (line[i + 1] === escape) { // ""xxx
            lastChar = escape;
            cell += lastChar;
            i += 1;
          } else { // """xxx、"xxxx
            if ((lastChar === escape) || (lastChar === '')) { // """xxx、"x, """""xxxxx
              head = escape;
            }
          }
        } else if (char === separator) { // ","、xxx,xxx、,xxx,xxx、,,,
          if (head === escape) { // ",",xxx
            cell += char;
          } else { // xx,xxx、,xxx,xxx、,,,
            cellDone()
          }
        } else {
          cell += char
        }
      } else { // cell exists
        if (char === escape) { // xx"xx、xx""xx、xx"""xx
          if (line[i + 1] === escape) { // xx""xx、xx"""xx
            lastChar = escape;
            cell += lastChar;
            i += 1;
          } else if (line[i + 1] === separator) { // xxx",xxx、"xxx,xxx",xxxx
            if (head === escape) { // "xxx,xxx",xxxx
              i += 1
              cellDone();
            } else { // xxx",xxx
              throw Error("Format error, 'xxx\",xxx'");
            }
          } else { // xx"xx、xx"""xx、xx"""""xx、 ","
            if (i + 1 !== l) {
              throw Error("Format error, 'xx\"xx、xx\"\"\"xx");
            }
          }
        } else if (char === separator) { // "xxx,xxx"、xxx,xxx
          if (head === escape) { // ”xxx,xxx"
            cell += char;
          } else { // xxx,xxx
            cellDone()
          }
        } else {
          lastChar = char
          cell += char
        }
      }
      i += 1;
    }
    cellDone();
    if (columns && columns !== row.length) {
      throw Error('Format error, column length error: ' + columns + ' :: ' + row.length);
    }
    return row;
  };
};
