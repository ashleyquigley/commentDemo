$(document).ready(function () {
var app = angular.module("myapp",[]); 
	app.controller("usercontroller", ['$scope', '$http', '$filter', function($scope, $http, $filter){

	$scope.names = [];
	$scope.flag = false;
	$scope.index = 0;
	$scope.symbol = 64;
	$scope.filterNames = [];
	$scope.focusedIndex = 0;

	$scope.input = $('input[name=forum]');
	 
	$.getJSON("UserData.json").success(function(data) {
		$scope.names = data;
	});
			
		
	//If the string contains the symbol, start tracking from that point and filter the json file for matching name and username
	//If the comment is empty hide the list of names
	//Flag indicates that the user is inputing after the symbol
	$scope.complete = function(string){
		var i = $scope.cursorPosition('get')-1;
		if(string.charCodeAt(i) == $scope.symbol){
		  $scope.flag = true;
			$scope.idxStart = i;
		}else if(string.charAt(i) == '' || string.charAt(i) == ' ' || string.charAt(i) == '\t' || string.charAt(i) == '\n' || string.charAt(i) == '\r'){
			$scope.resetBox();
		}
		if($scope.flag){
			$scope.idxEnd = i+1;
			var word = string.substring($scope.idxStart+1, $scope.idxEnd);
			$scope.hidethis = false;  
			var output = [];  
			angular.forEach($scope.names, function(person){  
				if(person.name.toLowerCase().indexOf(word.toLowerCase()) >= 0 || person.username.toLowerCase().indexOf(word.toLowerCase()) >= 0){  
					output.push(person);  
				}  
			});  
			$scope.filterNames = output;    
		}  
	};  
	
	
	$scope.userMovedPosition = function(){
		$scope.cursorPosition('set');
		$scope.resetBox();
	};
	
	
	$scope.cursorPosition = function(method) {
        if (!$scope.input) return;
        if ('selectionStart' in $scope.input[0]) {
            //Chrome, firefox
			if(method == 'set'){
				$scope.idxStart = $scope.input[0].selectionStart;
				$scope.idxEnd = $scope.input[0].selectionStart;
				$scope.input[0].setSelectionRange($scope.idxStart, $scope.idxStart);
			}else if(method == 'get'){
				return $scope.input[0].selectionStart;
			}

        } else if (document.selection) {
            // IE
            $scope.input.focus();
            var sel = document.selection.createRange();
            var selLen = document.selection.createRange().text.length;
            sel.moveStart('character', -$scope.input.value.length);
			if(method == 'set'){
				$scope.idxStart = sel.text.length - selLen;
				$scope.idxEnd = sel.text.length - selLen;
			}else if(method == 'get'){
				return sel.text.length - selLen;
			}

        }
    }

	  
	//Hide the list of names and reset the filtering  
	$scope.resetBox = function(){
		$scope.hidethis = true;
		$scope.flag = false;
		$scope.filterNames = [];
		$scope.focusedIndex = 0;
	}
	
	//Replace the symbol + typed name with the selected name from the database
	$scope.fillTextbox = function(word, space){  
		var test = false;
		if(space){
			test = ' ';
		}else{
			test = '';
		}
		$scope.comment = $scope.replaceText($scope.idxStart, $scope.idxEnd, word, test);
		$scope.resetBox();
	};

	//Insert the word between the start and end characters of the comment
	$scope.replaceText = function(start, end, word, space) {
		return $scope.comment.substring(0, start) + word + space + $scope.comment.substring(end);
	};
		
		
	//If the key pressed is an enter key, insert the first name into the comment	
	$scope.checkKeyDown2 = function(event) {
		if($scope.flag){
			if (event.keyCode === 40) {
				// Down
				event.preventDefault();
				if ($scope.focusedIndex !== $scope.filterNames.length - 1) {
					$scope.focusedIndex++;
				}
			}
			else if (event.keyCode === 38) {
				// Up
				event.preventDefault();
				if ($scope.focusedIndex !== 0) {
					$scope.focusedIndex--;
				}
			}
			else if (event.keyCode === 13 && $scope.focusedIndex >= 0) { //enter pressed
				event.preventDefault();
				if ($scope.filterNames.length) {
					$scope.fillTextbox($scope.filterNames[$scope.focusedIndex].name, true);
					$scope.cursorPosition('set');
				}
			}
		}
	};  
	  
	  
}]);
});
