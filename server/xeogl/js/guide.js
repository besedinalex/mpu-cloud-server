var frame = document.getElementsByName('viewer')[0];
var target = frame.contentWindow;

function showSection(index) {
    for (let section of document.getElementById('right').children) {
        if (section.id === String(index)) section.style.display = 'block';
        else section.style.display = 'none';
    }
}

function showQuestion(index) {
    for (let question of document.getElementById('questions').children) {
        if (question.id === String(index)) question.style.display = 'block';
        else question.style.display = 'none';
    }
    document.querySelector("#questionInfo").textContent = "Верный ответ. Ответьте на следующий вопрос.";
    document.querySelector("#questionInfo").style.color = "green"
}

function loadSection2() {
    showSection(2);
    target.guide.highlight(['_190', '_210'])
    console.log(target.scene)
}

function loadSection3() {
    showSection(3);
    target.guide.normalColor();
    target.guide.highlight(['_208', '_210'])
    target.cameraFlight.fitFOV = 15;
    target.cameraFlight.flyTo(target.guide.focusMesh("_210"))
}

function loadSection4() {
    showSection(4);
    target.guide.normalColor();
    target.guide.highlight(['_205', '_205', '_190'])
    target.cameraFlight.fitFOV = 35;
    target.cameraFlight.flyTo(target.guide.focusMesh("_190"))
}

function loadSection5() {
    showSection(5);
    target.guide.normalColor();
    target.guide.highlight(['_205', '_177', '_178', '_179', '_180', '_181', '_182', '_183', '_184', '_185', '_186', '_187', '_188', '_189',
        '_192', '_193', '_194', '_195', '_196', '_197', '_198', '_199', '_200', '_201', '_202', '_203', '_204'])
    target.cameraFlight.fitFOV = 15;
    target.cameraFlight.flyTo(target.guide.focusMesh("_177"))
}

function loadSection6() {
    showSection(6);
    target.guide.normalColor();
    target.spacing.factorSpacing = 1.2
    target.spacing.spacing();
    target.cameraFlight.fitFOV = 58;
    target.cameraFlight.flyTo(target.model)
    target.guide.opacityById(["_175", "176"])
}

function checkQuestion1() {
    if (checkResult("_210")) {
        showQuestion("q2")
    } else {
        document.querySelector("#questionInfo").style.color = "red"
        document.querySelector("#questionInfo").innerHTML = "Неверный ответ. Попробуйтие снова.";
    }
}

function checkQuestion2() {
    if (checkResult("_190")) {
        showQuestion("final")
        document.getElementById("questionInfo").style.display = "none";
    }
    else {
        document.querySelector("#questionInfo").textContent = "Неверный ответ. Попробуйтие снова.";
        document.querySelector("#questionInfo").style.color = "red"
    }
}

function checkResult(id) {

    return target.guide.checkHit(id);
}


target.postMessage('a', target);