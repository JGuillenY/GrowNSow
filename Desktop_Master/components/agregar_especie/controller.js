angular.module('gns.controllers')
.controller('agregarController', function($scope, $firebaseObject){
	$scope.especie = ''
	$scope.genero = ''
	$scope.familia = ''
	$scope.orden = ''
	$scope.clase = ''
	$scope.division = ''
	$scope.origen = ''
	$scope.properties = {medicinales:{1:null}, nutrimentales:{1:null}, restricciones:{1:null}}
	$scope.no_medicinales = 1
	$scope.no_nutrimentales = 1
	$scope.no_restricciones = 1
	$scope.id = ''
	$scope.comentario = ''
	$scope.url = ''
	$scope.tipo = 'na'
	$scope.clima = 'na'
	$scope.active_property = 'medicinales'
	$scope.nombre_comun = ''

	var check_p = function(){
		switch($scope.active_property){
				case 'medicinales':
					return $scope.no_medicinales
				case 'nutrimentales':
					return $scope.no_nutrimentales
				case 'restricciones':
					return $scope.no_restricciones
			}
	}

	$scope.agregar_propiedad = function(){
		if($scope.properties[$scope.active_property][check_p()] != null || check_p() == 1){
			switch($scope.active_property){
					case 'medicinales':
						$scope.no_medicinales++
						break
					case 'nutrimentales':
						$scope.no_nutrimentales++
						break
					case 'restricciones':
						$scope.no_restricciones++
						break
				}
			}
	}

	$scope.rango = function(){
		var range = [];
		var total = 0
		switch($scope.active_property){
			case 'medicinales':
				total = $scope.no_medicinales
				break
			case 'nutrimentales':
				total = $scope.no_nutrimentales
				break
			case 'restricciones':
				total = $scope.no_restricciones
				break
		}
		if(total > 0){
			for(var i=0;i<total;i++) {
		  	range.push(i)
			}
			return range	
		}else{
			return 0
		}			
	}

	
	var choice = true

	$scope.load_url = function(){
		if($scope.url == ''){
			// $scope.alert_empty_field=true
			alert("no puede dejar campo vacio.")
		}else{
			$.get($scope.url, function(response){
				console.log($(response).find("a[title='Reino (biología)']").text())
			})
		}
	}

	$scope.new_especie = function(){
		$scope.database.Basic[$scope.id] = {especie: $scope.especie, 
																				genero: $scope.genero, 
																				familia: $scope.familia,	
																				orden: $scope.orden, 
																				clase: $scope.clase, 
																				division: $scope.division, 
																				origen: $scope.origen, 
																				comentario: $scope.comentario,
																				id: $scope.id,
																				propiedades: $scope.properties,
																				tipo: $scope.tipo,
																				nombre_comun: $scope.nombre_comun,
																				clima: $scope.clima}
		$scope.database.Basic.no_especies++
		$scope.add_metadatos()
		console.log($scope.database)
		$scope.reset_form()
		$scope.start_list()
		alert("Se ha agregado la especie.")
		//$scope.alert_exito=true
	}

	// $scope.confirm_aceptar = function(){
	// 	$scope.sobreescribir = true
	// 	$scope.confirm_sobre = false
	// 	$scope.alert_sobre = true
	// 	$scope.database.Basic.no_especies--
	// 	$scope.new_especie()
	// }

	// $scope.confirm_cancelar = function(){
	// 	$scope.sobreescribir = false
	// 	$scope.confirm_sobre = false
	// 	choice = false;
	// }

	$scope.add_metadatos = function(){
		if($scope.database.metadatos == null){
			$scope.database.metadatos = {genero:{}, familia:{}, orden:{}, clase:{}, division:{}}
			$scope.database.metadatos.genero[$scope.genero] = $scope.genero
			$scope.database.metadatos.familia[$scope.familia]=$scope.familia
			$scope.database.metadatos.orden[$scope.orden]=$scope.orden
			$scope.database.metadatos.clase[$scope.clase]=$scope.clase
			$scope.database.metadatos.division[$scope.division]=$scope.division
		}else{
			if($scope.database.metadatos.genero[$scope.genero] == null){
				$scope.database.metadatos.genero[$scope.genero] = $scope.genero
			}
			if($scope.database.metadatos.familia[$scope.familia] == null){
				$scope.database.metadatos.familia[$scope.familia]=$scope.familia
			}
			if($scope.database.metadatos.orden[$scope.orden] == null){
				$scope.database.metadatos.orden[$scope.orden]=$scope.orden
			}
			if($scope.database.metadatos.clase[$scope.clase] == null){
				$scope.database.metadatos.clase[$scope.clase]=$scope.clase
			}
			if($scope.database.metadatos.division[$scope.division] == null){
				$scope.database.metadatos.division[$scope.division]=$scope.division
			}
		}
	}

	$scope.reset_form = function(){
		$scope.especie = ''
		$scope.genero = ''
		$scope.familia = ''
		$scope.orden = ''
		$scope.clase = ''
		$scope.division = ''
		$scope.origen = ''
		$scope.no_medicinales = 1
		$scope.no_nutrimentales = 1
		$scope.no_restricciones = 1
		$scope.properties = {medicinales:{}, nutrimentales:{}, restricciones:{}}
		$scope.id = ''
		$scope.comentario = ''
		$scope.url = ''
		$scope.tipo = 'na'
		$scope.clima = 'na'
		$scope.image_file = null
		$scope.nombre_comun = ''
	}

	$scope.submit = function(){
		if($scope.especie == '' || $scope.genero == '' || $scope.familia == '' || $scope.orden == '' || $scope.clase == '' || $scope.nombre_comun == ''){
			// $scope.alert_empty_field = true
			alert('No puede dejar campo vacio.')
		}else{
			var str = $scope.especie
			var lower = str.replace(" ", "")
			var str = lower.toLowerCase()
			$scope.id = str
			if($scope.database.Basic.no_especies == 0){
				$scope.new_especie()
			}else{
				for(var specie in $scope.database.Basic){
					if($scope.id == specie){
						if(confirm('La especie ya existe, desea reemplazar?')){
							$scope.new_especie()
							$scope.database.Basic.no_especies--
						}
						// $scope.confirm_sobre = true		
					}
				}if($scope.database.Basic[$scope.especie] == null){
					$scope.new_especie()
				}
			}
		}
		console.log($scope.database)
		$scope.database.$save()
	}
})