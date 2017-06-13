angular.module('gns.controllers')
.controller('calendarController', function($scope, $firebaseObject){
	var rootRef = firebase.database().ref();
	var db = $firebaseObject(rootRef)
	var storage = firebase.storage()
	var storageRef = storage.ref()
	var today = new Date()

	$scope.fecha_seleccionada = {y: today.getUTCFullYear(), m: today.getUTCMonth(), d: today.getUTCDate()}
	$scope.fecha_today = {y: today.getUTCFullYear(), m: today.getUTCMonth(), d: today.getUTCDate() - 1} 
	$scope.moon = {}

	$scope.month = ''
	$scope.month_number = 0
	$scope.currentMonth = {}

	$scope.calendar_section = 'single'

	/*var y = $scope.bitacora_fecha.getUTCFullYear() + ""
	var m = ($scope.bitacora_fecha.getUTCMonth() + 1) + ""
	var d = $scope.bitacora_fecha.getUTCDate() + ""
	var f = d + "/" + m + "/" + y*/

	$scope.getMoon = function(id){
		console.log(id)
		var moon = {}
		switch(id){
			case 0:
				moon.name = 'Luna Nueva'
				moon.message = 'Durante esta fase está recomendado llevar a cabo labores como el control de raíces adventicias, eliminando aquellas plantas que no deseemos en nuestra huerta, además puede llevar a cabo otras tareas de mantenimiento de los cultivos.'
				break
			case 1:
				moon.name = 'Luna Creciente'
				moon.message = 'Durante esta fase la savia asciende desde las raíces hasta la parte superior de la planta. Si siembra durante esta fase el desarrollo será más rápido, el follaje crecerá mucho más que las raíces. Por eso sería buena idea favorecer el desarrollo de éstas. También es más común que las plantas sean menos resistentes a las enfermedades o plagas.'
				break
			case 2:
				moon.name = 'Cuarto Creciente'
				moon.message = 'Durante esta fase la savia asciende desde las raíces hasta la parte superior de la planta. Si siembra durante esta fase el desarrollo será más rápido, el follaje crecerá mucho más que las raíces. Por eso sería buena idea favorecer el desarrollo de éstas. También es más común que las plantas sean menos resistentes a las enfermedades o plagas.'
				break
			case 3:
				moon.name = 'Menguante Gibosa'
				moon.message = 'Durante esta fase la savia asciende desde las raíces hasta la parte superior de la planta. Si siembra durante esta fase el desarrollo será más rápido, el follaje crecerá mucho más que las raíces. Por eso sería buena idea favorecer el desarrollo de éstas. También es más común que las plantas sean menos resistentes a las enfermedades o plagas.'
				break
			case 4:
				moon.name = 'Luna Llena'
				moon.message = 'En esta fase puede haber un aumento de las plagas. Además la savia se encuentra principalmente concentrada en el follaje de la planta, es por eso que este crece más rápidamente, aunque hay menos fructificación que en otras fases lunares.'
				break
			case 5:
				moon.name = 'Menguante Gibosa'
				moon.message = 'Durante la luna menguante notaremos que la planta tiene más esplendor, y tanto es así que tiende a fructificar mucho más. Es un período en el que la savia desciende hacia las raíces.'
				break
			case 6:
				moon.name = 'Cuarto Creciente'
				moon.message = 'Durante la luna menguante notaremos que la planta tiene más esplendor, y tanto es así que tiende a fructificar mucho más. Es un período en el que la savia desciende hacia las raíces.'
				break
			case 7:
				moon.name = 'Luna Menguante'
				moon.message = 'Durante la luna menguante notaremos que la planta tiene más esplendor, y tanto es así que tiende a fructificar mucho más. Es un período en el que la savia desciende hacia las raíces.'
				break
		}
		moon.url = 'img/moon' + id + '.svg'
		moon.id = id
		return moon
		console.log($scope.moon.name)
	}

	$scope.getMonth = function(mon){
		switch(mon + 1){
			case 1:
				$scope.month = 'Enero'
				break
			case 2:
				$scope.month = 'Febrero'
				break
			case 3:
				$scope.month = 'Marzo'
				break
			case 4:
				$scope.month = 'Abril'
				break
			case 5:
				$scope.month = 'Mayo'
				break
			case 6:
				$scope.month = 'Junio'
				break
			case 7:
				$scope.month = 'Julio'
				break
			case 8:
				$scope.month = 'Agosto'
				break
			case 9:
				$scope.month = 'Septiembre'
				break
			case 10:
				$scope.month = 'Octubre'
				break
			case 11:
				$scope.month = 'Noviembre'
				break
			case 12:
				$scope.month = 'Diciembre'
				break
		}
	}

	$scope.generateMonth = function(){
		$scope.currentMonth = {}
		var getDaysInMonth = function(month,year) {
		  // Here January is 1 based
		  //Day 0 is the last day in the previous month
		 return new Date(year, month, 0).getDate();
		// Here January is 0 based
		// return new Date(year, month+1, 0).getDate();
		};
		var longitude = getDaysInMonth($scope.month_number + 1, $scope.fecha_today.y)
		console.log(longitude)
		var n=0
		for(var i=0 ; i< longitude; i++){
			var provisional = new Date($scope.fecha_today.y, $scope.month_number, i)
			var dia = ''
			var moon_ph = getMoonPhase($scope.fecha_today.y, $scope.month_number, i)
			var moon = $scope.getMoon(moon_ph)
			
			switch(provisional.getDay()){
				case 0:
					dia = 'lunes'
					break
				case 1:
					dia = 'martes'
					if(i == 0){
						n = 1
						$scope.currentMonth[0] = {}
					}
					break
				case 2:
					dia = 'miercoles'
					if(i == 0){
						n = 2
						$scope.currentMonth[0] = {}
						$scope.currentMonth[1] = {}
					}
					break
				case 3:
					dia = 'jueves'
					if(i == 0){
						n = 3
						$scope.currentMonth[0] = {}
						$scope.currentMonth[1] = {}
						$scope.currentMonth[2] = {}
					}
					break
				case 4:
					dia = 'viernes'
					if(i == 0){
						n = 4
						$scope.currentMonth[0] = {}
						$scope.currentMonth[1] = {}
						$scope.currentMonth[2] = {}
						$scope.currentMonth[3] = {}
					}
					break
				case 5:
					if(i == 0){
						n = 5
						$scope.currentMonth[0] = 0
						$scope.currentMonth[1] = 0
						$scope.currentMonth[2] = 0
						$scope.currentMonth[3] = 0
						$scope.currentMonth[4] = 0
					}
					dia = 'sabado'
					break
				case 6:
					if(i == 0){
						n = 6
						$scope.currentMonth[0] = 0
						$scope.currentMonth[1] = 0
						$scope.currentMonth[2] = 0
						$scope.currentMonth[3] = 0
						$scope.currentMonth[4] = 0
						$scope.currentMonth[5] = 0
					}
					dia = 'domingo'
					break
				}
			$scope.currentMonth[i + n] = {fecha: (i +1) + '/' + ($scope.month_number + 1) + '/' + $scope.fecha_today.y, moon : moon, dia: dia, dia_number: i}
		}
	}

	$scope.less_month = function(){
		if($scope.month_number == 0){
			$scope.month_number = 11
		}else{
			$scope.month_number--
		}
		$scope.getMonth($scope.month_number)
		$scope.generateMonth()
	}

	$scope.more_month = function(){
		if($scope.month_number == 11){
			$scope.month_number = 0
		}else{
			$scope.month_number++
		}
		$scope.getMonth($scope.month_number)
		$scope.generateMonth()
	}

	$scope.istoday = function(id){
		var one = new Date($scope.fecha_today.y, $scope.month_number, id)
		var two = new Date($scope.fecha_today.y, $scope.month_number, $scope.fecha_today.d)
		if(one == two){
			return true
		}else{
			return false
		}
	}

	$scope.select_dia = function(day){
		$scope.calendar_fecha = day.fecha
		$scope.moon = {}
		$scope.moon = day.moon
		$scope.calendar_section = 'single'
	}

	db.$loaded().then(function(){
		var moon_ph = getMoonPhase($scope.fecha_today.y, $scope.fecha_today.m, $scope.fecha_today.d)
		$scope.calendar_fecha = $scope.fecha_today.d + "/" + $scope.fecha_today.m + "/" + $scope.fecha_today.y
		console.log(moon_ph)
		$scope.moon = $scope.getMoon(moon_ph)

		$scope.getMonth($scope.fecha_today.m)
		$scope.month_number = $scope.fecha_today.m

		$scope.generateMonth()
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