//Global vars
var model, scene, camera, input, cameraControl, cameraFlight, gltf;

lastSpoiler = "";
lastBtn = ""

function spoilers(curSpoiler, curBtn) {

	if (lastBtn && lastBtn !== curBtn) {
		document.getElementById(lastBtn).click();
	}
	if (lastSpoiler && lastSpoiler !== curSpoiler) {
		document.getElementById(lastSpoiler).style.display = "none";
	}
	if (curSpoiler) {
		const style = document.getElementById(curSpoiler).style;
		style.display = (style.display == 'block') ? 'none' : 'block';
		lastSpoiler = curSpoiler;
	}
	if (document.getElementById(curSpoiler).style.display === "block") {
		lastBtn = curBtn;	
	} else {
		lastBtn = '';
	}

}

var urlParams = new URLSearchParams(window.location.search);
var modelId = urlParams.get('id');
var token = urlParams.get('token');
var groupId = urlParams.get('groupId');

$.ajax({
	type: 'GET',
	url: '/model/' + modelId + '?token=' + token + '&groupId=' + groupId,
	success: function (data) {
		gltf = data.model;
		init();
	},
	error: function (err) {
		console.error(err);
		window.location.href = 'index.html';
	},
	xhr: function () {
		var xhr = new window.XMLHttpRequest();
		xhr.addEventListener("progress", function (evt) {
			if (evt.lengthComputable) {
				var percentComplete = evt.loaded / evt.total;
				document.getElementById('completed').innerText = (percentComplete * 100).toFixed(2) + '%';
			}
		}, false);

		return xhr;
	}
});

function init() {
	model = new xeogl.GLTFModel({
		id: model,
		src: gltf,
		pickable: true
	})

	model.on("loaded", () => {
		model.edges = true;
		model.outline = true;
		model.backfaces = true;
		model.solid = true,
		clipping = new Clipping(model);

		new xeogl.AmbientLight({
			color: [122.0 / 256.0, 164.0 / 256.0, 255.0 / 256.0],
			intensity: 0.8
		});

		cameraControl = new xeogl.CameraControl();

		scene = model.scene;

		camera = scene.camera;

		scene.on("tick", () => {
			if (presentation.rotationMode) {
				camera.orbitYaw(0.5);
			}
		});

		let aabbSizes = {
			width: Math.abs(model.aabb[3]) + Math.abs(model.aabb[0]),
			height: Math.abs(model.aabb[4]) + Math.abs(model.aabb[1]),
			center: [
				(model.aabb[3] + model.aabb[0]) / 2,
				(model.aabb[4] + model.aabb[1]) / 2,
				(model.aabb[5] + model.aabb[2]) / 2
			]
		}

		const objectSize = Math.max(aabbSizes.width, aabbSizes.height);
		const d = objectSize / (2 * Math.tan(camera.perspective.fov * (Math.PI / 360)));

		camera.eye = [d, d, d];
		camera.look = aabbSizes.center;
		camera.up = [0, 1, 0];
		input = scene.input;

		//Exs
		var annotation = new AnnotationEx(input);
		var highlight = new HighlightEx(cameraControl);
		var hidePats = new HideParts(cameraControl, camera);
		var spacing = new SpacingEx(model);
		var presentation = new Presentation();
		var opacity = new Opacity(cameraControl, model);

		var timer = 0;

		document.getElementById('spin').style.display = 'none';

		scene.on('rendering', (id, pass) => {
			timer++;
			if (timer === 10) {
				$.ajax({
					type: 'POST',
					data: JSON.stringify({
						png: scene.canvas.canvas.toDataURL('png')
					}),
					processData: false,
					contentType: false,
					cache: false,
					dataType: 'json',
					contentType: "application/json; charset=utf-8",
					url: '/preview/' + modelId,
					success: function (data) {
						console.log(data)
					},
					error: function (err) {
						console.error(err);
					}
				});
			}
		})

	});



}
