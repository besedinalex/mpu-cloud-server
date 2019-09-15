import React, { Component } from 'react';
import axios from 'axios';


class ModelView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gltf: undefined
        }
    }
    
    componentDidMount() {
        axios.get(`http://127.0.0.1:4000/models/${this.props.match.params.id}?token=${this.props.token}`).then(res => {
            //this.setState({ gltf: JSON.parse(atob(res.data.model)) })
            console.log(res.data.model);

            let script = document.createElement("script");
            script.src = "http://127.0.0.1:4000/xeogl.js";
            script.async = false;
            document.body.appendChild(script);

            script = document.createElement("script");
            script.async = false;
            script.src = "http://127.0.0.1:4000/glTFModel.js";
            document.body.appendChild(script);

            script = document.createElement("script");
            script.async = false;
            script.text = `var model, scene, camera, input, cameraControl, cameraFlight, gltf;
    
            model = new xeogl.GLTFModel({
                id: model,
                src: JSON.parse(atob('${res.data.model}')),
                pickable: true
            })

            model.on("loaded", () => {
                model.edges = true;
                model.outline = true;
                model.backfaces = true;
                model.solid = true,    
                new xeogl.AmbientLight({
                    color: [122.0 / 256.0, 164.0 / 256.0, 255.0 / 256.0],
                    intensity: 0.8
                });

                cameraControl = new xeogl.CameraControl();

                scene = model.scene;

                camera = scene.camera;

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
                input = scene.input;
            });`
            document.body.appendChild(script);

           
            })





    }

    render() {
        return (
            <div>
                <script src="https://cdn.jsdelivr.net/npm/@wikifactory/xeogl@0.7.2/build/xeogl.min.js"></script>
                XeoGL
            </div>
        );
    }
}

export default ModelView;