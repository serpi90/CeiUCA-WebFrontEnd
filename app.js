(function(){
	"use strict";
	var context = {};
	angular.module('cei', ['directives'])
		.controller('NavController', function() {
			this.tab = 3;
			this.selectTab = function(tab){
				this.tab = tab;
			};
			this.isSelected = function(tab){
				return this.tab === tab;
			};
		})
		.controller('CeiController', ['$http', function($http) {
			var cei = this;
			cei.backend = 'http://dotabase.com.ar:81';
			cei.postExamURL = function() {
				return cei.backend + "/Examen";
			};
			cei.postNoteURL = function() {
				return cei.backend + "/Apunte";
			};
			cei.haveExams = function(subject) {
				return cei.exams[subject.id].length > 0
			};
			cei.haveNotes = function(subject) {
				return cei.notes[subject.id].length > 0
			};
			cei.getSubjects = function( ) {
				if( typeof cei.subjects === 'undefined' ) {
					if( typeof context.subjects === 'undefined' ) {
						context.subjects = [];
						cei.subjects = context.subjects;
						$http.get(cei.backend + '/Materias')
							.success(function(data){
								context.subjects = data;
								data.map( function(subject) {
									cei.subjects.push(subject);
								} );
							});
					} else {
						cei.subjects = context.subjects;
					}
				}
			};
			cei.getExams = function( subject ) {
				if( typeof cei.exams[subject.id] === 'undefined' ) {
					cei.exams[subject.id] = [];
					$http.get(cei.backend + '/Examenes?subject='+subject.id)
					.success(function(data){
						cei.exams[subject.id] = data;
					});
				}
			};
			cei.getNotes = function( subject ) {
				if( typeof cei.notes[subject.id] === 'undefined' ) {
					cei.notes[subject.id] = [];
					$http.get(cei.backend + '/Apuntes?subject='+subject.id).success(function(data){
						cei.notes[subject.id] = data;
					});
				}
			};
			cei.exams = [];
			cei.notes = [];
			cei.typeOf = function(exam) {
				switch(exam.turn) {
					case 'Feb': case 'Jul': case 'Dec': case 'SP':
						return 'Final';
					case 'Par':
						return 'Parcial';
					case 'Rec':
						return 'Recuperatorio';
					default:
						return 'N/A';
				}
			};
			cei.dateOf = function(exam) {
				function fixDate(date) {
					switch(date){
						case 'Feb':
							return 'Febrero';
						case 'Jul':
							return 'Julio';
						case 'Dec':
							return 'Diciembre';
						default:
							return 'N/A';
					}
				};
				switch( cei.typeOf(exam) ) {
					case 'Final':
						if( exam.turn != 'SP' ) {
							return fixDate(exam.turn) + ' ' + exam.call + 'º llamado';
						}
						else {
							return 'Mesa Expecial';
						}
					case 'Parcial': case 'Recuperatorio':
						return exam.call + 'º';
					default:
						return 'N/A';
				}
			};
		}])
		.controller('UploadFormController', ['$scope', function($scope) {
			var formCtrl = this;
			this.file = {};
			this.examTypes = [
				{
					name: 'Parcial',
					value: 'partial'
				}, {
					name: 'Recuperatorio',
					value: 'recuperatory'
				}, {
					name:'Final',
					value:'final'
				}
			];
			this.examTurns = [
				{
					name: 'Febrero',
					value: 'february',
				}, {
					name: 'Julio',
					value: 'july'
				} , {
					name: 'Diciembre',
					value: 'december'
				}, {
					name: 'Mesa Especial',
					value: 'special'
				}
			];
			this.exam = {};
			this.currentYear = function() {
				return new Date().getFullYear();
			};
			this.exam.year = this.currentYear();
			this.exam.clearCall = function() {
				this.call = undefined;
			};
			this.exam.isFinal = function() {
				return this.type === 'final';
			};
			this.exam.isRegularFinal = function () {
				return this.isFinal() && ['february', 'july', 'december'].indexOf(this.turn.value) !== -1;
			};
			this.exam.isMidtermExam = function() {
				return ['partial','recuperatory'].indexOf(this.type) !== -1;
			};
			this.file.isExam = function(){
				return this.type === 'Examen';
			};
			this.updateActionUrl = function () {
					$('#fileUploadForm').submit( function() {
						if(formCtrl.file.isExam()) {
							$(this).attr('action', $scope.cei.postExamURL());
						} else {
							$(this).attr('action', $scope.cei.postNoteURL());
						}
					return false;
				});
			};
		}])
		;
})();
