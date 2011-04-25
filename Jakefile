var fs = require('fs');

desc('Run foounit node specs');
namespace('spec', function (){
  task('node', [], function (){
    var foounit = require('./spec/foounit/foounit-node');
    foounit.mount('src',  __dirname + '/src');
    foounit.mount('test', __dirname + '/spec');

    foounit.getSuite().addFile(':test/spec.js');
    foounit.getSuite().run();
  });
});

