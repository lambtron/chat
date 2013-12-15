'use strict';

// Directives. =====================================================================================
chatView.directive('buttonsRadio', function() {
	return {
		restrict: 'E',
		scope: {
			model: '=model',
			options: '=options'
		},
		link: function($scope, element, attr) {
			$scope.activate = function(idx) {
				console.log(idx);
				$scope.model = $scope.options[idx];
			};
		},
		template:	"<button type='button' class='btn btn-info'" +
								"ng-class='{active: option==model}'" +
								"ng-click='activate($index)'" +
								"ng-repeat='option in options'>" +
								"{{option.first_name}} {{option.last_name}}" +
							"</button>"
	};
});