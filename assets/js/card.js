writeValue = function (ctx, value, pos) {
    var scale = getScalingFactor(getCanvas(), getBackgroundImage());
    pos = { x: pos.x / scale.x, y: pos.y / scale.y };

    ctx.save();
    ctx.scale(scale.x, scale.y);
    ctx.fillText(value, pos.x, pos.y);
    ctx.restore();
}

function printAtWordWrap(context, text, x, y, lineHeight, fitWidth) {

    var lines = text.split('\n');
    lineNum = 0;
    for (var i = 0; i < lines.length; i++) {
        fitWidth = fitWidth || 0;
        if (fitWidth <= 0) {
            context.fillText(lines[i], x, y + (lineNum * lineHeight));
            lineNum++;
        }
        var words = lines[i].split(' ');
        var idx = 1;
        while (words.length > 0 && idx <= words.length) {
            var str = words.slice(0, idx).join(' ');
            var w = context.measureText(str).width;
            if (w > fitWidth) {
                if (idx == 1) {
                    idx = 2;
                }
                context.fillText(words.slice(0, idx - 1).join(' '), x, y + (lineNum * lineHeight));
                lineNum++;
                words = words.splice(idx - 1);
                idx = 1;
            }
            else {
                idx++;
            }
        }
        if (idx > 0) {
            context.fillText(words.join(' '), x, y + (lineNum * lineHeight));
            lineNum++;
        }

    }

}

function drawCardText(value, yStart, maxLinesForNormalFont) {
    let context = getContext();
    context.textAlign = "left";
    context.textBaseline = "middle";
    let maxCharactersForThreeLines = 140;
    let minFontSize = 24;

    let playerType = document.getElementById("playerType").value;
    //let yStart = (playerType === "star") ? 680 : 730;
    let xStart = 265;

    let fontSize = 36;
    let lineHeight = 42;
    let fitWidth = 400; // Reduced fitWidth for accommodating 4 lines at smaller font size

    let textLines = splitWordWrap(context, value, fitWidth);

    if (value.length > maxCharactersForThreeLines) {
        maxLinesForNormalFont = 4; // Allow 4 lines if there are more than 300 characters
    }

    if (textLines.length > maxLinesForNormalFont) {
        let fontReductionStep = 2;
        while (textLines.length > maxLinesForNormalFont) {
            fontSize -= fontReductionStep;
            lineHeight = fontSize * 1.2;
            fitWidth = 400 / (fontSize / 36); // Adjust fit width proportionally to the font size
            textLines = splitWordWrap(context, value, fitWidth);
        }
        fontSize = Math.max(fontSize, minFontSize);
        lineHeight = fontSize * 1.2;
    }

    textLines.forEach((line, index) => {
        let fillStyle = 'black';
        context.font = `${fontSize}px franklin-gothic-book`;
        context.fillStyle = fillStyle;
        context.fillText(line, xStart, yStart + index * lineHeight);
    });
}



function splitWordWrap(context, text, fitWidth) {
    const words = text.split(' ');
    const lines = [];
    let line = '';
    
    for (const word of words) {
        const testLine = line + (line ? ' ' : '') + word;
        const testWidth = context.measureText(testLine).width;
        
        if (testWidth <= fitWidth) {
            line = testLine;
        } else {
            lines.push(line);
            line = word;
        }
    }
    lines.push(line);
    return lines;
}





getScalingFactor = function (canvas, warcryCardOne) {
    return {
        x: canvas.width / warcryCardOne.width,
        y: canvas.height / warcryCardOne.height
    };
}

getCanvas = function () {
    return document.getElementById("canvas");
}

getContext = function () {
    return getCanvas().getContext("2d");
}

getBackgroundImage = function () {
    return document.getElementById('bg1');
}

drawBackground = function () {
    getContext().drawImage(
        getBackgroundImage(), 0, 0, getCanvas().width, getCanvas().height);
}

