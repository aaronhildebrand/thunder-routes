angular.module('roadtrippin', [
  'roadtrippin.home',
  'roadtrippin.maps',
  'roadtrippin.mapsFactory',
  'gservice',
  'roadtrippin.auth',
  'roadtrippin.authFactory',
  'ui.router'
])

.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
  $urlRouterProvider.otherwise('/homepage');

  $stateProvider
    .state('signin', {
      url: '/signin',
      templateUrl: './auth/signin.html',
      controller: 'authController'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: './auth/signup.html',
      controller: 'authController'
    })
    .state('homepage', {
      url: '/homepage',
      templateUrl: './homepage/homepage.html',
      controller: 'homeController',
      authenticate: true
    })
    .state('trip', {
      url: '/trip/:tripID',
      templateUrl: './trip/trip.html',
      controller: 'mapController',
      authenticate: true
    });

  $httpProvider.interceptors.push('AttachTokens');
})

.factory('AttachTokens', function ($window) {
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.roadtrippin');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})

.run(function ($rootScope, $location, authFactory, $state) {
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
    if (toState && toState.authenticate && !authFactory.isAuth()) {
      $location.url('/signin');
    } else if (toState && toState.authenticate && authFactory.isAuth()) {
      $location.url('/homepage');
    }
  });
});