var fs = require('fs');

desc('Run foounit node specs');
namespace('spec', function (){
  task('node', [], function (){
    var foounit = require('foounit').globalize();
    foounit.mount('src',  __dirname + '/src');
    foounit.mount('test', __dirname + '/spec');

    foounit.getSuite().addFile(':test/spec.js');
    foounit.getSuite().run();
  });
});

