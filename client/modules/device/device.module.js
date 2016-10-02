angular
    .module('device', ['ui-notification', 'lbServices'])
    .controller('DeviceController', function DefaultController($scope, Notification, $state, UserDevices, currentUserId) {
        var self = this

        this.loading = false;
        this.userDevices = []

        this.refresh = function() {
          self.loading = true
          return UserDevices.find({
            filter: {limit: 10, order: 'created DESC', where: {userId: currentUserId}}
          }).$promise.then(
            function(userDevices){
              self.userDevices = userDevices
              self.loading = false
            },
            function(err){
              self.loading = false
              debugger
            }
          )
        }

        $scope.serverValidationErrors = {}
        $scope.newDevice = {
          deviceId: ''
        }

        this.save = function($form) {
          if($form.$invalid) {
            return
          }
          UserDevices.add($scope.newDevice).$promise.then(
            function(device){
              self.refresh()
              $form.$submitted = false
              $scope.newDevice.deviceId = ''
              Notification.success('New device added successfully!')
            },
            function(err){
              $scope.serverValidationErrors = err.data.error.details
              $form.$submitted = false
            }
          )
        }

        //Let's see
        this.refresh()
    })
