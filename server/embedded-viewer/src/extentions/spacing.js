export default class SpacingExtension {
    constructor(model) {
        this.model = model;
        this.isConnected = true;
        this.difs = [];
        this.spacingRate = document.querySelector("#spacingRate");
        this.spacingRate.min = 0;
        this.spacingRate.max = 1.2;
        this.spacingRate.value = 0;
        this.factorSpacing = 0;

        document.querySelector('#spacing').addEventListener('click', e => {
            if (this.isConnected) {
                this.spacing();
            } else {
                this.connecting();
            }
        });

        this.spacingRate.oninput = () => this.changeSpacingRate();
    }

    spacing() {
        for (let el of this.model._childList) {
            let difX = el.position[0] - this.model.center[0];
            let difY = el.position[1] - this.model.center[1];
            let difZ = el.position[2] - this.model.center[2];

            this.difs.push({ x: difX, y: difY, z: difZ });

            el.position = [
                el.position[0] + difX * this.factorSpacing,
                el.position[1] + difY * this.factorSpacing,
                el.position[2] + difZ * this.factorSpacing
            ]
        }
        this.isConnected = false;
    }

    connecting() {
        for (let i in this.model._childList) {
            this.model._childList[i].position = [
                this.model._childList[i].position[0] - this.difs[i].x * this.factorSpacing,
                this.model._childList[i].position[1] - this.difs[i].y * this.factorSpacing,
                this.model._childList[i].position[2] - this.difs[i].z * this.factorSpacing
            ]
        }
        this.difs = [];
        this.isConnected = true;
    }

    changeSpacingRate() {
        this.connecting();
        this.factorSpacing = this.spacingRate.value;
        this.spacing();
    }
}