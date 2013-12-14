// Directives. =====================================================================================
angular.module('chatView.directives', []).
  directive('selectUser', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);