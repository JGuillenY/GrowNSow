angular.module('gns.controllers')
.controller('jardinController', function($scope, $firebaseObject){
	//Variables usadas para el inicio de sesión
	$scope.garden_logged = false
	$scope.browser_support = false
	$scope.new_user = false

	$scope.sesion_nombre = ''
	$scope.sesion_pass = ''

	//Estas son especificamente para la creación de usuarios nuevos.
	$scope.nuevo_usuario_nombre = ''
	$scope.nuevo_usuario_pass = ''
	$scope.nuevo_jardin_nombre = ''
	$scope.nuevo_usuario_pass_coincide = true
	$scope.message = ''

	$scope.current_user = '' //Para tener acceso a las tablas especificas del usuario
	$scope.cu = {}
	$scope.jardin = {}

	$scope.garden_bg_number = 1 
	$scope.garden_background = 'img/background' + $scope.garden_bg_number + '.jpg'

	$scope.garden_bg_number_increase = function(){
		if($scope.garden_bg_number == 8){
			$scope.garden_bg_number = 1 
		}else{
			$scope.garden_bg_number++
		}
		$scope.garden_background = 'img/background' + $scope.garden_bg_number + '.jpg'
	}
	$scope.bitacora_fecha = new Date()

	$scope.seccion_actual = 0
	$scope.nueva_seccion_abierto = false
	$scope.nueva_seccion_nombre = ''
	$scope.nueva_seccion_tipo = 'Interior'
	$scope.nueva_seccion_humedad = 'Neutral'
	$scope.nueva_seccion_temperatura = 0
	$scope.nueva_seccion_intensidad_luz = 'Neutral'

	$scope.nueva_planta_especie_filtro = 'nombre_comun'

	$scope.nueva_planta_pre = ''
	$scope.nueva_planta_especie = ''
	$scope.nueva_planta_icono = 'img/plant-icon1.svg' 
	$scope.nueva_planta_fecha = ''
	$scope.nueva_planta_nombre = ''
	$scope.nueva_planta_etapa = ''
	$scope.nueva_planta_lapso_riego = 24
	$scope.nueva_planta_bitacora = {}

	$scope.especie_provisional = {}

	$scope.nueva_planta_abierto = false
	$scope.planta_abierto = false

	$scope.planta_seleccionada = 0

	$scope.new_bitacora = false
	$scope.new_alarma = false

	$scope.seccion_baja = 'bitacora'

	$scope.slot_size = 1

	$scope.black_screen_click_j = function(){
			$scope.nueva_planta_abierto = false
			$scope.nueva_seccion_abierto = false
			$scope.planta_abierto = false
			$scope.new_bitacora = false
		}	

	$scope.zoom_in = function(){
		if($scope.slot_size < 4){
			$scope.slot_size *= 2
		}
	}

	$scope.zoom_out = function(){
		if($scope.slot_size > 1){
			$scope.slot_size /= 2
		}
	}

	$scope.left_section = function(){
		if($scope.seccion_actual > 0){
			$scope.seccion_actual--
			$scope.garden_bg_number = $scope.jardin[seccion_actual].bg_number
		}
	}

	$scope.rigth_section = function(){
		if($scope.seccion_actual < $scope.jardin.no_secciones - 1){
			$scope.seccion_actual++
		}
	}

	$scope.save_garden = function(opt){
		var rootRef = firebase.database().ref();
		var db = $firebaseObject(rootRef)
		console.log($scope.cu)
		db.$loaded().then(function(){
			if(opt){
				db.usuarios[$scope.current_user] = $scope.cu
			}else{
				db.usuarios[$scope.current_user].jardin = $scope.jardin
			}
			console.log(db)
			db.$save()
		})
	}

	$scope.np_reset = function(){
		$scope.nueva_planta_pre = ''
		$scope.nueva_planta_especie = ''
		$scope.nueva_planta_icono = ''
		$scope.nueva_planta_fecha = ''
		$scope.nueva_planta_nombre = ''
		$scope.nueva_planta_etapa = ''
		$scope.nueva_planta_lapso_riego = 24
		$scope.nueva_planta_bitacora = {}
	}

	$scope.nueva_planta_aceptar = function(){
		if($scope.nueva_planta_especie == '' || $scope.nueva_planta_nombre == ''){
			alert('Ni el nombre ni la especie pueden quedar vacías.')
		}else{
			$scope.jardin[$scope.seccion_actual][$scope.planta_seleccionada] = {
				especie: $scope.nueva_planta_especie,
				icono: $scope.nueva_planta_icono,
				fecha: $scope.today,
				nombre: $scope.nueva_planta_nombre,
				etapa: $scope.nueva_planta_etapa,
				lapso_riego: $scope.nueva_planta_lapso_riego
			}
			$scope.jardin[$scope.seccion_actual].no_especies++
			$scope.save_garden(false)
			$scope.nueva_planta_abierto = false	
		}	
	}

	$scope.np_cancelar = function(){
		$scope.np_reset()
		$scope.nueva_planta_abierto = false
	}

	$scope.check_icon_selection = function(number){
		if($scope.nueva_planta_icono == 'img/plant-icon' + number + '.svg'){
			return true
		}else{
			return false
		}
	}

	$scope.geticonurl = function(number){
		return 'img/plant-icon' + number + '.svg'
	}

	$scope.select_icono = function(number){
		$scope.nueva_planta_icono = $scope.geticonurl(number)
	}

	$scope.busca_especie = function(especie){
		var str = especie[$scope.nueva_planta_especie_filtro]
		if($scope.nueva_planta_pre == ''){
			if(especie[$scope.nueva_planta_especie_filtro] == null){
				return false
			}
			return true
		}else if(str.search($scope.nueva_planta_pre)!=-1 || str.toLowerCase() == $scope.nueva_planta_pre ){
			return true
		}else{ return false}
	}

	$scope.select_slot = function(id){
		$scope.planta_seleccionada = id
		if($scope.jardin[$scope.seccion_actual][id] == null){
			$scope.nueva_planta_abierto = true
		}else{
			$scope.obtiene_especie(id)
			$scope.planta_abierto = true
		}
	}

	$scope.reset_garden_form = function(){
		$scope.nueva_seccion_nombre = ''
		$scope.nueva_seccion_tipo = 'Interior'
		$scope.nueva_seccion_humedad = 'Neutral'
		$scope.nueva_seccion_temperatura = 0
		$scope.nueva_seccion_intensidad_luz = 'Neutral'
	}

	$scope.nueva_seccion = function(k){
		if($scope.nueva_seccion_nombre == ''){
			alert('Necesitas especificar el nombre de la sección.')
		}
		else if($scope.jardin[$scope.no_secciones] == null){
			$scope.jardin[$scope.jardin.no_secciones] = {nombre: $scope.nueva_seccion_nombre, 
																									tipo: $scope.nueva_seccion_tipo,
																									humedad: $scope.nueva_seccion_humedad,
																									temperatura: $scope.nueva_seccion_temperatura,
																									intensidad_luz: $scope.nueva_seccion_intensidad_luz, 
																									no_especies :0, 
																									fecha: $scope.today,
																									bg_number: 'img/background'+$scope.garden_bg_number+'.jpg'}
			$scope.jardin.no_secciones++
			$scope.save_garden(false) 
			$scope.nueva_seccion_abierto = false
		}else{
			$scope.nueva_seccion(k+1)
		}
	}

	$scope.cancelar_seccion = function(){
		$scope.reset_garden_form()
		$scope.nueva_seccion_abierto = false
	}

	$scope.eliminar_seccion = function(){
		var k = 0
		if($scope.jardin.no_secciones != 0){
			delete $scope.jardin[$scope.seccion_actual]
			while(true){
				if($scope.jardin[k] == null){
					k++
				}else{
					$scope.seccion_actual = k
					break
				}
			}
			$scope.jardin.no_secciones--
			$scope.save_garden(false)
		}
	}

	$scope.obtiene_especie = function(id){
		for(var i = 0; i< $scope.database.Basic.no_especies; i++){
			if($scope.lista_especies[i].especie == $scope.jardin[$scope.seccion_actual][id].especie){
				$scope.especie_provisional = $scope.lista_especies[i]
				break;
			} 
		}
	}

	$scope.nueva_bitacora = function(v){
		var y = $scope.bitacora_fecha.getUTCFullYear() + ""
		var m = ($scope.bitacora_fecha.getUTCMonth() + 1) + ""
		var d = $scope.bitacora_fecha.getUTCDate() + ""
		var f = d + "/" + m + "/" + y
		
		if($scope.jardin[$scope.seccion_actual][$scope.planta_seleccionada].bitacora == null){
			$scope.jardin[$scope.seccion_actual][$scope.planta_seleccionada].bitacora = {}
		}
		if($scope.bitacora == ''){
			alert('No puedes dejar el campo vacío.')
		}
		else if($scope.jardin[$scope.seccion_actual][$scope.planta_seleccionada].bitacora[v] == null){
			$scope.jardin[$scope.seccion_actual][$scope.planta_seleccionada].bitacora[v] = {fecha : f, bitacora : $scope.bitacora}
			$scope.save_garden(false)
			$scope.new_bitacora = false
			$scope.bitacora = ''
		}else{
			$scope.nueva_bitacora(v+1)
		}
	}

	$scope.iniciar_sesion = function(){
		if($scope.sesion_nombre == '' || $scope.sesion_pass == ''){
			alert('no puede quedar campo vacío.')
		}else if($scope.database.usuarios[$scope.sesion_nombre] == null){
			alert('el nombre de usuario no existe.')
		}else{
			if($scope.database.usuarios[$scope.sesion_nombre].pass != $scope.sesion_pass){
				alert('contraseña incorrecta.')
			}else{
				$scope.jardin = $scope.database.usuarios[$scope.sesion_nombre].jardin
				if($scope.browser_support){
					localStorage.setItem("sesion_iniciada", "True");
					localStorage.setItem("usuario", $scope.sesion_nombre);
					location.reload()
				}
			}
		}
	}

	$scope.cerrar_sesion = function(){
		if($scope.browser_support){
			localStorage.removeItem("sesion_iniciada")
			localStorage.removeItem("usuario")
			console.log(localStorage.getItem("sesion_iniciada"))
			location.reload()
		}else{
			location.reload()
		}
	}

	$scope.registrar_usuario = function(){
		if($scope.nuevo_usuario_nombre == '' || $scope.nuevo_usuario_pass == ''|| $scope.nuevo_jardin_nombre == ''){
			$scope.message = 'Ningun campo debe quedar vacío'
		}else if($scope.usuario_pass_coincide == false){
			$scope.message = 'La contraseña no coincide.'
		}else if($scope.database.usuarios[$scope.nuevo_usuario_nombre] != null){
			$scope.message = 'El usuario ya existe.'
		}else{
			$scope.sesion_nombre = $scope.nuevo_usuario_nombre
			$scope.sesion_pass = $scope.nuevo_usuario_pass
			$scope.cu = {usuario: $scope.sesion_nombre, pass: $scope.nuevo_usuario_pass, visibilidad : $scope.visibilidad, jardin : {fecha_de_creacion : $scope.today, no_secciones : 0, nombre: $scope.nuevo_jardin_nombre}}
			$scope.jardin = $scope.cu.jardin
			$scope.current_user = $scope.sesion_nombre
			$scope.save_garden(true)
		}
	}

	$scope.database.$loaded().then(function(){
		if (typeof(Storage) !== "undefined") {
			$scope.browser_support = true
			console.log('first flag.')
			if(localStorage.getItem("sesion_iniciada") == null){
				console.log('nothing in local')
			}else{
				$scope.jardin = $scope.database.usuarios[localStorage.getItem("usuario")].jardin
				$scope.current_user = localStorage.getItem("usuario")
				$scope.garden_logged = true
			}
		} else {
		  $scope.browser_support = false
		  alert("Este navegador no soporta la consistencia en el inicio de sesión.")
		}
	})

})