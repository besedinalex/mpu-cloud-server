
class HighlightEx {

    constructor(cameraControl) {

        cameraControl.on("hoverEnter", (hit) => {
            hit.mesh.highlightMaterial.fillAlpha = 0.6;
            hit.mesh.highlightMaterial.edgeAlpha = 0;
            hit.mesh.highlightMaterial.color = [0.0, 0.0, 1.0]
            hit.mesh.highlightMaterial.edgeColor = [0, 0, 0];
            hit.mesh.highlightMaterial.edgeWidth = 2;
            hit.mesh.highlighted = true;
        });
        cameraControl.on("hoverOut", (hit) => {
            hit.mesh.highlighted = false;
        });

        cameraControl.on("picked", (hit) => {
            if (hit && input.keyDown[input.KEY_SHIFT]) {
                hit.mesh.selected = !hit.mesh.selected;
            }
        });

    }

}