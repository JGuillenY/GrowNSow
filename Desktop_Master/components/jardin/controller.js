angular.module('gns.controllers')
.controller('jardinController', function($scope, $firebaseObject) {

	var rootRef = firebase.database().ref();
	var db = $firebaseObject(rootRef)
	var storage = firebase.storage()
	var storageRef = storage.ref()
	//Variables usadas para el inicio de sesión
	$scope.garden_logged = false
	$scope.browser_support = false
	$scope.new_user = false

	$scope.sesion_nombre = ''
	$scope.sesion_pass = ''

	$scope.loading_screen = true

	var lista_climas = ['Tornado', 'Tormenta Tropical', 'Huracán', 'Tormentas Severas', 'Tormentas', 'Lluvia y Nieve', 'Lluvia y Aguanieve', 'Nieve y Aguanieve', 'Llovizna Helada', 'Llovizna', 'Lluvia Helada', 'Lluvia', 'Aguacero', 'Copos de Nieve', 'Lluvia de Nieve Ligera', 'Aire Helado', 'Nieve', 'Granizo', 'Aguanieve', 'Tormenta de Polvo', 'Bruma', 'Neblina', 'Humo', 'Tempestad', 'Viento', 'Frío', 'Niebla', 'Niebla Constante', 'Niebla Constante', 'Niebla Parcial', 'Niebla Parcial', 'Despejado', 'Soleado', 'Buen Tiempo', 'Buen Tiempo', 'Lluvia y Granizo', 'Calor', 'Tormenta Aislada', 'Tormenta Electrica Dispersa', 'Tormenta Electrica Dispersa', 'Lluvia Dispersa', 'Fuerte Nieve', 'Lluvia de Nieve Dispersa', 'Nieve Fuerte', 'Neblina Parcial', 'Tormenta Eléctrica', 'Lluvia de Nieve', 'Lluvia Eléctrica Aislada']

	//Estas son especificamente para la creación de usuarios nuevos.
	$scope.nuevo_usuario_nombre = ''
	$scope.nuevo_usuario_pass = ''
	$scope.nuevo_jardin_nombre = ''
	$scope.nuevo_usuario_pass_coincide = true
	$scope.nuevo_usuario_country = '-1'
	$scope.nuevo_usuario_state = '-1'
	$scope.lista_mensajes = []
	$scope.message = ''
	$scope.nuevo_usuario_email = ''
	$scope.visibilidad = 'publico'
	$scope.pase_turista = ''

	$scope.current_user = '' //Para tener acceso a las tablas especificas del usuario
	$scope.current_profile = {}
	$scope.cu = {}
	$scope.jardin = {}

	$scope.new_bitacora_seccion = false

	$scope.current_temperature = 0
	$scope.current_weather = ''
	$scope.weather_message = ''

	$scope.profile_open = false

	$scope.garden_bg_number  = 0

	$scope.seccion_info_selected = 'bitacora'

	$scope.garden_bg_number_increase = () => {
		console.log($scope.garden_bg_number)
		if($scope.garden_bg_number == 9){
			$scope.garden_bg_number = 0 
		}else{
			$scope.garden_bg_number++
		}
	}

	$scope.humidity = 0

	$scope.bitacora_fecha = new Date()

	$scope.seccion_actual = 0
	$scope.nueva_seccion_abierto = false
	$scope.nueva_seccion_nombre = ''
	$scope.nueva_seccion_descripcion = ''
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
	$scope.op_sm = false

	$scope.localization = true
	$scope.prueba_nuevo_usuario_pass = ''

	$scope.checkImage = () => {
		if(db.usuarios[$scope.sesion_nombre] == undefined){
			return ''
		}else{
			return db.usuarios[$scope.sesion_nombre].url
		}
	}

	$scope.checkPassword = () => {
		if($scope.prueba_nuevo_usuario_pass == $scope.nuevo_usuario_pass){
			return true
		}else{
			return false
		}
	}

	$scope.getId = (especie) => {
		for(i in db.Basic){
			if(db.Basic[i].especie == especie){
				return db.Basic[i].id
			}
		}
	}

	$scope.toggle_sm = () => {
		if($scope.op_sm){
			$scope.op_sm = false
		}else{
			$scope.op_sm = true
		}
	}

	$scope.black_screen_click_j = () => {
			$scope.nueva_planta_abierto = false
			$scope.nueva_seccion_abierto = false
			$scope.planta_abierto = false
			$scope.new_bitacora = false
		}	

	$scope.zoom_in = () => {
		if($scope.slot_size < 4){
			$scope.slot_size *= 2
		}
	}

	$scope.zoom_out = () => {
		if($scope.slot_size > 1){
			$scope.slot_size /= 2
		}
	}

	$scope.left_section = () => {
		if($scope.seccion_actual > 0){
			$scope.seccion_actual--
			$scope.garden_bg_number = $scope.jardin[$scope.seccion_actual].bg_number
		}
	}

	$scope.rigth_section = () => {
		if($scope.seccion_actual < $scope.jardin.no_secciones - 1){
			$scope.seccion_actual++
		}
	}

	$scope.save_garden = (opt) => {
		if(opt){
			db.usuarios[$scope.current_user] = $scope.cu
		}else{
			db.usuarios[$scope.current_user].jardin = $scope.jardin
		}
		console.log(db)
		db.$save()
	}

	$scope.section_reestruct = () => {
		var index = 0
		for(var i in $scope.jardin){
			if(i == 'no_secciones' || i == 'fecha_de_creacion' || i == 'nombre'){
				console.log(i)
			}else{
				if(i != index){
					$scope.jardin[index] = $scope.jardin[i]
				}
				console.log(i)
				console.log(index)
				index++
			}
		}
		var v = $scope.jardin.no_secciones
		console.log(v)
		delete $scope.jardin[v]
		$scope.save_garden(false)
	}

	$scope.np_reset = () => {
		$scope.nueva_planta_pre = ''
		$scope.nueva_planta_especie = ''
		$scope.nueva_planta_icono = ''
		$scope.nueva_planta_fecha = ''
		$scope.nueva_planta_nombre = ''
		$scope.nueva_planta_etapa = ''
		$scope.nueva_planta_lapso_riego = 24
		$scope.nueva_planta_bitacora = {}
	}

	$scope.specie_weather_message = ''

	$scope.check_for_weather = (weather) => {
		switch(weather){
			case 'desertico':
				if($scope.jardin.temperatura < 18 && $scope.humidity > 30){
					$scope.specie_weather_message = 'El clima puede ser muy bajo y la humedad muy alta para esta especie. ¿Está seguro de agregar la especie al jardín?'
					return true
				}else{return false}
				break;
			case 'seco':
				if(($scope.jardin.temperatura < 20 || $scope.jardin.temperatura > 30) && $scope.humidity > 40){
					$scope.specie_weather_message = 'El clima y la humedad no son las más adecuadas para su especie. ¿Está seguro de agregar la especie al jardín?'
					return true
				}else{return false}
				break;
			case 'calido':
				if($scope.jardin.temperatura < 25 && $scope.humidity < 50){
					$scope.specie_weather_message = 'El clima y la humedad no son las más adecuadas para su especie. ¿Está seguro de agregar la especie al jardín?'
					return true
				}else{return false}
				break;
			case 'tropical':
				if($scope.jardin.temperatura < 18 && $scope.humidity < 60){
					$scope.specie_weather_message = 'El clima y la humedad no son las más adecuadas para su especie. ¿Está seguro de agregar la especie al jardín?'
					return true
				}else{return false}
				break;
			case 'humedo':
				if($scope.humidity < 70){
					$scope.specie_weather_message = 'El clima y la humedad no son las más adecuadas para su especie. ¿Está seguro de agregar la especie al jardín?'
					return true
				}else{return false}
				break;
			case 'frio':
				if($scope.jardin.temperatura >18){
					$scope.specie_weather_message = 'Puede que el clima sea muy cálido para esta especie. ¿Está seguro de agregar la especie al jardín?'
					return true
				}else{return false}
				break;
			case 'tundra':
				if($scope.jardin.temperatura >0){
					$scope.specie_weather_message = 'Puede que el clima sea muy cálido para esta especie. ¿Está seguro de agregar la especie al jardín?'
					return true
				}else{return false}
				break;
			case 'neutral':
				return false
				break;
		}
	}

	$scope.nueva_planta_aceptar = () => {
		if($scope.nueva_planta_especie == '' || $scope.nueva_planta_nombre == ''){
			alert('Ni el nombre ni la especie pueden quedar vacías.')
		}else{
			var flag = false
			if($scope.check_for_weather(db.Basic[$scope.getId($scope.nueva_planta_especie)].clima)){
				flag = true
			}
			if(flag){
				if(confirm($scope.specie_weather_message)){
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
	}

	$scope.np_cancelar = () => {
		$scope.np_reset()
		$scope.nueva_planta_abierto = false
	}

	$scope.check_icon_selection = (number) => {
		if($scope.nueva_planta_icono == 'img/plant-icon' + number + '.svg'){
			return true
		}else{
			return false
		}
	}

	$scope.geticonurl = (number) => {
		return 'img/plant-icon' + number + '.svg'
	}

	$scope.select_icono = (number) => {
		$scope.nueva_planta_icono = $scope.geticonurl(number)
	}

	$scope.busca_especie = (especie) => {
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

	$scope.select_slot = (id) => {
		$scope.planta_seleccionada = id
		if($scope.jardin[$scope.seccion_actual][id] == null){
			$scope.nueva_planta_abierto = true
		}else{
			$scope.obtiene_especie(id)
			$scope.planta_abierto = true
		}
	}

	$scope.reset_garden_form = () => {
		$scope.nueva_seccion_nombre = ''
		$scope.nueva_seccion_tipo = 'Interior'
		$scope.nueva_seccion_humedad = 'Neutral'
		$scope.nueva_seccion_temperatura = 0
		$scope.nueva_seccion_intensidad_luz = 'Neutral'
	}

	$scope.nueva_seccion = (k) => {
		if($scope.nueva_seccion_nombre == ''){
			alert('Necesitas especificar el nombre de la sección.')
		}
		else if($scope.jardin[$scope.no_secciones] == null){
			if($scope.localization){
				$scope.checkDailyTemperature
			}
			$scope.jardin[$scope.jardin.no_secciones] = {nombre: $scope.nueva_seccion_nombre,
																									descripcion: $scope.nueva_seccion_descripcion, 
																									tipo: $scope.nueva_seccion_tipo,
																									localizacion: $scope.localization,
																									temperatura: $scope.nueva_seccion_temperatura,
																									no_especies :0, 
																									fecha: $scope.today,
																									bg_number: $scope.garden_bg_number}
			$scope.jardin.no_secciones++
			$scope.save_garden(false) 
			$scope.nueva_seccion_abierto = false
		}else{
			$scope.nueva_seccion(k+1)
		}
	}

	$scope.cancelar_seccion = () => {
		$scope.reset_garden_form()
		$scope.nueva_seccion_abierto = false
	}

	$scope.eliminar_seccion = () => {
		var k = 0
		if(confirm('¿En verdad desea eliminar la sección?')){
			if($scope.jardin.no_secciones != 0){
				delete $scope.jardin[$scope.seccion_actual]
				while(k<5){
					if($scope.jardin[k] == null){
						k++
					}else{
						$scope.seccion_actual = k
						break
					}
				}
				$scope.jardin.no_secciones--
				$scope.section_reestruct()
				$scope.save_garden(false)
			}
		}
	}

	$scope.obtiene_especie = (id) => {
		for(var i = 0; i< $scope.database.Basic.no_especies; i++){
			if($scope.lista_especies[i].especie == $scope.jardin[$scope.seccion_actual][id].especie){
				$scope.especie_provisional = $scope.lista_especies[i]
				break;
			} 
		}
	}

	$scope.nueva_bitacora = (v) => {
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

	$scope.nueva_bitacora_seccion = (v) => {
		var y = $scope.bitacora_fecha.getUTCFullYear() + ""
		var m = ($scope.bitacora_fecha.getUTCMonth() + 1) + ""
		var d = $scope.bitacora_fecha.getUTCDate() + ""
		var f = d + "/" + m + "/" + y
		
		if($scope.jardin[$scope.seccion_actual].bitacora == null){
			$scope.jardin[$scope.seccion_actual].bitacora = {}
		}
		if($scope.bitacora == ''){
			alert('No puedes dejar el campo vacío.')
		}
		else if($scope.jardin[$scope.seccion_actual].bitacora[v] == null){
			$scope.jardin[$scope.seccion_actual].bitacora[v] = {fecha : f, bitacora : $scope.bitacora}
			$scope.save_garden(false)
			$scope.new_bitacora = false
			$scope.bitacora = ''
		}else{
			$scope.nueva_bitacora_seccion(v+1)
		}
	}

	$scope.add_seccion_info = () => {
		var y = $scope.bitacora_fecha.getUTCFullYear() + ""
		var m = ($scope.bitacora_fecha.getUTCMonth() + 1) + ""
		var d = $scope.bitacora_fecha.getUTCDate() + ""
		var f = d + "/" + m + "/" + y


		if($scope.seccion_info_selected == 'bitacora'){
			$scope.new_bitacora_seccion = true
		}else{

		}
		

	}

	$scope.iniciar_sesion = () => {
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

	$scope.cerrar_sesion = () => {
		if($scope.browser_support){
			localStorage.removeItem("sesion_iniciada")
			localStorage.removeItem("usuario")
			console.log(localStorage.getItem("sesion_iniciada"))
			location.reload()
		}else{
			location.reload()
		}
	}
 
	$scope.registrar_usuario = () => {
		if($scope.nuevo_usuario_nombre == '' || $scope.nuevo_usuario_pass == ''|| $scope.nuevo_jardin_nombre == '' || $scope.nuevo_usuario_email == ''){
			$scope.message = 'Ningun campo debe quedar vacío'
		}else if($scope.usuario_pass_coincide == false){
			$scope.message = 'La contraseña no coincide.'
		}else if($scope.database.usuarios[$scope.nuevo_usuario_nombre] != null){
			$scope.message = 'El usuario ya existe.'
		}else if($scope.nuevo_usuario_nombre.includes(' ')){
			$scope.message = 'El nombre de usuario no debe contener espacios.'
		}else if($scope.nuevo_usuario_country == '-1'){
			$scope.message = 'Porfavor, eliga su lúgar de orígen.'
		}else if($scope.checkPassword()){
			var shell = true
			for(var user in db.usuarios){
				if($scope.nuevo_usuario_email == db.usuarios[user]){
					shell = false
					$scope.message = 'Ese correo ya ha sido registrado.'
				}
			}
			if(shell){
				db.usuarios[$scope.nuevo_usuario_nombre] = {localizacion: $scope.nuevo_usuario_state + ', ' + $scope.nuevo_usuario_city + ', ' + $scope.nuevo_usuario_country,background_url: 'img/profile_background.jpg', url: 'img/profile.png', usuario: $scope.nuevo_usuario_nombre, pass: $scope.nuevo_usuario_pass, visibilidad : $scope.visibilidad, jardin : {fecha_de_creacion : $scope.today, no_secciones : 0, nombre: $scope.nuevo_jardin_nombre}}
				if($scope.visibilidad == 'privado'){
					db.usuarios[$scope.nuevo_usuario_nombre].pase_turista = $scope.pase_turista
				}
				db.usuarios.no_usuarios++
				db.$save()
				alert('Usuario registado correctamente!')
				location.reload()
			}
		}
	}

	$scope.passInfo = () => {
		$scope.current_profile = db.usuarios[$scope.current_user]
	}

	db.$loaded().then(() => {
		if (typeof(Storage) !== "undefined") {
			$scope.browser_support = true
			console.log('first flag.')
			if(localStorage.getItem("sesion_iniciada") == null){
				$scope.loading_screen = false
				console.log('nothing in local')
			}else{
				$scope.jardin = db.usuarios[localStorage.getItem("usuario")].jardin
				$scope.current_user = localStorage.getItem("usuario")
				$scope.current_profile = db.usuarios[$scope.current_user]
				$scope.passInfo()
				$scope.garden_logged = true


				$.simpleWeather({
			    location: $scope.current_profile.localizacion,
			    woeid: '',
			    unit: 'c',
			    success: (weather) => {
			    	db.usuarios[$scope.current_user].jardin.temperatura = weather.temp
			    	db.usuarios[$scope.current_user].jardin.temp_url = weather.thumbnail
			    	$scope.humidity = weather.humidity
			    	if(weather.code == 3200){
			    		db.usuarios[$scope.current_user].jardin.clima = 'No disponible.'
			    	}else{
			    		db.usuarios[$scope.current_user].jardin.clima = lista_climas[weather.code]
			    	}
			    	for(i in $scope.current_profile.jardin){
		      		if($scope.current_profile.jardin[i].tipo == 'Exterior'){
		      			$scope.lista_mensajes.push('Hay ' + $scope.current_profile.jardin[i].no_especies + ' plantas en la sección: ' + $scope.current_profile.jardin[i].nombre + ' de tu jardin.')
		      		}
		      	}
			      if(weather.code < 18 || weather.code > 36){
			      	$scope.message = 'Las plantas están en el exterior. ¿Desea apagar alarmas de riego?\n*Considere meterlas a su hogar o en un lugar protegido.'
			      }else if(weather.code > 19 && weather.code < 31){
			      	$scope.message = 'Las plantas están en el exterior. No recibirán suficiente luz de sol.'
			      }else{
			      	$scope.message = 'Las plantas están en el exterior, necesitarán riego indispensable para el día.'
			      }
			      db.usuarios[$scope.current_user].jardin.message = $scope.message
			      $scope.loading_screen = false
			      alert('El clima de hoy es: ' + db.usuarios[$scope.current_user].jardin.clima + '\nTemperatura: '+ db.usuarios[$scope.current_user].jardin.temperatura + '°C\n' + $scope.lista_mensajes + ' ' + $scope.message)
			      db.$save()

			    },
			    error: (error) => {
			      console.log(error)
			    }
			  });
			}
		} else {
		  $scope.browser_support = false
		  alert("Este navegador no soporta la consistencia en el inicio de sesión.")
		}
	})

})

// 0 => New Moon
    // 1 => Waxing Crescent Moon
    // 2 => Quarter Moon
    // 3 => Waxing Gibbous Moon
    // 4 => Full Moon
    // 5 => Waning Gibbous Moon
    // 6 => Last Quarter Moon
    // 7 => Waning Crescent Moon