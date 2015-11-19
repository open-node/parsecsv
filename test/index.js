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

    it('""",,,"', function(done) {
      assert.deepEqual(csv('""",,,"'), ['",,,'])
      done();
    });

    it('xxx",xxx', function(done) {
      // 这里在容错，其实已经是一个错误的格式了。
      assert.deepEqual(csv('xxx",xxx'), ['xxx"', 'xxx']);
      done();
    });

    it('xxx"xx,xxx', function(done) {
      // 这里在容错，其实已经是一个错误的格式了。
      assert.deepEqual(csv('xxx"xx,xxx'), ['xxx"xx', 'xxx']);
      done();
    });

    it('xxx"""xx,xxx', function(done) {
      // 这里在容错，其实已经是一个错误的格式了。
      assert.deepEqual(csv('xxx"""xx,xxx'), ['xxx""xx', 'xxx']);
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

  describe('Prodution env happen error', function() {
    var csv = csvFn();
    it('case 1', function(done) {
      var str = '59425,1113,0,"""三英战吕布""虐杀对决 清华男神引花痴大战_一站到底在线观看_PPTV聚力>20140731>一站到底",1,7'
        , expect = [
          '59425',
          '1113',
          '0',
          '"三英战吕布"虐杀对决 清华男神引花痴大战_一站到底在线观看_PPTV聚力>20140731>一站到底',
          '1',
          '7'
        ];
      assert.deepEqual(csv(str), expect);
      done();
    });
  });

});

