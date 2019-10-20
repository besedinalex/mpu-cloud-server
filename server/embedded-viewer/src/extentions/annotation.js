import xeogl from './../xeogl-dependencies';

export default class AnnotationExtension {
    constructor(input, scene) {
        this.scene = scene;
        this.annotations = [];
        this.annotationMode = false;

        input.on("mouseclicked", (canvasPos) => {
            const hit = this.scene.pick({
                canvasPos: canvasPos,
                pickSurface: true
            });

            if (this.annotationMode && hit) {
                const lookat = this.scene.camera.view;

                this.annotations.push(
                    new xeogl.Annotation({
                        mesh: hit.mesh,
                        primIndex: hit.primIndex,
                        bary: hit.bary,
                        title: document.querySelector('#name').value,
                        desc: document.querySelector('#exampleFormControlTextarea1').value,
                        eye: lookat.eye,
                        look: lookat.look,
                        up: lookat.up,
                        glyph: this.annotations.length + 1,
                    })
                )
            }
        });

        document.querySelector("#annotationMode").addEventListener('click', () => {
            this.annotationMode = !this.annotationMode;
            document.getElementById("annotationMode").style.backgroundColor == 'red' ? '#111' : 'red';
        })
    }
}