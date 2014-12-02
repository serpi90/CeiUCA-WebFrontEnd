(function(){
	"use strict";
	angular.module('directives', [])
		.directive('navbar', function () {
			return {
				restrict: 'E',
				templateUrl: 'navbar.html'
			};
		})
		.directive('examsPage', function () {
			return {
				restrict: 'E',
				templateUrl: 'exams-page.html'
			};
		})
		.directive('notesPage', function () {
			return {
				restrict: 'E',
				templateUrl: 'notes-page.html'
			};
		})
		.directive('uploadPage', function () {
			return {
				restrict: 'E',
				templateUrl: 'upload-page.html'
			};
		})
		.directive('downloadLabel', function () {
			return {
				restrict: 'E',
				templateUrl: 'download-label.html'
			};
		})
		.directive('validFile', function () {
			return {
				require: 'ngModel',
				link: function (scope, el, attrs, ngModel) {
					ngModel.$render = function () {
						ngModel.$setViewValue(el.val());
					};
					el.bind('change', function () {
						scope.$apply(function () {
							ngModel.$render();
						});
					});
				}
			};
		})
		;
})();