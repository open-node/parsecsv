var assert = require('assert')
  , csvFn  = require( '../');

describe('Csv', function() {

  describe('normal default params parser', function() {

    var csv = csvFn();

    it('hello,world,niu,bi', function(done) {
      assert.deepEqual(csv('hello,world,niu,bi'), ['hello', 'world', 'niu', 'bi']);
      done();
    });

    it('"he,llo",world,niu,bi', function(done) {
      assert.deepEqual(csv('"he,llo",world,niu,bi'), ['he,llo', 'world', 'niu', 'bi']);
      done();
    });

    it('"he,llo""",world,niu,bi', function(done) {
      assert.deepEqual(csv('"he,llo""",world,niu,bi'), ['he,llo"', 'world', 'niu', 'bi']);
      done();
    });

    it('"he,llo""",world,niu,b""i', function(done) {
      assert.deepEqual(csv('"he,llo""",world,niu,b""i'), ['he,llo"', 'world', 'niu', 'b"i']);
      done();
    });

    it('"he,llo""","wor"",ld",niu,b""i', function(done) {
      assert.deepEqual(csv('"he,llo""","wor"",ld",niu,b""i'), ['he,llo"', 'wor",ld', 'niu', 'b"i']);
      done();
    });

    it(',,hello', function(done) {
      assert.deepEqual(csv(',,hello'), ['', '', 'hello']);
      done();
    });

    it(',"x,x",hello', function(done) {
      assert.deepEqual(csv(',"x,x",hello'), ['', 'x,x', 'hello']);
      done();
    });

    it('","', function(done) {
      assert.deepEqual(csv('","'), [',']);
      done();
    });

    it('",",hello,world', function(done) {
      assert.deepEqual(csv('",",hello,world'), [',', 'hello', 'world']);
      done();
    });

    it('",",,', function(done) {
      assert.deepEqual(csv('",",,'), [',', '', '']);
      done();
    });

    it('",",中\'国,world', function(done) {
      assert.deepEqual(csv('",",中\'国,world'), [',', '中\'国', 'world']);
      done();
    });

    it('",",",",中\'国,world', function(done) {
      assert.deepEqual(csv('",",",",中\'国,world'), [',', ',', '中\'国', 'world']);
      done();
    });

    it('",,,"', function(done) {
      assert.deepEqual(csv('",,,"'), [',,,']);
      done();
    });

    it('"",,,"', function(done) {
      assert.throws(function() {
        csv('""",,,"');
      }, Error);
      done();
    });

    it('xxx",xxx', function(done) {
      assert.throws(function() {
        csv('xxx",xxx');
      }, Error);
      done();
    });

    it('xxx"xx,xxx', function(done) {
      assert.throws(function() {
        csv('xxx"xx,xxx');
      }, Error);
      done();
    });

    it('xxx"""xx,xxx', function(done) {
      assert.throws(function() {
        csv('xxx"""xx,xxx');
      }, Error);
      done();
    });

  });

  describe('columns not equal 0 parser', function() {
    var csv = csvFn({columns: 4});

    it('hello,world,niu,bi', function(done) {
      assert.deepEqual(csv('hello,world,niu,bi'), ['hello', 'world', 'niu', 'bi']);
      done();
    });

    it('hello,world,niu', function(done) {
      assert.throws(function() {
        csv('hello,world,niu');
      }, Error);
      done();
    });

    it('line is undefined', function(done) {
      assert.throws(function() {
        csv();
      }, Error);
      done();
    });

    it('line is empty string', function(done) {
      assert.throws(function() {
        csv();
      }, Error);
      done();
    });
  });

});