scalePixelPosition = function (pixelPosition) {
    var scalingFactor = getScalingFactor(getCanvas(), getBackgroundImage());
    var scaledPosition = { x: pixelPosition.x * scalingFactor.x, y: pixelPosition.y * scalingFactor.y };
    return scaledPosition;
}

writeScaled = function (value, pixelPos) {
    var scaledPos = scalePixelPosition(pixelPos);
    writeValue(getContext(), value, scaledPos);
}

drawCardElementFromInput = function (inputElement, pixelPosition) {
    var value = inputElement.value;
    writeScaled(value, pixelPosition);
}

drawCardElementFromInputId = function (inputId, pixelPosition) {
    drawCardElementFromInput(document.getElementById(inputId), pixelPosition);
}

drawCardName = function (value) {
    getContext().fillStyle = 'black';
    getContext().textAlign = "left";
    getContext().textBaseline = "middle";
    getContext().rotate(-6 * Math.PI / 180);

    // Set the initial font size
    var fontSize = 70;

    // Check if the value is 18 characters or more
    if (value.length >= 18) {
        // Calculate the maximum width based on the desired length
        var maxWidth = 650;

        // Calculate the width of the text with the current font size
        getContext().font = 'italic ' + fontSize + 'px brothers-regular';
        var textWidth = getContext().measureText(value).width;

        // Reduce font size if the text width exceeds the maximum width
        while (textWidth > maxWidth && fontSize > 1) {
            fontSize--;
            getContext().font = 'italic ' + fontSize + 'px brothers-regular';
            textWidth = getContext().measureText(value).width;
        }
    }

    // Set the font size and draw the text with black shadow
    getContext().font = 'italic ' + fontSize + 'px brothers-regular';
    writeScaled(value, { x: 48 + 4, y: 180 + 4 });
    
    // Set the font size and draw the text in white
    getContext().fillStyle = 'white';
    writeScaled(value, { x: 48, y: 180 });

    getContext().rotate(6 * Math.PI / 180);
}


drawTeamName = function (value) {
    getContext().font = 'italic 40px brothers-regular';
    getContext().fillStyle = 'black';
    getContext().textAlign = "left";
    getContext().textBaseline = "middle";
    getContext().rotate(-6 * Math.PI / 180);
    writeScaled(value, { x: 60 +4, y: 125+4 });
    getContext().fillStyle = 'white';
    writeScaled(value, { x: 60, y: 125 });
    getContext().rotate(+6 * Math.PI / 180);
}

drawFooter = function (value) {
    getContext().font = '30px brothers-regular';
    getContext().fillStyle = 'white';
    getContext().textAlign = "left";
    getContext().textBaseline = "middle";
    writeScaled(value, { x: 90, y: 990 });
}

drawPositionName = function (value) {
    getContext().font = '50px brothers-regular';
    getContext().fillStyle = 'white';
    getContext().textAlign = "center";
    getContext().textBaseline = "middle";
    writeScaled(value, { x: 480, y: 1010 });
}


drawDevelopment = function (primary, secondary) {

    getContext().font = 'bold 26px franklin-gothic-book';
    getContext().fillStyle = 'black';
    getContext().textAlign = "left";
    getContext().textBaseline = "middle";
    x = 265;
    writeScaled("Primary: ", { x: x, y: 890 });
    writeScaled("Secondary: ", { x: x, y: 930 });
    getContext().font = '30px franklin-gothic-book';
    writeScaled(primary, { x: x+95, y: 890 });
    writeScaled(secondary, { x: x+125, y: 930 });
    
    
}


function getLabel(element) {
    return $(element).prop("labels")[0];
}

function getImage(element) {
    return $(element).find("img")[0];
}

function getSelectedRunemark(radioDiv) {
    var checked = $(radioDiv).find('input:checked');
    if (checked.length > 0) {
        return getImage(getLabel(checked[0])).getAttribute("src");
    }
    return null;
}

