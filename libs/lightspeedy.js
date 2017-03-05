const Nightmare = require('nightmare');
const through = require('through2');
const nightmareLightspeed = require('./nightmare-lightspeed');

const Lightspeedy = function(config) {
  var _self = this;
  _self.config = config;
  _self.queue = [];

  return this;
}

Lightspeedy.prototype.addJob = function(job) {
  var _self = this;
  return _self.queue.push(job);
}

Lightspeedy.prototype.step = function(cb) {
  var _self = this;
  if (cb) {
    _self.cb = cb;
  }

  var _self = this;
  if (_self.queue.length) {
    _self.exe(_self.queue.pop())
  } else {
    // console.log('⚡️⚡️⚡️ Finished.');
    if (_self.cb) {
      _self.cb();
    }
  }
}

Lightspeedy.prototype.exe = function(job) {
  let _self = this;
  let nightmare = Nightmare({
    show: false
  });

  // console.log('Executing:', job.url)
  return nightmare
    .goto(job.url)
    .use(nightmareLightspeed.login(_self.config.email, _self.config.password))
    .use(nightmareLightspeed.update(job.content))
    .wait(250)
    .then(function (result) {
      _self.step();
    })
    .catch(err=> {
      console.log(err);
    })
}

/**
 *
 * @param config {
 *   showNightmare: boolean
 * }
 */
module.exports = function(config) {

  // console.log('⚡️ Config', config);

  var lightspeedy = new Lightspeedy(config);

  let transform = function(file, encoding, callback) {
    if (file.isNull()) {
      console.log('⚡️ Null file passed', file);
      return callback(null, file);
    }

    let fileKey = file.path.replace(file.cwd + '/src/','');

    if (file.isStream()) {
      // file.contents is a Stream
      console.log('Stream passed.', file);
      return callback(null, file);
    } else if (file.isBuffer()) {
      let fileContents = file.contents.toString();
      let editorUrl = config.storeUrl + 'admin/themes/' + config.themeId + '/templates?key=' + fileKey;
      console.log('⚡️ Updating:', fileKey);
      lightspeedy.addJob({
        url: editorUrl,
        content: fileContents
      });

      return callback();
    }
  }

  let endOfStream = (cb) => {
    // console.log(`⚡️ Queued ${lightspeedy.queue.length}`);
    lightspeedy.step(cb);
    return;
  };

  return through.obj(transform, endOfStream)
};