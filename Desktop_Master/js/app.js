(function(){
	var app = angular.module('gnsApp', ['firebase', 'gns.controllers', 'ui.router'])
	app.controller('loadController', function($scope, $firebaseObject) {
		var storage = firebase.storage();
		$scope.storageRef = storage.ref()


		
		$scope.one = []

		$scope.empty_alert = false/*
		$scope.alert_empty_field = false
		$scope.alert_exito = false
		$scope.confirm_sobre = false
		$scope.sobreescribir = false
		$scope.alert_sobre = false*/

		$scope.main_menu = 'herbario'
		$scope.main_menu_open = false
		$scope.done = false
		var rootRef = firebase.database().ref();
		$scope.database = $firebaseObject(rootRef)
		
		$scope.lista_especies = []
		$scope.metadatos = {especie:[], genero:[], familia:[], orden:[], clase:[], division:[]}

		$scope.save_database = () => {
			$scope.database.$save()
		}

		$scope.black_screen = () => {
			if($scope.main_menu_open || $scope.nueva_planta_abierto || $scope.nueva_seccion_abierto || $scope.planta_abierto){
				return true
			}else{ return false}
		}

		$scope.black_screen_click = () => {
			$scope.main_menu_open = false
			$scope.nueva_planta_abierto = false
			$scope.nueva_seccion_abierto = false
			$scope.planta_abierto = false
		}

		$scope.empty_alert_accept = () => {
			$scope.done = true
			$scope.empty_alert = false
		}

		$scope.select_menu_option = (opt) => {
			$scope.main_menu = opt
			$scope.main_menu_open = false
		}

		$scope.start_list = () => {
			var ordered_list = []
			var unordered_list = []
			var k=0
			for(var e in $scope.database.Basic){
				if($scope.database.Basic[e].id!=null){
					unordered_list[k]= $scope.database.Basic[e]
					k++
				}
			}
			var j = 0
			for(var genero in $scope.metadatos.genero){
				for(var i = 0; i<unordered_list.length; i++){
					if(unordered_list[i].genero == genero){
						ordered_list[j] = unordered_list[i]
						j++
					}
				}
			}
			$scope.lista_especies = ordered_list	
		}

		var fulfill = () => {
			var result = []
			for(var n=1; n < 26; n++){
				result.push(n)
			}
			return result
			
		}

		$scope.database.$loaded().then(() => {
			var date = new Date()
			var y = date.getUTCFullYear() + ""
			var m = (date.getUTCMonth() + 1) + ""
			var d = date.getUTCDate() + ""
			$scope.today = d + "/" + m + "/" + y
			if($scope.database['Basic'] == null){
				$scope.empty_alert = true
				$scope.database['Basic'] = {no_especies: 0}
			}else{
				$scope.metadatos = $scope.database.metadatos
				$scope.done = true
				$scope.start_list()
			}
			if($scope.storageRef.child('Basic') == null){
				$scope.storageRef.child('Basic') = {}
			}
			/*if($scope.database.jardin_principal == null){
				$scope.jardin.nombre = 'Jardín de lo Invisible'
				$scope.jardin.fecha_de_creacion= $scope.today
				$scope.jardin.no_secciones= 0
			}else{
				$scope.jardin = $scope.database.jardin_principal
			}*/
			$scope.first_especie = $scope.lista_especies[0]
			$scope.one=fulfill()
		}) 
	})

	app.config(function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/herbario');
		$stateProvider
			.state('herbario', {
				name: 'herbario',
				url: '/herbario',
				controller: 'herbarioController',
				templateUrl: "components/herbario/view.html"
			})
			.state('agregar_especie', {
				name: 'agregar_especie',
				controller: 'agregarController',
				url: '/agregar_especie',
				templateUrl: "components/agregar_especie/view.html"
			})
			.state('jardin', {
				name: 'jardin',
				controller: 'jardinController',
				url: '/jardin',
				templateUrl: "components/jardin/view.html"
			})
			.state('manejar_datos', {
				name: 'manejar_datos',
				controller: 'manejarController',
				url: '/manejar_datos',
				templateUrl: "components/manejar_datos/view.html"
			})
			.state('configuracion_perfil', {
				name: 'configuracion_perfil',
				controller: 'configuraciondeperfilController',
				url: '/configuracion_perfil',
				templateUrl: "components/configuracion_perfil/view.html"
			})
			.state('calendar', {
				name: 'calendar',
				controller: 'calendarController',
				url: '/calendar',
				templateUrl: "components/calendar/view.html"
			})
			.state('tourist', {
				name: 'tourist',
				controller: 'touristController',
				url: '/tourist',
				templateUrl: "components/tourist/view.html"
			})
	})

})();