'use strict';

import axios from 'axios';

import * as viewer from './viewer';

const serverURL = 'http://127.0.0.1:4000';
let viewerDiv = null;

export function init(params, viewerDiv) {
    viewerDiv = document.getElementById('mpu-cloud-viewer');
    if (viewerDiv === null || viewerDiv === undefined) {
        alert('Не обнаружено место для размещения элемента viewer.');
        return;
    }
    axios.get(`${serverURL}/viewer/viewer.html`)
        .then(res => viewerDiv.innerHTML = res.data);
    loadExternalStyles();
    viewer.init(params.viewerToken, params.modelToken, params.groupId);
}

export function destruct() {
    const loadedStyles = document.querySelectorAll('[mpu-cloud="viewer"]');
    for (const style of loadedStyles) {
        style.remove();
    }
    viewerDiv.innerHTML = null;
}

function loadExternalStyle(path) {
    const style = document.createElement("link");
    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.href = path;
    style.setAttribute('mpu-cloud', 'viewer');
    document.getElementsByTagName("head")[0].appendChild(style);
}

function loadExternalStyles() {
    const styles = ['styles.css', 'bootstrap.min.css', 'all.min.css', 'annotation-style.css'];
    for (const style of styles) {
        loadExternalStyle(`${serverURL}/viewer/styles/${style}`);
    }
}

export function spoilers(curSpoiler, curBtn) {
    viewer.spoilers(curSpoiler, curBtn);
}