function setSelectedRunemark(radioDiv, runemark, radioGroupName, bgColor) {
    // uncheck all
    {
        var checked = $(radioDiv).find('input:checked');
        for (var i = 0; i < checked.length; i++) {
            checked[i].checked = false;
        }
        var icons = $(radioDiv).find('img');
        for (var i = 0; i < icons.length; i++) {
            icons[i].style.backgroundColor = bgColor;
        }
    }

    if (runemark != null) {
        var queryString = "img[src='" + runemark + "']";
        var img = $(radioDiv).find(queryString);
        if (img.length > 0) {
            var radioButton = $(img[0].parentNode.parentNode).find("input")[0];
            radioButton.checked = true;
            // img[0].style.backgroundColor = "tomato";
            img[0].style.backgroundColor = "#00bc8c";
        }
        else {
            var newDiv =
                addToImageRadioSelector(
                    runemark,
                    radioDiv,
                    radioGroupName,
                    bgColor);
            // $(newDiv).find("img")[0].style.backgroundColor = "tomato";
            $(newDiv).find("img")[0].style.backgroundColor = "#00bc8c";
            $(newDiv).find("input")[0].checked = true;
        }
    }
}



function drawImage(scaledPosition, scaledSize, image) {
    if (image != null) {
        if (image.complete) {
            getContext().drawImage(image, scaledPosition.x, scaledPosition.y, scaledSize.x, scaledSize.y);
        }
        else {
            image.onload = function () { drawImage(scaledPosition, scaledSize, image); };
        }
    }
}

function drawImageSrc(scaledPosition, scaledSize, imageSrc) {
    if (imageSrc != null) {
        var image = new Image();
        image.onload = function () { drawImage(scaledPosition, scaledSize, image); };
        image.src = imageSrc;
    }
}


function drawModel(imageUrl, imageProps) {
    if (imageUrl != null) {
        var image = new Image();
        image.onload = function () {
            var position = scalePixelPosition({ x: 590 + imageProps.offsetX, y: imageProps.offsetY });
            var scale = imageProps.scalePercent / 100.0;
            var width = image.width * scale;
            var height = image.height * scale;
            getContext().drawImage(image, position.x, position.y, width, height);

            URL.revokeObjectURL(image.src);
        };
        image.src = imageUrl;
    }
}

function getName() {
    //var textInput = $("#saveNameInput")[0];
    return "BloodBowl_Card";
}

function setName(name) {
    //var textInput = $("#saveNameInput")[0];
    //textInput.value = name;
}

function getModelImage() {
    var imageSelect = $("#imageSelect")[0];

    if (imageSelect.files.length > 0) {
        return URL.createObjectURL(imageSelect.files[0]);
    }

    return null;
}

function setModelImage(image) {
    console.log("setModelImage:" + image);
    $("#fighterImageUrl")[0].value = image;

    //  if (image != null) {
    // TODO: Not sure how to do this. It might not even be possible! Leave it for now...
    //    imageSelect.value = image;
    // }
    // else {
    //    imageSelect.value = null;
    // }
}

function getDefaultModelImageProperties() {
    return {
        offsetX: 0,
        offsetY: 0,
        scalePercent: 100
    };
}

function getModelImageProperties() {
    return {
        offsetX: $("#imageOffsetX")[0].valueAsNumber,
        offsetY: $("#imageOffsetY")[0].valueAsNumber,
        scalePercent: $("#imageScalePercent")[0].valueAsNumber
    };
}

function setModelImageProperties(modelImageProperties) {
    $("#imageOffsetX")[0].value = modelImageProperties.offsetX;
    $("#imageOffsetY")[0].value = modelImageProperties.offsetY;
    $("#imageScalePercent")[0].value = modelImageProperties.scalePercent;
}


