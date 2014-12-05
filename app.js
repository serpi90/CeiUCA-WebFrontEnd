(function(){
	"use strict";
	var context = {};
	angular.module('cei', ['directives'])
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
		.controller('UploadFormController', [ '$scope', '$http', function ($scope,$http) {
			var self = this;
			self.examTypes = [
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
			self.examTurns = [
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
			self.currentYear = function() {
				return new Date().getFullYear();
			};
			self.clearCall = function() {
				self.exam.call = 1;
			};
			self.examTypeChanged = function() {
				if( self.exam.type !== 'final' ) {
					self.exam.turn = self.exam.type;
				}
				self.clearCall();
			};
			self.examTurnChanged = function() {
				self.exam.turn = self.exam.turn.value;
				self.clearCall();
			};
			self.examNumberChanged = function() {
				self.exam.call = parseInt(self.exam.number);
			}
			self.reset = function() {
				self.file = {};
				self.exam = {};
				self.exam.year = self.currentYear();
				self.exam.call = 1;
				self.subject = undefined;
				angular.forEach(
					angular.element("input[type='file']"),
					function(inputElem) {
						angular.element(inputElem).val(null);
					});
				$scope.files = undefined;
			}
			self.isFinal = function() {
				return self.exam.type === 'final';
			};
			self.isRegularFinal = function () {
				return self.isFinal() && self.exam.turn && ['february', 'july', 'december'].indexOf(self.exam.turn) !== -1;
			};
			self.isMidtermExam = function() {
				return ['partial','recuperatory'].indexOf(self.exam.type) !== -1;
			};
			self.isExam = function(){
				return self.file.type === 'Examen';
			};
			self.actionUrl = function() {
				if(self.isExam()) {
					return $scope.cei.postExamURL();
				} else {
					return $scope.cei.postNoteURL();
				}
			};
			self.addNoteArguments = function( fd ) {
				angular.forEach( $scope.files, function( file ) {
					fd.append('file', file );
				} );
				fd.append( 'subject', self.subject.id );
			};
			self.addExamArguments = function( fd ) {
				angular.forEach( $scope.files, function( file ) {
					fd.append('file', file );
				} );
				fd.append( 'subject', self.subject.id );
				fd.append( 'year', self.exam.year );
				fd.append( 'turn', self.exam.turn );
				fd.append( 'call', self.exam.call );
			};
			self.upload = function () {
				var fd = new FormData();
				self.result = undefined;
				if( self.isExam() ) {
					self.addExamArguments( fd );
				} else {	
					self.addNoteArguments( fd );
				}
				self.uploading = true;
				$http.post( self.actionUrl(), fd, {
					transformRequest: angular.identity,
					headers: {'Content-Type': undefined }
				}).success( function (data) {
					self.reset();
					self.result = data;
					self.uploading = false;
				}).error( function (data) {
					self.uploading = false;
					self.result = data;
				})
				;
			};
			self.reset();
		}])
		;
})();
