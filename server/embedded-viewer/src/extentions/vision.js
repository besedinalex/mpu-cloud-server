export default class VisionExtension {
    constructor(cameraControl, camera, model, input) {
        this.hiddenParts = [];
        this.isConected = true;;

        cameraControl.on("picked", (hit) => {
            if (hit && this.isConnected) {
                this.hiddenParts.push(hit.mesh);
                hit.mesh.visible = false;
            }
        });

        document.querySelector('#vision').addEventListener('click', () => {
            this.hideOther();
        });


        document.querySelector("#showAll").addEventListener("click", () => {
            for (let part of this.hiddenParts) {
                part.visible = true;
                part.opacity = 1;
            }
            this.hiddenParts = [];
            this.disableFunc();
            // this.homeCamera();
        })


    }



    homeCamera() {
        document.getElementById('msg_pop').style.display = "none";
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

        this.disableFunc();

        camera.eye = [d, d, d];
        camera.look = aabbSizes.center;
        camera.up = [0, 1, 0];
        camera.gimbalLock = false;
    }

    hideOther() {
        this.isConnected = true;
        document.getElementById('msg_pop').style.display = "block";
        document.querySelector('#vision').addEventListener('click', () => 
            this.disableFunc());

    }

    disableFunc(){
        this.isConnected = false;
        document.getElementById('msg_pop').style.display = "none";
        document.querySelector('#vision').addEventListener('click', () => {
            this.hideOther();
        });
    }


}