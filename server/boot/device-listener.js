'use strict';
var util = require('util');

module.exports = function(app) {
  var router = app.loopback.Router();
  router.get('/values/:deviceId', function(req, res) {
    console.log(req.query)
    console.log(req.params)
    var query = req.query;
    var model = app.models.DeviceMetrics;

    if(query.pmv && query.pmc && query.pmw && query.pmwh) {
      model.create({
        deviceId: req.params.deviceId,
        pmv: query.pmv,
        pmc: query.pmc,
        pmw: query.pmw,
        pmwh: query.pmwh,
        createdAt: Date.now()/1000
      }, function(err, row) {
        if(err) {
          console.log(err)
          res.send(500, 'Error when saving');
        } else {
          console.log(row)
          res.send('Data successfully saved');
        }
      })
    } else {
      var errorMsg = '';
      if(!query.pmv) {
        errorMsg += "No 'pmv' param present \n"
      }
      if(!query.pmc) {
        errorMsg += "No 'pmc' param present \n"
      }
      if(!query.pmw) {
        errorMsg += "No 'pmw' param present \n"
      }
      if(!query.pmwh) {
        errorMsg += "No 'pmwh' param present \n"
      }
      res.send(400, errorMsg);
    }

  });
  app.use(router);
}
