angular.module('starter.controllers', [])
    .controller('layoutCtrl', ['$scope', 'app365api', function($scope, app365api) {
        var vm = this;

        vm.getusername = function() {
            // Get signed-in user name.
            vm.userName = app365api.getUserName();
        };

        vm.getusername();
    }])
    .controller('o365Ctrl', ['$scope', 'app365api', '$state', function($scope, app365api, $state) {

        $scope.signIn = function() {
            app365api.login(function(reason) {
                if (typeof reason == 'undefined') {
                    $state.go('tab.calendar');
                }
            });
            // $state.go('tab.calendar');
        }
    }])
    .controller('signOutCtrl', ['$scope', '$state', 'app365api', function($scope, $state, app365api) {
        var vm = this;
        console.log('signOutCtrl');

        vm.signout = function() {
            console.log('signout');
            // Logout and navigate to sign-in page.
            app365api.logout();
            $state.go('sign-in');
        }

        vm.signout();
    }])
    .controller('newEventCtrl', ['$scope', '$state', '$ionicLoading', 'app365api', function($scope, $state, $ionicLoading, app365api) {
        var vm = this;
        var outlookClient;
        $scope.newEvent = {};

        // Add event
        $scope.addEvent = function() {
            // Get Outlook client object.
            outlookClient = app365api.outlookClientObj();
            // Event body content
            var eventBody = new Microsoft.OutlookServices.ItemBody();
            eventBody.contentType = Microsoft.OutlookServices.BodyType.HTML;
            eventBody.content = $scope.newEvent.body;
            // Event attendee.
            var attendee = new Microsoft.OutlookServices.Attendee();
            // Attendee email address.
            var emailAddress = new Microsoft.OutlookServices.EmailAddress();
            emailAddress.address = $scope.newEvent.toRecipients;
            attendee.emailAddress = emailAddress;
            // Event object.
            var event = new Microsoft.OutlookServices.Event();
            // Event start date.
            event.start = new Date($scope.newEvent.start).toISOString();
            // Event end date time
            event.end = new Date($scope.newEvent.end).toISOString();
            // Event subject.
            event.subject = $scope.newEvent.subject;
            // Event body.
            event.body = eventBody;
            // Add event attendee.
            event.attendees.push(attendee);
            // Event location.
            event.location = new Microsoft.OutlookServices.Location();
            event.location.displayName = 'Sample Location';
            // Add event
            outlookClient.me.calendar.events.addEvent(event)
                .then((function(response) {
                        $ionicLoading.show({ template: 'Event added successfully !!', noBackdrop: true, duration: 1000 });
                        // Navigate to event list after adding the event.
                        $state.go('tab.calendar');
                    })
                    .bind(this),
                    function(reason) {
                        // Log the error message encountered while adding the event.
                        console.log('Fail to add event. Error = ' + reason.message);
                    });
        };
    }])
    .controller('calendarDetailCtrl', ['$scope', '$stateParams', '$location', 'app365api', function($scope, $stateParams, $location, app365api) {
        var vm = this;
        // Get event with specified event id.
        vm.getEvent = function() {
            var outlookClient = app365api.outlookClientObj();
            NProgress.start();
            outlookClient.me.calendar.events.getEvent($stateParams.id).fetch()
                .then(function(event) {
                    // Get event detail like subject, location, attendees etc.
                    vm.subject = event.subject;
                    vm.start = event.start;
                    vm.end = event.end;
                    vm.bodypreview = event.bodyPreview;
                    vm.location = event.location.displayName;
                    var attendees;
                    event.attendees.forEach(function(attendee) {
                        if (typeof attendees == 'undefined') {
                            attendees = attendee.emailAddress.name
                        } else {
                            attendees += "," + attendee.emailAddress.name;
                        }
                    });

                    vm.attendees = attendees;
                    $scope.$apply();
                    NProgress.done();
                });
        };

        // vm.getEvent();
    }])
    .controller('calendarCtrl', ['$scope', '$stateParams', '$ionicLoading', '$ionicPopup', 'app365api', function($scope, $stateParams, $ionicLoading, $ionicPopup, app365api) {
        var vm = this;
        var outlookClient;

        // Get events.
        function getEvents() {
            var filterQuery;

            // Get today's date with time parts set to 00.
            var d = new Date();
            var today = new Date();
            today.setHours(0, 0, 0, 0);

            // Get tomorrow's date with time parts set to 00.
            d.setDate(d.getDate() + 1);
            var tomorrow = d;
            tomorrow.setHours(0, 0, 0, 0);

            // Get day after tomorrow date with time parts set to 00.
            var dd = new Date();
            dd.setDate(dd.getDate() + 2);
            var tommorrowNext = dd;
            tommorrowNext.setHours(0, 0, 0, 0);

            // Filter to get Today's event.
            if (typeof $stateParams.today != 'undefined') {
                filterQuery = 'start gt ' + today.toISOString() + ' and start lt ' + tomorrow.toISOString();
            }

            // Filter to get Tomorrow's event.
            if (typeof $stateParams.tomorrow != 'undefined') {
                filterQuery = 'start gt ' + tomorrow.toISOString() + ' and start lt ' + tommorrowNext.toISOString();
            }

            // Filter to get all event greater than today.
            if (typeof $stateParams.all != 'undefined') {
                filterQuery = 'start gt ' + today.toISOString();
            }

            NProgress.start();
            // Get events with filter.
            outlookClient.me.calendar.events.getEvents().filter(filterQuery).fetch()
                .then(function(events) {
                    // Get current page. Use getNextPage() to fetch next set of events.
                    vm.events = events.currentPage;
                    $scope.$apply();
                    NProgress.done();
                });
        };

        // Delete event
        $scope.deleteEvent = function(event) {
            // Ionic pop-up to confirm delete action.
            var confirmPopup = $ionicPopup.confirm({
                title: 'Calendar App',
                template: 'Are you sure you want to delete the event?'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    // Fetch event with specified event id.
                    outlookClient.me.calendar.events.getEvent(event.id).fetch()
                        .then(function(event) {
                            // Delete event.
                            event.delete()
                                .then((function(response) {
                                    $ionicLoading.show({ template: 'Event deleted successfully !!', noBackdrop: true, duration: 1000 });
                                    // Refresh event list.
                                    getEvents();
                                }).bind(this), function(reason) {
                                    // Log delete event error.
                                    console.log('Fail to delete event. Error = ' + reason.message);
                                    $ionicLoading.show({
                                        template: 'Failed to delete event. Error: ' + reason.message,
                                        noBackdrop: true,
                                        duration: 1500
                                    });
                                });
                        });
                } else {
                    // do nothing when user cancel on delete confirmation dialog.                     
                }
            });
        };

        vm.loadList = function() {
            // Get Outlook client object.
            // outlookClient = app365api.outlookClientObj();
            // getEvents();

        };

        vm.loadList();
    }]);
