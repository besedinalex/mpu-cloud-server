import axios from 'axios';

import * as viewer from './viewer';

const serverURL = 'http://127.0.0.1:4000';

const viewerDiv = document.getElementById('mpu-cloud-viewer');

function loadExternalStyle(path) {
    const style = document.createElement("link");
    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.href = path;
    style.setAttribute('mpu-cloud-viewer', 'dependency');
    document.getElementsByTagName("head")[0].appendChild(style);
}

function loadExternalStyles() {
    const styles = ['styles.css', 'bootstrap.min.css', 'all.min.css', 'annotation-style.css'];
    for (const style of styles) {
        loadExternalStyle(`${serverURL}/embedded-viewer/styles/${style}`);
    }
}

function unloadExternalStyles() {
    const loadedStyles = document.querySelectorAll('[mpu-cloud-viewer="dependency"]');
    for (const style of loadedStyles) {
        style.remove();
    }
}

window.onload = () => {
    loadExternalStyles();
    axios.get(`${serverURL}/embedded-viewer/viewer.html`)
        .then(res => viewerDiv.innerHTML = res.data);
    viewer.init();
};