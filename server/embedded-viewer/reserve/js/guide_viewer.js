//Global vars
var model, scene, camera, input, cameraControl, cameraFlight, gltf, guide, spacing;

$.ajax({
    type: 'GET',
    url: '/img/gearbox.gltf',
    success: function (data) {
        gltf = data;
        init();
    },
    error: function (err) {
        console.error(err);
        //alert('Сервер не отвечает');
        //window.location.href = 'index.html';
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
        model.solid = true;

        cameraFlight = new xeogl.CameraFlightAnimation({
            fit: true, // Default
            fitFOV: 20, // Default, degrees
            duration: 1 // Default, seconds
        })

        new xeogl.AmbientLight({
            color: [256.0, 256.0, 256.0],
            intensity: 0.8
        });

        cameraControl = new xeogl.CameraControl();

        scene = model.scene;

        camera = scene.camera;

        scene.on("tick", () => {
            if (true) {
                camera.orbitYaw(0.1);
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
        guide = new GuideEx(model, input);
        spacing = new SpacingEx(model);
        var highlight = new HighlightEx(cameraControl);
        var opacity = new Opacity(cameraControl, model);
        var hidePats = new HideParts(cameraControl);

		document.getElementById('spin').style.display = 'none';

    });


}

function onMessage(e) {
    console.log(e);
    alert(e);
}

if (window.addEventListener) {
    window.addEventListener("message", onMessage, false);
}
else {
    window.attachEvent("onmessage", onMessage);
}