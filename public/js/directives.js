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
				$scope.model = $scope.options[idx];
				console.log(attr);
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



// chatView.directive('ngSelectUserItem', function() {
// 	return {
// 		template: 
// 	}
// })

// <div class="btn-group btn-group-vertical" style="width: 100%">
// 	<label class="btn btn-large users" ng-repeat="user in users">
// 		<input type="radio" name="user" ng-model="$parent.query" value="{{user.phone_number}}" style="display: none"> {{user.first_name}} {{user.last_name}}
// 	</label>
// </div>

// 	[function(version) {
//     return function(scope, elm, attrs) {
//       elm.text(version);
//     };
//   }]);

//   app.directive('navigation', function() {
//     return {
//         template: '<ul class="navigation" ng-transclude></ul>',
//         replace: true,
//         restrict: 'E',
//         transclude: true,
//         link: function($scope, $element, attrs){
//              $scope.states = {};
//              $scope.states.activeItem = 'item1';
//         }
//     };
// });

// app.directive('navigationItem', function(){
//     return {
//         template: '<li class="item" ng-class="{active: item.id == states.activeItem}" ng-click="states.activeItem=item.id" ng-transclude></li>',
//         restrict: 'E',
//         replace: true,
//         transclude: true
//     };
// });