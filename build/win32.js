
var childProcess, tableParser, _;

childProcess = require('child_process');

_ = require('lodash');

tableParser = require('table-parser');

exports.list = function(callback) {
  return childProcess.exec('wmic diskdrive get DeviceID, Caption, Size, Name', {}, function(error, stdout, stderr) {
    var result;
    if (error != null) {
      return callback(error);
    }
    if (!_.isEmpty(stderr)) {
      return callback(new Error(stderr));
    }
    result = tableParser.parse(stdout);
    result = _.map(result, function(row) {
      var size, _ref;
      size = _.parseInt((_ref = row.Size) != null ? _ref[0] : void 0) / 1e+9 || void 0;
      if (row.DeviceID.length > 1) {
        row.Caption = row.Caption.concat(_.initial(row.DeviceID));
      }
      return {
        device: _.last(row.DeviceID),
        description: row.Caption.join(' '),
        name: row.Name,
        size: size != null ? "" + (Math.floor(size)) + " GB" : void 0
      };
    });
    return callback(null, result);
  });
};

exports.isSystem = function(drive, callback) {
  return callback(drive.device.toUpperCase() === '\\\\.\\PHYSICALDRIVE0');
};
