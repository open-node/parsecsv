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
    var l, escapes = i = 0, row = [], cell = head = char = lastChar = ''
      , cellDone = function() {
        row.push(cell.replace(/""/g, '"'));
        cell = head = lastChar = '';
        escapes = 0;
      };
    if (('string' !== typeof line) || (0 === (l = line.length))) {
      if (0 === columns) return row;
      throw Error('Argument isnt a string or empty string');
    }
    /**
     * 字段如果第一个字符是 escape 字符，则结尾必须也是 escape separator, 此时结尾处理的 escape 连续的个数是奇数个
     * 字段如果第一个字符不是 escape 字符，则遇到下一个 separator 就是字段结尾
     * 获取到的字段全部执行双双引号替换位单双引号操作，全局
     *
     * CSV 参考文献 http://baike.baidu.com/link?url=NkgYuV1aW0gfCV0StcAYEI_K2re0i1WAQGeCWtkrHHJY0xkzr8Xho1rhWeRSQl2_eawWGQ7yW-lZeQypayvA3Zr9hxNKDG2gRJvT9iBNpGK
     * 1 开头是不留空，以行为单位。
     * 2 可含或不含列名，含列名则居文件第一行。
     * 3 一行数据不跨行，无空行。
     * 4 以半角逗号（即,）作分隔符，列为空也要表达其存在。
     * 5 列内容如存在半角逗号（即,）则用半角双引号（即""）将该字段值包含起来。
     * 6 列内容如存在半角引号（即"）则应替换成半角双引号（""）转义，并用半角引号（即""）将该字段值包含起来。
     * 7 文件读写时引号，逗号操作规则互逆。
     * 8 内码格式不限，可为 ASCII、Unicode 或者其他。
     * 9 不支持特殊字符
     */
    while (i < l) {
      char = line[i];
      if (cell === '') {
        if (head === escape) { // 头部以 escape 字符开始
          cell += char;
          if (char === escape) escapes += 1;
        } else {
          if (char === separator) { // 如果第一个就是 separator, 则当前字段是空字符串
            cellDone();
          } else {
            head = char;
            if (head !== escape) {
              cell += char;
            }
          }
        }
      } else { // 当前字段已经有值了
        if (head === escape) { // 字段以 escape 字符开头，必须要等到连续 escape 个数为奇数且紧跟着 separator 字符才结束
          if (char === escape) escapes += 1;
          if (char === separator) {// 如果遇到 separator 则看 escape 的连续个数
            if (escapes % 2) { // 连续 escape 个数为奇数
              cellDone();
            } else {
              cell += char;
            }
          } else {
            if (!(escapes % 2)) cell += char;
          }
          if (char !== escape) escapes = 0;

        } else { // 字段不以 escape 开头，这个简单多了，等到 separator 结束，否则不断累积字符
          if (char === separator) {
            cellDone()
          } else {
            cell += char;
          }
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
