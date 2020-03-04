import axios from 'axios';
import xeogl from './../xeogl-dependencies';
import {serverURL} from './../server-url';

export default class AnnotationExtension {
    constructor(input, scene, modelToken, viewerToken, groupId) {
        this.scene = scene;
        this.annotations = [];
        this.annotationMode = false;

        axios.get(`${serverURL}/model-annotation/all/${modelToken}?token=${viewerToken}&groupId=${groupId}`)
            .then(data => {
                const serverAnnotations = data.data;
                for (let annotation of serverAnnotations) {
                    annotation = JSON.parse(annotation.data);
                    annotation.mesh = this.scene.meshes[annotation.mesh];
                    this.annotations.push(new xeogl.Annotation(annotation));
                }
            });

        input.on("mouseclicked", (canvasPos) => {
            const hit = this.scene.pick({
                canvasPos: canvasPos,
                pickSurface: true
            });

            if (this.annotationMode && hit) {
                const lookat = this.scene.camera.view;
                const meshId = hit.mesh.id;
                const annotationData = {
                    mesh: hit.mesh,
                    primIndex: hit.primIndex,
                    bary: hit.bary,
                    title: document.querySelector('#name').value,
                    desc: document.querySelector('#exampleFormControlTextarea1').value,
                    eye: lookat.eye,
                    look: lookat.look,
                    up: lookat.up,
                    glyph: this.annotations.length + 1
                };

                this.annotations.push(new xeogl.Annotation(annotationData));

                annotationData.mesh = meshId;
                const formData = new FormData();
                formData.append('annotation-data', JSON.stringify(annotationData));
                axios({
                    method: 'post',
                    url: `${serverURL}/model-annotation/new/${modelToken}?token=${viewerToken}&groupId=${groupId}`,
                    data: formData,
                    config: {headers: {'Content-Type': 'multipart/form-data'}}
                });
            }

        });

        document.querySelector("#annotationMode").addEventListener('click', () => {
            this.annotationMode = !this.annotationMode;
            document.getElementById("annotationMode").style.backgroundColor == 'red' ? '#111' : 'red';
        });

    }
}