function readControls() {
    var data = new Object;
    data.name = getName();
    data.imageUrl = getFighterImageUrl();
    data.imageProperties = getModelImageProperties();
    data.cardName = document.getElementById("cardName").value;
    data.teamName = document.getElementById("teamName").value;
    data.footer = document.getElementById("footer").value;
    data.cardText = document.getElementById("cardText").value;
    data.positionName = document.getElementById("positionName").value;
    data.ma = document.getElementById("ma").value;
    data.st = document.getElementById("st").value;
    data.ag = document.getElementById("ag").value;
    data.pa = document.getElementById("pa").value;
    data.av = document.getElementById("av").value;
    data.p_general = document.getElementById("p_general").checked;
    data.p_agility = document.getElementById("p_agility").checked;
    data.p_strength = document.getElementById("p_strength").checked;
    data.p_passing = document.getElementById("p_passing").checked;
    data.p_mutations = document.getElementById("p_mutations").checked;
    data.s_general = document.getElementById("s_general").checked;
    data.s_agility = document.getElementById("s_agility").checked;
    data.s_strength = document.getElementById("s_strength").checked;
    data.s_passing = document.getElementById("s_passing").checked;
    data.s_mutations = document.getElementById("s_mutations").checked;

    data.playerType = document.getElementById("playerType").value;
    data.playsFor = document.getElementById("playsFor").value;
    data.specialRules = document.getElementById("specialRules").value;


    return data;
}

function drawCardFrame(fighterData){
    playerType = document.getElementById("playerType").value;
    if(playerType == "star"){
        getContext().drawImage(document.getElementById('star_frame'), 0, 0, getCanvas().width, getCanvas().height);
    } else {
        getContext().drawImage(document.getElementById('frame'), 0, 0, getCanvas().width, getCanvas().height);
    }

    if(!document.getElementById("removeBorder").checked){
        getContext().drawImage(document.getElementById('border'), 0, 0, getCanvas().width, getCanvas().height);
    }

    drawCardName(fighterData.cardName);
    drawTeamName(fighterData.teamName);
    drawFooter(fighterData.footer);
    yStart = (playerType === "star") ? 670 : 730;

    drawCardText(fighterData.cardText, yStart, 3);

    if(playerType == "star"){
        playsFor = document.getElementById("playsFor").value;
        drawCardText(playsFor, 840, 1);
        specialRules = document.getElementById("specialRules").value;
        drawCardText(specialRules, 940, 3);
    }

    if(document.getElementById("playerType").value != "star"){
        drawPositionName(fighterData.positionName);

        primary = "";
        if(fighterData.p_agility){
            primary = primary + "Agility";
        }
        if(primary!="" && fighterData.p_general){
            primary = primary + ", ";
        }
        if(fighterData.p_general){
            primary = primary + "General";
        }
        if(primary!="" && fighterData.p_mutations){
            primary = primary + ", ";
        }
        if(fighterData.p_mutations){
            primary = primary + "Mutations";
        }
        if(primary!="" && fighterData.p_passing){
            primary = primary + ", ";
        }
        if(fighterData.p_passing){
            primary = primary + "Passing";
        }
        if(primary!="" && fighterData.p_strength){
            primary = primary + ", ";
        }
        if(fighterData.p_strength){
            primary = primary + "Strength";
        }

        secondary = "";
        if(fighterData.s_agility){
            secondary = secondary + "Agility";
        }
        if(secondary!="" && fighterData.s_general){
            secondary = secondary + ", ";
        }
        if(fighterData.s_general){
            secondary = secondary + "General";
        }
        if(secondary!="" && fighterData.s_mutations){
            secondary = secondary + ", ";
        }
        if(fighterData.s_mutations){
            secondary = secondary + "Mutations";
        }
        if(secondary!="" && fighterData.s_passing){
            secondary = secondary + ", ";
        }
        if(fighterData.s_passing){
            secondary = secondary + "Passing";
        }
        if(secondary!="" && fighterData.s_strength){
            secondary = secondary + ", ";
        }
        if(fighterData.s_strength){
            secondary = secondary + "Strength";
        }
        drawDevelopment(primary, secondary);
    }
    
    // MA
     drawNumber(fighterData.ma, 130, 255, false);
    // ST
    drawNumber(fighterData.st, 130, 395, false);
    // AG
    drawNumber(fighterData.ag, 130, 530, true);
    // PA
    drawNumber(fighterData.pa, 130, 670, true);
    //AV
    drawNumber(fighterData.av, 130, 805, true);

}

