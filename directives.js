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
		.directive('fileInput', ['$parse', function ($parse) {
			return {
				restrict: 'A',
				link: function (scope,elm,attrs) {
					elm.bind('change', function() {
						$parse( attrs.fileInput )
							.assign(scope,elm[0].files);
						scope.$apply();
					});
				}
			};
		}])
		.directive('validFile', function () {
			return {
				restrict: 'A',
				require: '?ngModel',
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