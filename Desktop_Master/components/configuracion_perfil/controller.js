angular.module('gns.controllers')
.controller('configuraciondeperfilController', function($scope, $firebaseObject) {
	var rootRef = firebase.database().ref();
	var db = $firebaseObject(rootRef)
	var storage = firebase.storage()
	var storageRef = storage.ref()

	$scope.profile = {}

	$scope.language = 'es'

	$scope.old_password =''
	$scope.new_password =''
	$scope.check_password =''

	$scope.profile_menu_selection = 'general'

	$scope.uploadPics = (id) => {
		var file = document.getElementById(id)
		if(file.files[0].name == undefined){
			alert('Debe seleccionar una imagen.')
		}else{
			var imageRef = storageRef.child('usuarios/' + $scope.current_user + '/' + file.files[0].name)
			var metadata = {
				  contentType: 'image/jpg'
				};
			var uploadTask = imageRef.put(file.files[0], metadata);
			$scope.upload_done = false
			// Listen for state changes, errors, and completion of the upload.
			uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
			  (snapshot) => {
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
			  }, (error) => {

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
			}, () => {
			  // Upload completed successfully, now we can get the download URL
			  var downloadURL = uploadTask.snapshot.downloadURL;
			  file.files[0] = null
			  alert('Se ha subido a la base de datos con exito.')
			  if(id == 'profile_input'){
			  	db.usuarios[$scope.current_user].url = downloadURL
			  	file = document.getElementById('background_input')
			  	if(file.files[0] != undefined){
			  		$scope.uploadPics('background_input')
			  	}
			  	db.$save()
			  }else{
			  	db.usuarios[$scope.current_user].background_url = downloadURL
			  	db.$save()
			  }
				alert("Se ha actualizado la base de datos.")
			});
		}
	}

	$scope.changeBackgroundPicture = () => {
			var letsclick = document.getElementById('profile_input')
			letsclick.click()
		}

	$scope.changeProfilePicture = () => {
		var letsclick = document.getElementById('background_input')
		letsclick.click()
	}

	db.$loaded().then(() => {
		if (typeof(Storage) !== "undefined") {
			$scope.browser_support = true
			console.log('first flag.')
			if(localStorage.getItem("sesion_iniciada") == null){
				console.log('nothing in local')
			}else{
				$scope.current_user = localStorage.getItem("usuario")
				$scope.profile = db.usuarios[$scope.current_user]
			}
		}
	})
})