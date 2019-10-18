import axios from 'axios';

import * as viewer from './viewer';

window.onload = () => {
    window.MPUCloudViewer = MPUCloudViewer;
};

const MPUCloudViewer = {
    serverURL: 'http://127.0.0.1:4000',
    viewerDiv: document.getElementById('mpu-cloud-viewer'),

    init: function() {
        this.loadExternalStyles();
        axios.get(`${this.serverURL}/viewer/viewer.html`)
            .then(res => this.viewerDiv.innerHTML = res.data);
        viewer.init();
    },

    loadExternalStyle: function(path) {
        const style = document.createElement("link");
        style.rel = 'stylesheet';
        style.type = 'text/css';
        style.href = path;
        style.setAttribute('mpu-cloud', 'viewer');
        document.getElementsByTagName("head")[0].appendChild(style);
    },

    loadExternalStyles: function() {
        const styles = ['styles.css', 'bootstrap.min.css', 'all.min.css', 'annotation-style.css'];
        for (const style of styles) {
            this.loadExternalStyle(`${this.serverURL}/viewer/styles/${style}`);
        }
    },

    unloadExternalStyles: function() {
        const loadedStyles = document.querySelectorAll('[mpu-cloud="viewer"]');
        for (const style of loadedStyles) {
            style.remove();
        }
    }
};