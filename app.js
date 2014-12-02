(function(){
	"use strict";
	var context = {};
	angular.module('cei', [])
		.controller('NavController', function() {
			this.tab = 1;
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
					case 'Feb':
					case 'Jul':
					case 'Dec':
					case 'SP':
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
						if( exam.turn != 'SP' )
							return fixDate(exam.turn) + ' ' + exam.call + 'º llamado';
						else
							return 'Mesa Expecial';
					case 'Parcial':
					case 'Recuperatorio':
						return exam.call + 'º';
					default:
						return 'N/A';
				}
			};
		}]);
})();
