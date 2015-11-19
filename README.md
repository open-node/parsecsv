# Parse standard csv or like csv format

## example

```sh
npm install parsecsv --save
```

```js
var csv = require('parsecsv')();

var row = csv(line);
// when line is 'hello,world'
// row is ['hello', 'world']
```

##  options
```js
csv = require('parsecsv')({
  separator: ',' // separator char default ','
  escape: '"', // escape char, default '"'
  columns: 0, // if check column length
});
```


## license: MIT

## Author: Redstone Zhao
