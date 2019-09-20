var exporter = require('./GLTFExporter.js'),
    triangulator = require("./" + process.arch + '/Release/' + '/c2g'),
    THREE = require('three');

module.exports = function convert(input, cb) {
    triangulator.import(input, function (res, err) {
        if (err) {
            cb(undefined, err);
        }
        else {
            let scene = new THREE.Scene();

            for (var i = 0; i < res.meshes.length; i++) {
                let positions = new Float32Array([...res.meshes[i].positions]);
                let normals = new Float32Array([...res.meshes[i].normals]);
                let indices = new Uint16Array([...res.meshes[i].indices]);

                let bufGeom = new THREE.BufferGeometry();
                bufGeom.addAttribute('position', new THREE.BufferAttribute(positions, 3));
                bufGeom.addAttribute('normal', new THREE.BufferAttribute(normals, 3));
                bufGeom.setIndex(new THREE.BufferAttribute(indices, 1));

                let material = new THREE.MeshBasicMaterial({ color: res.meshes[i].color });
                let mesh = new THREE.Mesh(bufGeom, material);

                let trans = new THREE.Matrix4();
                trans.set(...res.meshes[i].transformMatrix);
                mesh.applyMatrix(trans);

                scene.add(mesh);
            }

            exporter.parse(scene, function (gltf) {
            
                res = {};
                cb(gltf, undefined);
            });
        }

        return undefined;
    });
}

