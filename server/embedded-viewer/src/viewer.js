import axios from 'axios';

import xeogl from './xeogl-dependencies';

import AnnotationExtension from "./extentions/annotation";
import HighlightExtension from "./extentions/highlight";
import HidePartsExtension from "./extentions/hideParts";
import SpacingExtension from "./extentions/spacing";
import ClippingExtension from './extentions/clipping';
import PresentationExtension from "./extentions/presentation";
import OpacityExtension from "./extentions/opacity";

//Global vars
var model, scene, camera, input, cameraControl, gltf;

var lastSpoiler = "";
var lastBtn = "";

export function spoilers(curSpoiler, curBtn) {

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

export function init(viewerToken, modelToken) {
	axios.get(`http://127.0.0.1:4000/model/${modelToken}?token=${viewerToken}`)
		.then(res => {
			gltf = res.data.model;

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

				const annotation = new AnnotationExtension(input);
				const highlight = new HighlightExtension(cameraControl);
				const hideParts = new HidePartsExtension(cameraControl, camera, model);
				const spacing = new SpacingExtension(model);
				const clipping = new ClippingExtension(model);
				const presentation = new PresentationExtension();
				const opacity = new OpacityExtension(cameraControl);

				// var timer = 0;

				document.getElementById('spin').style.display = 'none';

				// scene.on('rendering', (id, pass) => {
				// 	timer++;
				// 	if (timer === 10) {
				// 		$.ajax({
				// 			type: 'POST',
				// 			data: JSON.stringify({
				// 				png: scene.canvas.canvas.toDataURL('png')
				// 			}),
				// 			processData: false,
				// 			contentType: false,
				// 			cache: false,
				// 			dataType: 'json',
				// 			contentType: "application/json; charset=utf-8",
				// 			url: '/preview/' + modelId,
				// 			success: function (data) {
				// 				console.log(data)
				// 			},
				// 			error: function (err) {
				// 				console.error(err);
				// 			}
				// 		});
				// 	}
				// })

			});
		});
}

