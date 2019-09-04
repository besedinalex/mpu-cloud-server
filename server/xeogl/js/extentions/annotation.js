class AnnotationEx {

    constructor(input) {

        this.annotations = [];
        this.annotationMode = false;

        input.on("mouseclicked", (canvasPos) => {



            var hit = scene.pick({
                canvasPos: canvasPos,
                pickSurface: true
            });

            if (this.annotationMode && hit) {

               
                var lookat = scene.camera.view;

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
            // document.querySelector("#annotationMode").textContent =
            // this.annotationMode ? "Режим добавления" : "Обычный режим";
            this.annotationMode = !this.annotationMode;
            document.getElementById("annotationMode").style.backgroundColor == "red" ? "#111" : "red";
            console.log(document.getElementById("annotationMode").style.backgroundColor)
        })


    }




}