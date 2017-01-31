var child_process = require('child_process');

var exec = child_process.exec;
var options = {
  timeout: 10000,
  killSignal: 'SIGKILL'
};

//generates tests
exec(`node ./lib/generate-test.js`, options, function(err,stdout,stderr) {
  if (err) {
    console.log('Child process exited with error code', err.code);
    return;
  }
  //starts server
  let [app, server] = require('../index.js');

  exec(`mocha ./test/generated-tests/*.js`, options, function(err,stdout,stderr) {
    if (err) {
      console.log('Child process exited with error code', err.code);
      return;
    }
    console.log(stdout);

    server.close();
    console.log('server closed');
    return;
  });
});