render = function (fighterData) {
    console.log("Render:");
    console.log(fighterData);
    // First the textured background
    getContext().drawImage(document.getElementById('bg1'), 0, 0, getCanvas().width, getCanvas().height);

    if (fighterData.imageUrl) {
        var image = new Image();
        image.onload = function () {
        var position = scalePixelPosition({ x: 100 + fighterData.imageProperties.offsetX, y: fighterData.imageProperties.offsetY });
        var scale = fighterData.imageProperties.scalePercent / 100.0;
        var width = image.width * scale;
        var height = image.height * scale;
        getContext().drawImage(image, position.x, position.y, width, height);
        drawCardFrame(fighterData);
        };
    image.src = fighterData.imageUrl;
    }
    // next the frame elements

    drawCardFrame(fighterData);

    
}

function drawNumber(num,x, y, plus){

    if(num<1 || num>11 ) {
        num = '-';
        plus = false;
    }
    if(num>9){
        getContext().drawImage(document.getElementById('sf1'), x-15, y, 35, 70);
        x = x + 35-15;
        num = num -10;
    }
    elementId = 'sf'+num;

    if(num == 1) {
        width = 35;
        x = x+9;
    } else {
        width = 53;
    }

    getContext().drawImage(document.getElementById(elementId), x, y, width, 70);
    if (plus){
        getContext().drawImage(document.getElementById('sf+'), x+width, y, 39, 70);
    }
}

async function writeControls(fighterData) {

    // here we check for base64 loaded image and convert it back to imageUrl
    if (fighterData.base64Image != null) {

        // first convert to blob
        const dataToBlob = async (imageData) => {
            return await (await fetch(imageData)).blob();
        };
        const blob = await dataToBlob(fighterData.base64Image);
        // then create URL object
        fighterData.imageUrl = URL.createObjectURL(blob);
        // Now that's saved, clear out the base64 so we don't reassign
        fighterData.base64Image = null;
    } else {
        fighterData.imageUrl = null;
    }

    setName(fighterData.name);
    setModelImage(fighterData.imageUrl);
    setModelImageProperties(fighterData.imageProperties);
    
    $("#cardName")[0].value = fighterData.cardName;
    $("#teamName")[0].value = fighterData.teamName;
    $("#footer")[0].value = fighterData.footer;
    $("#positionName")[0].value = fighterData.positionName;
    $("#ma")[0].value = fighterData.ma;
    $("#st")[0].value = fighterData.st;
    $("#ag")[0].value = fighterData.ag;
    $("#pa")[0].value = fighterData.pa;
    $("#av")[0].value = fighterData.av;
    $("#cardText")[0].value = fighterData.cardText;

    document.getElementById('p_agility').checked = fighterData.p_agility;
    document.getElementById('p_general').checked = fighterData.p_general;
    document.getElementById('p_mutations').checked = fighterData.p_mutations;
    document.getElementById('p_passing').checked = fighterData.p_passing;
    document.getElementById('p_strength').checked = fighterData.p_strength;

    document.getElementById('s_agility').checked = fighterData.s_agility;
    document.getElementById('s_general').checked = fighterData.s_general;
    document.getElementById('s_mutations').checked = fighterData.s_mutations;
    document.getElementById('s_passing').checked = fighterData.s_passing;
    document.getElementById('s_strength').checked = fighterData.s_strength;

    document.getElementById("playerType").value = fighterData.playerType;
    document.getElementById("playsFor").value = fighterData.playsFor;
    document.getElementById("specialRules").value = fighterData.specialRules;


    // render the updated info
    render(fighterData);
}

