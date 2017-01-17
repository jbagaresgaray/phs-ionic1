// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (cordova.platformId === "ios" && window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider
        .state('sign-in', {
            url: "/sign-in",
            templateUrl: 'templates/tab-o365.html',
            controller: 'o365Ctrl'
        })
        // setup an abstract state for the tabs directive
        .state('tab', {
            url: '/tab',
            abstract: true,
            templateUrl: "templates/tabs.html"
        })
        .state('tab.calendar', {
            url: "/calendar",
            views: {
                'mainContent': {
                    templateUrl: "templates/calendar/calendar-tab.html"
                }
            }
        })
        .state('app.newEvent', {
            url: "/newevent",
            views: {
                'mainContent': {
                    templateUrl: "templates/calendar/add-event.html"
                }
            }
        })
        .state('tab.calendar.today', {
            url: "/today/id:today",
            views: {
                "tab-today-calendar": {
                    templateUrl: "templates/calendar/calendar-list.html"
                }
            }
        })
        .state('tab.calendar-detail', {
            url: "/calendar/:id",
            views: {
                'mainContent': {
                    templateUrl: "templates/calendar/calendar-detail.html"
                }
            }
        })
        .state('tab.calendar.tomorrow', {
            url: "/tomorrow/id:tomorrow",
            views: {
                "tab-tomorrow-calendar": {
                    templateUrl: "templates/calendar/calendar-list.html"
                }
            }
        })
        .state('tab.calendar.all', {
            url: "/all/id:all",
            views: {
                "tab-all-calendar": {
                    templateUrl: "templates/calendar/calendar-list.html"
                }
            }
        });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('sign-in');

});