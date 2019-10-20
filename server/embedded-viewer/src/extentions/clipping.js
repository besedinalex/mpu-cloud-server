import xeogl from './../xeogl-dependencies';

export default class ClippingExtension {
    constructor(model) {
        this.clippingMode = false;

        this.rangeX = document.querySelector("#clipX");
        this.rangeX.min = model.aabb[0];
        this.rangeX.max = model.aabb[3];
        this.rangeX.value = this.rangeX.min;

        this.rangeY = document.querySelector("#clipY");
        this.rangeY.min = model.aabb[1];
        this.rangeY.max = model.aabb[4];
        this.rangeY.value = this.rangeY.min;

        this.rangeZ = document.querySelector("#clipZ");
        this.rangeZ.min = model.aabb[2];
        this.rangeZ.max = model.aabb[5];
        this.rangeZ.value = this.rangeZ.min;

        this.lastX = this.rangeX.min;
        this.lastY = this.rangeY.min;
        this.lastZ = this.rangeZ.min;

        this.helperX;
        this.helperY;
        this.helperZ;

        this.sizeX = this.rangeX.max - this.rangeX.min;
        this.sizeY = this.rangeY.max - this.rangeY.min;
        this.sizeZ = this.rangeZ.max - this.rangeZ.min;

        this.clipX = new xeogl.Clip({
            id: "clipX",
            pos: [this.rangeX.min, model.center[1], model.center[2]],
            dir: [1, 0, 0],
            active: true
        });
        this.clipY = new xeogl.Clip({
            id: "clipY",
            pos: [model.center[0], this.rangeY.min, model.center[2]],
            dir: [0, 1, 0],
            active: true
        });
        this.clipZ = new xeogl.Clip({
            id: "clipZ",
            pos: [model.center[0], model.center[1], this.rangeZ.min],
            dir: [0, 0, 1],
            active: true
        });

        this.helperX = new xeogl.ClipHelper({
            clip: this.clipX,
            planeSize: [this.sizeZ, this.sizeY],
            autoPlaneSize: false,
            visible: false,
            solid: true
        });
        this.helperY = new xeogl.ClipHelper({
            clip: this.clipY,
            planeSize: [this.sizeX, this.sizeZ],
            autoPlaneSize: false,
            visible: false,
            solid: true
        });
        this.helperZ = new xeogl.ClipHelper({
            clip: this.clipZ,
            planeSize: [this.sizeX, this.sizeY],
            autoPlaneSize: false,
            visible: false,
            solid: true
        });

        model.clippable = false;

        document.querySelector("#clipping").addEventListener("click", () => {
            // document.querySelector("#clipping").textContent = this.clippingMode ? "Сечение" : "Обычный режим";

            model.clippable = !model.clippable;

            this.helperX.visible = !this.helperX.visible;
            this.helperY.visible = !this.helperY.visible;
            this.helperZ.visible = !this.helperZ.visible;

            this.clippingMode = !this.clippingMode;
        });

        document.querySelector("#clipX").oninput = () => this.activateClippingX();
        document.querySelector("#clipY").oninput = () => this.activateClippingY();
        document.querySelector("#clipZ").oninput = () => this.activateClippingZ();

        document.querySelector("#clipX").onchange = () => this.createFace();

        document.querySelector("#clipXCheck").onclick = () => this.reverseX();
        document.querySelector("#clipYCheck").onclick = () => this.reverseY();
        document.querySelector("#clipZCheck").onclick = () => this.reverseZ();
    }

    activateClippingX() {
        this.helperX.visible = false;

        if (this.clippingMode) {
            let difX = this.rangeX.value - this.lastX;

            this.clipX.pos[0] += difX;

            this.lastX = this.rangeX.value;

            this.helperX = new xeogl.ClipHelper({
                clip: this.clipX,
                planeSize: [this.sizeZ, this.sizeY],
                autoPlaneSize: false,
                visible: true,
                solid: true
            });
        }
    }

    activateClippingY() {
        this.helperY.visible = false;

        if (this.clippingMode) {
            let difY = this.rangeY.value - this.lastY;

            this.clipY.pos[1] += difY;

            this.lastY = this.rangeY.value;

            this.helperY = new xeogl.ClipHelper({
                clip: this.clipY,
                planeSize: [this.sizeX, this.sizeZ],
                autoPlaneSize: false,
                visible: true,
                solid: true
            });
        }
    }

    activateClippingZ() {
        this.helperZ.visible = false;

        if (this.clippingMode) {
            let difZ = this.rangeZ.value - this.lastZ;

            this.clipZ.pos[2] += difZ;

            this.lastZ = this.rangeZ.value;

            this.helperZ = new xeogl.ClipHelper({
                clip: this.clipZ,
                planeSize: [this.sizeX, this.sizeY],
                autoPlaneSize: false,
                visible: true,
                solid: true
            });
        }
    }

    reverseX() {
        this.clipX.dir = [this.clipX.dir[0] == 1 ? -1 : 1, 0, 0];
    }

    reverseY() {
        this.clipY.dir = [0, this.clipY.dir[1] == 1 ? -1 : 1, 0];
    }

    reverseZ() {
        this.clipZ.dir = [0, 0, this.clipZ.dir[2] == 1 ? -1 : 1];
    }

    createFace() {
        if (this.clippingMode) {
            for (let mesh of model._childList) {
                if (this.clipX.pos[0] >= mesh.aabb[0] && this.clipX.pos[0] <= mesh.aabb[3]) {
                    // mesh.highlighted = true;
                    for (let i in mesh.geometry.positions) { }
                } else {
                    // mesh.highlighted = false;
                }
            }
        }
    }
}