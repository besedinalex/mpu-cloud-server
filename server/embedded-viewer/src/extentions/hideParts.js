import xeogl from './../xeogl-dependencies';

export default class HidePartsExtension {
    constructor(cameraControl, camera, model) {
        this.camera = camera;
        this.model = model;
        this.hiddenParts = [];

        cameraControl.on("picked", (hit) => {
            if (hit && input.keyDown[input.KEY_H]) {
                this.hiddenParts.push(hit.mesh);
                hit.mesh.visible = false;
            }
            if (hit && input.keyDown[input.KEY_I]) {
                this.hideOther(hit.mesh)
            }
        })

        document.querySelector("#showAll").addEventListener("click", () => {
            for (let part of this.hiddenParts) {
                part.visible = true;
            }
            this.hiddenParts = [];
            this.homeCamera();
        })
    }

    homeCamera() {
        const aabbSizes = {
            width: Math.abs(this.model.aabb[3]) + Math.abs(this.model.aabb[0]),
            height: Math.abs(this.model.aabb[4]) + Math.abs(this.model.aabb[1]),
            center: [
                (this.model.aabb[3] + this.model.aabb[0]) / 2,
                (this.model.aabb[4] + this.model.aabb[1]) / 2,
                (this.model.aabb[5] + this.model.aabb[2]) / 2
            ]
        };

        const objectSize = Math.max(aabbSizes.width, aabbSizes.height);
        const d = objectSize / (2 * Math.tan(this.camera.perspective.fov * (Math.PI / 360)));

        this.camera.eye = [d, d, d];
        this.camera.look = aabbSizes.center;
        this.camera.up = [0, 1, 0];
        this.camera.gimbalLock = false;
    }

    hideOther(hitMesh) {
        for (let mesh of this.model._childList) {
            if (hitMesh != mesh) {
                this.hiddenParts.push(mesh);
                mesh.visible = false;
            }
        }
        const cameraFlight = new xeogl.CameraFlightAnimation();
        cameraFlight.flyTo(hitMesh);
    }
}