function defaultFighterData() {
    var fighterData = new Object;
    fighterData.name = "BloodBowl_Card";
    fighterData.cardName = "Card Name";
    fighterData.teamName = "Team Name";
    fighterData.footer = "100,000";
    fighterData.positionName = " ";
    fighterData.cardText = "Body Text";
    fighterData.imageUrl = null;
    fighterData.imageProperties = getDefaultModelImageProperties();
    
    fighterData.ma = 4;
    fighterData.st = 4;
    fighterData.ag = 3;
    fighterData.pa = 3;
    fighterData.av = 9;
    fighterData.imageUrl = null;
    fighterData.imageProperties = getDefaultModelImageProperties();
    fighterData.p_agility = false;
    fighterData.p_general = false;
    fighterData.p_passing = false;
    fighterData.p_mutations = false;
    fighterData.p_strength = false;
    fighterData.s_agility = false;
    fighterData.s_general = false;
    fighterData.s_passing = false;
    fighterData.s_mutations = false;
    fighterData.s_strength = false;

    return fighterData;
}

function saveFighterDataMap(newMap) {
    window.localStorage.setItem("fighterDataMap", JSON.stringify(newMap));
}

function loadFighterDataMap() {
    var storage = window.localStorage.getItem("fighterDataMap");
    if (storage != null) {
        return JSON.parse(storage);
    }
    // Set up the map.
    var map = new Object;
    map["BloodBowl_Card"] = defaultFighterData();
    saveFighterDataMap(map);
    return map;
}

function loadLatestFighterData() {
    var latestCardName = window.localStorage.getItem("latestCardName");
    if (latestCardName == null) {
        latestCardName = "BloodBowl_Card";
    }

    console.log("Loading '" + latestCardName + "'...");

    var data = loadFighterData(latestCardName);

    if (data) {
        console.log("Loaded data:");
        console.log(data);
    }
    else {
        console.log("Failed to load data, loading defaults.");
        data = defaultFighterData();
    }

    return data;
}

function saveLatestFighterData() {
    var fighterData = readControls();
    if (!fighterData.name) {
        return;
    }

    window.localStorage.setItem("latestCardName", fighterData.name);
    //saveFighterData(fighterData);
}

function loadFighterData(fighterDataName) {
    if (!fighterDataName) {
        return null;
    }

    var map = loadFighterDataMap();
    if (map[fighterDataName]) {
        return map[fighterDataName];
    }

    return null;
}

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var dataURL = canvas.toDataURL("image/png");

    return dataURL;
}

function onload2promise(obj) {
    return new Promise((resolve, reject) => {
        obj.onload = () => resolve(obj);
        obj.onerror = reject;
    });
}

async function getBase64ImgFromUrl(imgUrl) {
    let img = new Image();
    let imgpromise = onload2promise(img); // see comment of T S why you should do it this way.
    img.src = imgUrl;
    await imgpromise;
    var imgData = getBase64Image(img);
    return imgData;
}

async function handleImageUrlFromDisk(imageUrl) {
    if (imageUrl &&
        imageUrl.startsWith("blob:")) {
        // The image was loaded from disk. So we can load it later, we need to stringify it.
        imageUrl = await getBase64ImgFromUrl(imageUrl);
    }

    return imageUrl;
}

async function saveFighterData(fighterData) {
    var finishSaving = function () {
        var map = loadFighterDataMap();
        map[fighterData.name] = fighterData;
        window.localStorage.setItem("fighterDataMap", JSON.stringify(map));
    };

    if (fighterData != null &&
        fighterData.name) {
        // handle images we may have loaded from disk...
        fighterData.imageUrl = await handleImageUrlFromDisk(fighterData.imageUrl);

        finishSaving();
    }
}

function getLatestFighterDataName() {
    return "latestFighterData";
}

window.onload = function () {
    //window.localStorage.clear();
    var fighterData = loadLatestFighterData();
    writeControls(fighterData);
    refreshSaveSlots();
}

