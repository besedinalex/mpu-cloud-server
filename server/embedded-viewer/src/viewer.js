import axios from 'axios';
import $ from 'jquery';
import xeogl from './xeogl-dependencies';
import AnnotationExtension from "./extentions/annotation";
import HighlightExtension from "./extentions/highlight";
import HidePartsExtension from "./extentions/hideParts";
import SpacingExtension from "./extentions/spacing";
import ClippingExtension from './extentions/clipping';
import PresentationExtension from "./extentions/presentation";
import OpacityExtension from "./extentions/opacity";
import VisionExtension from "./extentions/vision";
import {serverURL} from './server-url';

//Global vars
let model, scene, camera, input, cameraControl, gltf;

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

export function init(viewerToken, modelToken, groupId) {
	axios.get(`${serverURL}/file/view/${modelToken}?token=${viewerToken}&groupId=${groupId}&format=gltf`)
		.then(res => {
			gltf = res.data.model;

			// scene = new xeogl.Scene({canvas: 'test'});

			model = new xeogl.GLTFModel({
				id: model,
				src: gltf,
				pickable: true
			});

			scene = model.scene;

			// const viewerCanvas = document.getElementById('test');
			// const parentDiv = viewerCanvas.parentElement;
			// viewerCanvas.width = parentDiv.clientWidth;
			// viewerCanvas.height = parentDiv.clientHeight;
			// const x = scene.canvas.canvas.id;
			// div = document.getElementById(x).parentElement;
			// const y = document.getElementById('mpu-cloud-viewer');
			// y.appendChild(div);
			// div.width = y.clientWidth;
			// div.height = y.clientHeight;

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

				const annotation = new AnnotationExtension(input, scene, modelToken, viewerToken, groupId);
				const highlight = new HighlightExtension(cameraControl, input);
				const hideParts = new HidePartsExtension(cameraControl, camera, model, input);
				const spacing = new SpacingExtension(model);
				const clipping = new ClippingExtension(model);
				const presentation = new PresentationExtension();
				const opacity = new OpacityExtension(cameraControl, input);
				const vision = new VisionExtension(cameraControl, camera, model, input);

				let timer = 0;

				document.getElementById('spin').style.display = 'none';
				scene.on('rendering', (id, pass) => {
					timer++;
					if (timer === 10) {
						function dataURItoBlob(dataURI) {
							var binary = atob(dataURI.split(',')[1]);
							var array = [];
							for(var i = 0; i < binary.length; i++) {
								array.push(binary.charCodeAt(i));
							}
							return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
						}
						const dataURL = scene.canvas.canvas.toDataURL('image/jpeg', 0.5);
						const blob = dataURItoBlob(dataURL);
						const fd = new FormData();
						fd.append("canvasImage", blob);
						$.ajax({
							type: 'POST',
							data: fd,
							processData: false,
							cache: false,
							contentType: false,
							url: `${serverURL}/file/preview/${modelToken}?token=${viewerToken}&groupId=${groupId}`,
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
		});
}

export function destruct() {
	model.clear();
	model.destroy();
	// div.remove();
}
