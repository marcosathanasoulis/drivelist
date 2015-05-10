var childProcess, tableParser, _;

childProcess = require('child_process');

_ = require('lodash');

tableParser = require('table-parser');

exports.list = function(callback) {
  return childProcess.exec('powershell.exe "Get-WmiObject -class Win32_Volume | Select-Object DeviceID,DriveLetter"', {}, function(error, stdout, stderr) {
    var result;
    if (error != null) {
      return callback(error);
    }
    if (!_.isEmpty(stderr)) {
      return callback(new Error(stderr));
    }
    result = tableParser.parse(stdout);
    result = _.map(result, function(row) {
      if (row.DeviceID.length > 1) {
        row.Caption = row.Caption.concat(_.initial(row.DeviceID));
      }
      return {
        device: _.last(row.DeviceID),
        name: row.Name,
      };
    });
    return callback(null, result);
  });
};

exports.isSystem = function(drive, callback) {
  return callback(drive.device.toUpperCase() === '\\\\.\\PHYSICALDRIVE0');
};