onAnyChange = function () {
    var fighterData = readControls();
    render(fighterData);
    saveLatestFighterData();
}



onWeaponRunemarkFileSelect = function (input, weaponName) {
    var grid = $(input.parentNode).find("#weaponRunemarkSelect")[0];

    for (i = 0; i < input.files.length; i++) {
        addToImageRadioSelector(URL.createObjectURL(input.files[i]), grid, weaponName, "white");
    }
}

function addToImageCheckboxSelector(imgSrc, grid, bgColor) {
    var div = document.createElement('div');
    div.setAttribute('class', 'mr-0');
    div.innerHTML = `
    <label for="checkbox-${imgSrc}">
        <img src="${imgSrc}" width="50" height="50" alt="" style="background-color:${bgColor};">
    </label>
    <input type="checkbox" style="display:none;" id="checkbox-${imgSrc}" onchange="onTagRunemarkSelectionChanged(this, '${bgColor}')">
    `;
    grid.appendChild(div);
    return div;
}

function onClearCache() {
    window.localStorage.clear();
    location.reload();
    return false;
}

function onResetToDefault() {
    var fighterData = defaultFighterData();
    writeControls(fighterData);
}

function refreshSaveSlots() {
    // Remove all
    $('select').children('option').remove();

    var fighterDataName = readControls().name;

    var map = loadFighterDataMap();

    for (let [key, value] of Object.entries(map)) {
        var selected = false;
        if (fighterDataName &&
            key == fighterDataName) {
            selected = true;
        }
        var newOption = new Option(key, key, selected, selected);
        $('#saveSlotsSelect').append(newOption);
    }
}

async function onSaveClicked() {
    data = readControls();
    // temp null while I work out image saving
    console.log(data);
    data.base64Image = await handleImageUrlFromDisk(data.imageUrl)

    // need to be explicit due to sub arrays
    var exportObj = JSON.stringify(data, null, 4);

    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportObj);
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "bloodbowl_card_" + data.cardName.replace(/ /g, "_") + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function saveCardAsImage() {
    var element = document.createElement('a');
    data = readControls();
    element.setAttribute('href', document.getElementById('canvas').toDataURL('image/png'));
    element.setAttribute('download', "bloodbowl_card_" + data.cardName + ".png");
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

$(document).ready(function () {
    var c = document.getElementById('canvas');
    var ctx = c.getContext('2d');
    ctx.beginPath();
    ctx.arc(95, 50, 40, 0, 2 * Math.PI);
    // ctx.stroke();
});

async function readJSONFile(file) {
    // Function will return a new Promise which will resolve or reject based on whether the JSON file is read and parsed successfully
    return new Promise((resolve, reject) => {
        // Define a FileReader Object to read the file
        let fileReader = new FileReader();
        // Specify what the FileReader should do on the successful read of a file
        fileReader.onload = event => {
            // If successfully read, resolve the Promise with JSON parsed contents of the file
            resolve(JSON.parse(event.target.result))
        };
        // If the file is not successfully read, reject with the error
        fileReader.onerror = error => reject(error);
        // Read from the file, which will kick-off the onload or onerror events defined above based on the outcome
        fileReader.readAsText(file);
    });
}

async function fileChange(file) {
    // Function to be triggered when file input changes
    // As readJSONFile is a promise, it must resolve before the contents can be read
    // in this case logged to the console

    var saveJson = function (json) {
        writeControls(json);
    };

    readJSONFile(file).then(json =>
        saveJson(json)
    );

}

onFighterImageUpload = function () {
    image = getModelImage();
    setModelImage(image);
    var fighterData = readControls();
    render(fighterData);
    saveLatestFighterData();
}

function getFighterImageUrl() {
    var imageSelect = $("#fighterImageUrl")[0].value;
    // if (imageSelect.files.length > 0) {
    //return URL.createObjectURL(imageSelect.files[0]);
    // }
    return imageSelect;
}