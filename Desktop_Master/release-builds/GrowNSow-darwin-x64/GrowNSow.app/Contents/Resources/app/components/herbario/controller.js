angular.module('gns.controllers')
.controller('herbarioController', function($scope, $firebaseObject){
	$scope.edit_genero = ''
	$scope.edit_familia = ''
	$scope.edit_orden = ''
	$scope.edit_clase = ''
	$scope.edit_division = ''
	$scope.edit_origen = ''
	$scope.edit_comentario = ''
	$scope.edit_tipo = ''
	$scope.edit_especie = ''
	$scope.edit_propiedades = {}
	$scope.edit_clima = ''
	$scope.nuevo_url = ''

	$scope.bottom_section = 'comments'

	$scope.side_menu_open = false
	
	$scope.image_position = 'idle'
	$scope.edit_nombre_comun = ''
	$scope.current_property = 'medicinales'

	$scope.empty = {especie: '', genero: '', familia: '',	orden: '', clase: '', division: '', origen: '', comentario: '', id: '', propiedades: {medicinales: {}, nutrimentales: {}, restricciones:{}}, tipo: '',nombre_comun: '',clima: ''}

	$scope.show_pic = false

	$scope.especie_seleccionada = ''

	$scope.search_type = 'nombre_comun'
	$scope.search_item = ''

	$scope.image_file = null
	$scope.waiting_image = false
	$scope.current_image = 0

	$scope.image_url = ''

	$scope.image_on = false
	$scope.input = null

	$scope.open_image_option = false
	$scope.img_bar_open = false

	var storage = firebase.storage()
	var storageRef = storage.ref()

	var rootRef = firebase.database().ref();
	var db = $firebaseObject(rootRef)

	$scope.img_selected = ''
	$scope.upload_done = true
	$scope.fs_open = false

	$scope.toFull = function(url){
		$scope.img_selected = url
		$scope.fs_open = true
	}
	
	$scope.upload_image = function(){
		var file = document.getElementById("es_img")
		
		if($scope.image_url != ''){
			if(db.Basic[$scope.especie_seleccionada].pictures==null){
				db.Basic[$scope.especie_seleccionada].pictures = {no_imagenes: 0}
				$scope.current_image = 0
			}else if(db.Basic[$scope.especie_seleccionada].pictures.no_imagenes>0){
				$scope.current_image = db.Basic[$scope.especie_seleccionada].pictures.no_imagenes
			}
			db.Basic[$scope.especie_seleccionada].pictures[$scope.current_image] = {url:$scope.image_url, id: $scope.current_image}
			db.Basic[$scope.especie_seleccionada].pictures.no_imagenes++
			db.$save()
			$scope.cancel_image()
			alert("Se ha actualizado la base de datos.")
		}else{	
			if(file.files[0].name == undefined || $scope.upload_done == false){
				alert('Debe seleccionar una imagen.')
			}else{
				var imgRef = $scope.storageRef.child(file.files[0].name)

				var metadata = {
					  contentType: 'image/jpg'
					};
				var uploadTask = imgRef.put(file.files[0], metadata);
				$scope.upload_done = false
				// Listen for state changes, errors, and completion of the upload.
				uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
				  function(snapshot) {
				    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
				    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				    console.log('Upload is ' + progress + '% done');
				    switch (snapshot.state) {
				      case firebase.storage.TaskState.PAUSED: // or 'paused'
				        console.log('Upload is paused');
				        break;
				      case firebase.storage.TaskState.RUNNING: // or 'running'
				        console.log('Upload is running');
				        break;
				    }
				  }, function(error) {

				  // A full list of error codes is available at
				  // https://firebase.google.com/docs/storage/web/handle-errors
				  switch (error.code) {
				    case 'storage/unauthorized':
				    	console.log('error de autorizaci&iocute;n.')
				      // User doesn't have permission to access the object
				      break;
				    case 'storage/canceled':
				    	console.log('error, se ha cancelado la subida.')
				      // User canceled the upload
				      break;
				    case 'storage/unknown':
				    	console.log('Error no reconocido.')
				      // Unknown error occurred, inspect error.serverResponse
				      break;
				  }
				}, function() {
				  // Upload completed successfully, now we can get the download URL
				  var downloadURL = uploadTask.snapshot.downloadURL;
				  $scope.upload_done = true
				  $scope.image_url = downloadURL
				  file.files[0] = null
				  alert('Se ha subido a la base de datos con exito.')
				  console.log(downloadURL)
				  if(db.Basic[$scope.especie_seleccionada].pictures==null){
						db.Basic[$scope.especie_seleccionada].pictures = {no_imagenes: 0}
						$scope.current_image = 0
					}else if(db.Basic[$scope.especie_seleccionada].pictures.no_imagenes>0){
						$scope.current_image = db.Basic[$scope.especie_seleccionada].pictures.no_imagenes
					}
					db.Basic[$scope.especie_seleccionada].pictures[$scope.current_image] = {url:$scope.image_url, id: $scope.current_image}
					db.Basic[$scope.especie_seleccionada].pictures.no_imagenes++
					db.$save()
					$scope.cancel_image()
					alert("Se ha actualizado la base de datos.")
				});
			}
		}
	}

	$scope.open_sidebar = function(){
		if($scope.side_menu_open){
			$scope.side_menu_open = false
		}else{
			$scope.side_menu_open = true
		}
	}

	$scope.cancel_image = function(){
		$scope.open_image_option = false
		$scope.show_pic = false
		$scope.waiting_image = false
		$scope.image_url = ''
		$scope.image_on = false
	}

	$scope.openFile = function() {
    $scope.input = document.getElementById('es_img')
    $scope.show_pic = true
	}

	$scope.left_image = function(){
		if($scope.current_image > 1){
			$scope.image_position = 'left'
			$scope.current_image--
			$scope.readImage()
			$scope.image_position = 'idle'
		}
	}

	$scope.right_image = function(){
		if($scope.$scope.storageRef.Basic[$scope.especie_seleccionada][$scope.current_image + 1] != null){
			$scope.image_position = 'right'
			$scope.current_image++
			$scope.readImage()
			$scope.image_position = 'idle'
		}
	}

	$scope.select_image = function(){
		if($scope.image_file.files[0] == null){
			alert('Debe seleccionar una imagen primero')
		}else{
			var uploadTask = $scope.storageRef.child("Basic/" + $scope.especie_seleccionada).put($scope.image_file.files[0])
			$scope.current_image++
		}
	}

	$scope.add_img = function(){
		if($scope.waiting_image){
			alert('Necesitas seleccionar una imagen primero')
		}else{
			if($scope.storageRef.Basic == null){
				$scope.storageRef.Basic = {}
			}
			$scope.image_file = document.createElement("INPUT")
			$scope.image_file.setAttribute("type", "file")
			$scope.image_file.setAttribute("class", "file_upload")
			$('div').filter('.form-section.imagen').append($scope.image_file)
		}
	}

	$scope.add_metadatos = function(){
		if(db.metadatos == null){
			db.metadatos = {genero:{}, familia:{}, orden:{}, clase:{}, division:{}}
			db.metadatos.genero[$scope.genero] = $scope.genero
			db.metadatos.familia[$scope.familia]=$scope.familia
			db.metadatos.orden[$scope.orden]=$scope.orden
			db.metadatos.clase[$scope.clase]=$scope.clase
			db.metadatos.division[$scope.division]=$scope.division
		}else{
			if(db.metadatos.genero[$scope.genero] == null){
				db.metadatos.genero[$scope.genero] = $scope.genero
			}
			if(db.metadatos.familia[$scope.familia] == null){
				db.metadatos.familia[$scope.familia]=$scope.familia
			}
			if(db.metadatos.orden[$scope.orden] == null){
				db.metadatos.orden[$scope.orden]=$scope.orden
			}
			if(db.metadatos.clase[$scope.clase] == null){
				db.metadatos.clase[$scope.clase]=$scope.clase
			}
			if(db.metadatos.division[$scope.division] == null){
				db.metadatos.division[$scope.division]=$scope.division
			}
		}
	}

	$scope.delete = function(){
		var k = 0
		var deleted = ''
		if(confirm('Realmente desea eliminar ' + $scope.especie_seleccionada)){
			deleted = $scope.especie_seleccionada
			delete db.Basic[$scope.especie_seleccionada]
			db.Basic.no_especies--
			db.$save()
			$scope.select_from_list($scope.lista_especies[0])
			while(k < 20){
				if(db.Basic[deleted] == null){
					$scope.start_list()
					break
				}else if(k == 19){
					$scope.delete()
				}
				k++
			}
		}
	}

	$scope.edit_e = function(){
		var k = 0
		if($scope.edit_genero == '' || $scope.edit_familia == '' || $scope.edit_orden == '' || $scope.edit_clase == '' || $scope.edit_nombre_comun == ''){
			//$scope.alert_empty_field=true
			alert('No puede dejar campo abierto')
		}else{
			db.Basic[$scope.especie_seleccionada].especie = $scope.edit_especie 
			db.Basic[$scope.especie_seleccionada].genero = $scope.edit_genero 
			db.Basic[$scope.especie_seleccionada].familia = $scope.edit_familia	
			db.Basic[$scope.especie_seleccionada].orden = $scope.edit_orden 
			db.Basic[$scope.especie_seleccionada].clase = $scope.edit_clase 
			db.Basic[$scope.especie_seleccionada].division = $scope.edit_division 
			db.Basic[$scope.especie_seleccionada].origen = $scope.edit_origen
			db.Basic[$scope.especie_seleccionada].comentario = $scope.edit_comentario
			db.Basic[$scope.especie_seleccionada].id = $scope.especie_seleccionada
			db.Basic[$scope.especie_seleccionada].propiedades = $scope.edit_properties
			db.Basic[$scope.especie_seleccionada].tipo = $scope.edit_tipo
			db.Basic[$scope.especie_seleccionada].nombre_comun = $scope.edit_nombre_comun
			db.Basic[$scope.especie_seleccionada].clima = $scope.edit_clima
			$scope.add_metadatos()
			alert('Especie editada!')
			db.$save()
		}
	}

	$scope.select_from_list = function(especie){
		$scope.especie_seleccionada = especie.id
		
		$scope.edit_genero = db.Basic[$scope.especie_seleccionada].genero
		$scope.edit_tipo = db.Basic[$scope.especie_seleccionada].tipo
		$scope.edit_especie = db.Basic[$scope.especie_seleccionada].especie
		$scope.edit_comentario = db.Basic[$scope.especie_seleccionada].comentario
		$scope.edit_familia = db.Basic[$scope.especie_seleccionada].familia
		$scope.edit_orden = db.Basic[$scope.especie_seleccionada].orden
		$scope.edit_clase = db.Basic[$scope.especie_seleccionada].clase
		$scope.edit_division = db.Basic[$scope.especie_seleccionada].division
		$scope.edit_origen = db.Basic[$scope.especie_seleccionada].origen
		$scope.edit_propiedades = db.Basic[$scope.especie_seleccionada].propiedades
		$scope.edit_clima = db.Basic[$scope.especie_seleccionada].clima
		$scope.edit_nombre_comun = db.Basic[$scope.especie_seleccionada].nombre_comun

		$scope.pictures = db.Basic[$scope.especie_seleccionada].pictures

		$scope.side_menu_open = false
		//$scope.readImage()
	}


	$scope.check_order = function(especie){
		var str = especie[$scope.search_type]
		if($scope.search_item == ''){
			return true
		}else if(str.search($scope.search_item)!=-1 || str.toLowerCase() == $scope.search_item ){
			return true
		}else{ return false}
	}

	$scope.findKey = function(){
		var currentKey = 0
		for(var i = 0; i<$scope.lista_especies.length; i++){
			if($scope.lista_especies[i].id == $scope.especie_seleccionada){
				currentKey = i
			}
		}
		return currentKey
	}

	$scope.left_specie = function(){
		var i = $scope.findKey()
		if($scope.findKey() > 0){
			$scope.select_from_list($scope.lista_especies[i-1])
		}
	}

	$scope.right_specie = function(){
		console.log('done')
		var i = $scope.findKey()
		if($scope.findKey() < $scope.lista_especies.length){
			$scope.select_from_list($scope.lista_especies[i+1])
		}
	}

	$scope.keyPressed = function(event){
		console.log('key')
		if(event.keyCode == 37){
			$scope.left_specie()
		}else if(event.keyCode == 39){
			$scope.right_specie()
		}
	}

	db.$loaded().then(function(){
		var i = 0
		for(var o in db.Basic){
			if(i == 0){
				var first_especie = db.Basic[o]
			}
			i++	
		}
		$scope.select_from_list(first_especie)
	})
	// db.$loaded().then(function(){

	// })
})