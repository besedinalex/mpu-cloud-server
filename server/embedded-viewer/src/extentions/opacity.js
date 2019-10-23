export default class OpacityExtension {
    constructor(cameraControl, input) {
        cameraControl.on("picked", (hit) => {
            if (hit && input.keyDown[input.KEY_O]) {
                hit.mesh.opacity = hit.mesh.opacity === 0.5 ? 1 : 0.5;
                hit.mesh.edges = !hit.mesh.edges;
            }
        });
    }
}