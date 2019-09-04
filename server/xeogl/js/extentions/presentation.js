class Presentation {


    constructor() {

        this.rotationMode = false;

        document.querySelector("#rotation").addEventListener("click", () => {
            this.rotationMode = !this.rotationMode
        })

    }

}