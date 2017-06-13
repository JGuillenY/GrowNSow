angular.module('gns.controllers')
.controller('touristController', function($scope, $firebaseObject){
	$scope.tourist_visit = ''
	$scope.tourist_message = ''
	$scope.tour = {}
	$scope.results = []
	var rootRef = firebase.database().ref();
	var db = $firebaseObject(rootRef)
	var storage = firebase.storage()
	var storageRef = storage.ref()

	$scope.visit_loged = false

	$scope.planta_abierto = false

	$scope.seccion_actual = 0
	$scope.planta_seleccionada = 0

	$scope.especie_provisional = {}

	$scope.seccion_actual = 0

	$scope.left_section = function(){
		if($scope.seccion_actual > 0){
			$scope.seccion_actual--
			//$scope.garden_bg_number = $scope.jardin[$scope.seccion_actual].bg_number
		}
	}

	$scope.rigth_section = function(){
		if($scope.seccion_actual < $scope.jardin.no_secciones - 1){
			$scope.seccion_actual++
		}
	}

	$scope.obtiene_especie = function(id){
		console.log(id)
		for(var i = 0; i< $scope.database.Basic.no_especies; i++){
			if(db.Basic[i].especie == $scope.tour[$scope.seccion_actual][id].especie){
				$scope.especie_provisional = db.Basic[i]
				break;
			} 
		}
	}

	$scope.select_slot = function(id){
		console.log(id)
		$scope.planta_seleccionada = id
		if($scope.jardin[$scope.seccion_actual][id] == null){
			
		}else{
			$scope.obtiene_especie(id)
			$scope.planta_abierto = true
		}
	}

	$scope.ir = function(){
		$scope.results = []
		$scope.results.length = 0
		for(var perfil in db.usuarios){
			if(db.usuarios[perfil].usuario == $scope.tourist_visit || db.usuarios[perfil].jardin.nombre == $scope.tourist_visit){
				$scope.results.push(db.usuarios[perfil])
			}
		}
	}

	$scope.visit_garden = function(jardin){
		$scope.visit_loged = true
		$scope.tour = jardin
	}
})