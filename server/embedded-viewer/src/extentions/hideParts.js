
class HideParts {
    constructor(cameraControl) {
        this.hiddenParts = [];

        cameraControl.on("picked", (hit) => {
            if (hit && input.keyDown[input.KEY_H]) {
                this.hiddenParts.push(hit.mesh);
                hit.mesh.visible = false;
            }

            if (hit && input.keyDown[input.KEY_I]) {
                this.hideOther(hit.mesh)
            }

        });

        document.querySelector("#showAll").addEventListener("click", () => {
            for (let part of this.hiddenParts) {
                part.visible = true;
            }
            this.hiddenParts = [];

            this.homeCamera();
        })


    }



    homeCamera() {
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
        camera.gimbalLock = false;
    }

    hideOther(hitMesh) {
        for (let mesh of model._childList) {
            if (hitMesh != mesh) {
                this.hiddenParts.push(mesh);
                mesh.visible = false;
            }
        }
        var cameraFlight = new xeogl.CameraFlightAnimation();
        cameraFlight.flyTo(hitMesh);
    }




}