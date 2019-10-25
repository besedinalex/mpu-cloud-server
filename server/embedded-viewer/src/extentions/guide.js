class GuideEx {

    constructor(model, input) {
        this.model = model;
        this.hitId;
        input.on("mouseclicked", (canvasPos) => {

            var hit = scene.pick({
                canvasPos: canvasPos,
                pickSurface: true
            });

            if (hit) {
                console.log(hit.mesh.id);
                this.hitId = hit.mesh.id;
            }
        });


    }


    highlight(models) {
        models = models.map((el) => {
            for (let mesh of model._childList) {
                if (el == mesh.id) {
                    return mesh;
                }
            }
        })

        for (let mesh of model._childList) {
            for (let model of models) {
                if (mesh == model) {
                    mesh.selectedMaterial.fillColor = [1.0, 1.0, 1.0]
                    mesh.selectedMaterial.edgeColor = [0, 0, 0];
                    mesh.selectedMaterial.edgeWidth = 1;
                    mesh.selectedMaterial.fillAlpha = 0.7
                    mesh.selectedMaterial.edges = true;
                    mesh.selected = true;
                    mesh.ghosted = false;
                } else {
                    mesh.ghostMaterial.vertices = false;
                    mesh.ghostMaterial.fill = true;
                    mesh.ghostMaterial.fillColor = [0.01, 0.07, 0.26];
                    mesh.ghostMaterial.fillAlpha = 0.8;

                    mesh.ghosted = true;
                }
            }
        }
    }

    opacityById(meshIds) {
        for (let mesh of model._childList) {
            for (let id of meshIds) {
                if (mesh.id == id) {
                    mesh.opacity = 0.5;
                } 
            }
        }
    }

    normalColor() {

        for (let mesh of model._childList) {
            mesh.ghosted = false;
            mesh.selected = false;
            mesh.highlight = false;
        }
    }

    checkHit(correctId) {
        return this.hitId === correctId;
    }

    focusMesh(id) {
        for (let mesh of model._childList) {
            if (mesh.id == id) {
                return mesh;
            }
        }
    }



}