const writeValue = function(ctx, value, position) {
    if (!ctx || typeof ctx.fillText !== 'function') {
      throw new Error('Invalid canvas context');
    }
  
    const canvas = getCanvas();
    const backgroundImage = getBackgroundImage();
    const scale = getScalingFactor(canvas, backgroundImage);
    const scaledPosition = {
      x: position.x / scale.x,
      y: position.y / scale.y
    };
  
    ctx.scale(scale.x, scale.y);
    ctx.fillText(value, scaledPosition.x, scaledPosition.y);
  };

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

function getBackgroundImage() {
    const backgroundMap = {
        'bg-07': 'bg-ghur-401',
    };

    const selectedOption = document.getElementById('background-list').value;
    const backgroundImageId = backgroundMap[selectedOption];

    return document.getElementById(backgroundImageId);
}



drawBorder = function () {
    if(!document.getElementById("removeBorder").checked){
        getContext().drawImage(document.getElementById('card-border'), 0, 0, getCanvas().width, getCanvas().height);
    }
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

drawplayName = function (value) {
    startX = 1122 / 2;
    startY = 730;
    var maxWidth = 390; // Set the desired width for the text

    getContext().textAlign = "center";
    getContext().textBaseline = "middle";

    // Scale font size based on text width
    var fontSize = 50; // Initial font size
    getContext().font = fontSize + 'px brothers-regular';

    // Measure text width
    var textWidth = getContext().measureText(value).width;

    // Adjust font size if text width exceeds maxWidth
    if (textWidth > maxWidth) {
        fontSize = (fontSize * maxWidth) / textWidth;
    }

    // Set the font size and draw the text
    getContext().font = fontSize + 'px brothers-regular';
    getContext().fillStyle = 'white';
    writeScaled(value, { x: startX, y: startY });
}




function getLabel(element) {
    return $(element).prop("labels")[0];
}

function getImage(element) {
    return $(element).find("img")[0];
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
            var position = scalePixelPosition({ x: imageProps.offsetX, y: imageProps.offsetY });
            var scale = imageProps.scalePercent / 100.0;
            var width = image.width * scale;
            var height = image.height * scale;
            getContext().drawImage(image, position.x, position.y, width, height);
            //URL.revokeObjectURL(image.src);
        };
        image.src = imageUrl;
    }
}

function getName() {
    //var textInput = $("#saveNameInput")[0];
    return "Bloodbowl_Play_Card";
}

function setName(name) {
    //var textInput = $("#saveNameInput")[0];
    //textInput.value = name;
}


function setModelImage(image) {
    $("#missionImageUrl")[0].value = image;
}

function getModelImage() {
    var imageSelect = $("#imageSelect")[0];

    if (imageSelect.files.length > 0) {
        return URL.createObjectURL(imageSelect.files[0]);
    }
    return null;
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




function getFighterImageUrl() {
    var imageSelect = $("#missionImageUrl")[0].value;
    // if (imageSelect.files.length > 0) {
    //return URL.createObjectURL(imageSelect.files[0]);
    // }
    return imageSelect;
}

function getDefaultModelImageProperties() {
    return {
        offsetX: 0,
        offsetY: 0,
        scalePercent: 100
    };
}



function readControls() {
    var data = new Object;
    data.name = getName();
    data.imageUrl = getFighterImageUrl();
    data.imageProperties = getModelImageProperties();
    data.customBackgroundUrl = getCustomBackgroundUrl();
    data.customBackgroundProperties = getCustomBackgroundProperties();
    data.playName = document.getElementById("playName").value;
    data.teamName = document.getElementById("teamName").value;
    data.bgselected = document.getElementById('background-list').value;

    for (var i = 1; i <= 11; i++) {
        data['objective' + i + 'XValue'] = document.getElementById('objective' + i + 'X').value;
        data['objective' + i + 'YValue'] = document.getElementById('objective' + i + 'Y').value;
        data['objective' + i + 'Icon'] = document.getElementById('objective' + i + 'Icon').value;
    }

    data.removeBorder = document.getElementById("removeBorder").checked;
    data.textValue = document.getElementById("textValue").value;
    data.colorPicker = document.getElementById("colorPicker").value;
    data.colorPickerText = document.getElementById("colorPickerText").value;
    
    return data;
}


const render = function(missionData) {
    
    if (missionData.customBackgroundUrl) {
      renderCustomBackground(missionData);
    } else {
      renderDefaultBackground(missionData);
    }


  
}
  
const renderCustomBackground = function(missionData) {
    const backgroundImage = new Image();
    backgroundImage.onload = function() {
        const position = scalePixelPosition({
            x: missionData.customBackgroundProperties.offsetX,
            y: missionData.customBackgroundProperties.offsetY
        });
        const scale = missionData.customBackgroundProperties.scalePercent;
        const width = backgroundImage.width * scale / 100;
        const height = backgroundImage.height * scale / 100;
        getContext().drawImage(backgroundImage, position.x, position.y, width, height);
        renderFighterImage(missionData);
        drawDeployment();
        drawText();

    };
    backgroundImage.src = missionData.customBackgroundUrl;
};
  
const renderDefaultBackground = function(missionData) {
    getContext().drawImage(getBackgroundImage(), 0, 0, getCanvas().width, getCanvas().height);
    drawBorder();
    drawDeployment();
    renderFighterImage(missionData);
    
    drawText();
};
  

const renderFighterImage = function(missionData) {
    if (missionData.imageUrl) {
        const image = new Image();
        image.onload = function() {
            const position = scalePixelPosition({
                x: 100+ missionData.imageProperties.offsetX,
                y: 100 + missionData.imageProperties.offsetY
            });
            const scale = missionData.imageProperties.scalePercent / 100.0;
            const width = image.width * scale;
            const height = image.height * scale;
            getContext().drawImage(image, position.x, position.y, width, height);
            drawOverlayTexts(missionData);
            drawBorder();
            drawDeployment();

        };
        image.src = missionData.imageUrl;
    } else {
        // Drawn if no image, or when file is loaded but no image included
        if(true){
            //drawFrame();
            drawOverlayTexts(missionData);
        }
        drawBorder();
    }
};



async function writeControls(data) {
    //setName("Bloodbowl_Play_Card"); // Always default, trying to move away from this

    // here we check for base64 loaded image and convert it back to imageUrl
    if (data.base64Image) {
        // first convert to blob
        const dataToBlob = async (imageData) => {
            return await (await fetch(imageData)).blob();
        };
        const blob = await dataToBlob(data.base64Image);
        // then create URL object
        data.imageUrl = URL.createObjectURL(blob);
        // Now that's saved, clear out the base64 so we don't reassign
        data.base64Image = null;
    }

    if (data.base64CustomBackground) {
        // first convert to blob
        const dataToBlob = async (imageData) => {
            return await (await fetch(imageData)).blob();
        };
        const blob = await dataToBlob(data.base64CustomBackground);
        // then create URL object
        data.customBackgroundUrl = URL.createObjectURL(blob);
        // Now that's saved, clear out the base64 so we don't reassign
        data.base64CustomBackground = null;
    }

    setModelImage(data.imageUrl);
    setModelImageProperties(data.imageProperties);
    setCustomBackground(data.customBackgroundUrl);
    setCustomBackgroundProperties(data.customBackgroundProperties);
    $("#playName")[0].value = data.playName;
    $("#teamName")[0].value = data.teamName;

    // check and uncheck if needed

    document.getElementById('background-list').value = data.bgselected;

    
    for (var i = 1; i <= 11; i++) {
        document.getElementById('objective' + i + 'X').value = data['objective' + i + 'XValue'];
        document.getElementById('objective' + i + 'Y').value = data['objective' + i + 'YValue'];
        document.getElementById('objective' + i + 'Icon').value = data['objective' + i + 'Icon'];
    }

    document.getElementById("removeBorder").checked = data.removeBorder;    
    document.getElementById("textValue").value = data.textValue;
    document.getElementById("colorPicker").value = data.colorPicker;
    document.getElementById("colorPickerText").value = data.colorPickerText;
    
    // render the updated info
    render(data);
}

function defaultmissionData() {
    var data = new Object;
    data.name = "Bloodbowl_Play_Card";
    data.imageUrl = null;
    data.imageProperties = getDefaultModelImageProperties();
    data.base64Image = null;
    data.customBackgroundUrl = null;
    data.customBackgroundProperties = getDefaultModelImageProperties();
    data.base64CustomBackground = null;
    data.playName = "The Chevron Defence";
    data.teamName = "General";

    data.bgselected = "bg-07";


    data.objective1XValue = 7;
    data.objective1YValue = 0;
    data.objective1Icon = "L";
    data.objective2XValue = 8;
    data.objective2YValue = 0;
    data.objective2Icon = "L";
    data.objective3XValue = 6;
    data.objective3YValue = 0;
    data.objective3Icon = "L";
    data.objective4XValue = 5;
    data.objective4YValue = 2;
    data.objective4Icon = "L";
    data.objective5XValue = 9;
    data.objective5YValue = 2;
    data.objective5Icon = "L";
    data.objective6XValue = 10;
    data.objective6YValue = 3;
    data.objective6Icon = "B";

    data.objective7XValue = 4;
    data.objective7YValue = 3;
    data.objective7Icon = "B";
    data.objective8XValue = 2;
    data.objective8YValue = 2;
    data.objective8Icon = "L";
    data.objective9XValue = 1;
    data.objective9YValue = 3;
    data.objective9Icon = "L";
    data.objective10XValue = 12;
    data.objective10YValue = 2;
    data.objective10Icon = "L";
    data.objective11XValue = 13;
    data.objective11YValue = 3;
    data.objective11Icon = "L";

    data.removeBorder = false;


    data.colorPicker = "#FFFFFF";
    data.colorPickerText = "#000000"

    data.textValue = "";

    return data;
}

function savemissionDataMap(newMap) {
    window.localStorage.setItem("missionDataMap", JSON.stringify(newMap));
}

function loadmissionDataMap() {
    var storage = window.localStorage.getItem("missionDataMap");
    if (storage != null) {
        return JSON.parse(storage);
    }
    // Set up the map.
    var map = new Object;
    map["Bloodbowl_Play_Card"] = defaultmissionData();
    savemissionDataMap(map);
    return map;
}

function loadLatestmissionData() {
    var latestFighterName = window.localStorage.getItem("latestFighterName");
    if (latestFighterName == null) {
        latestFighterName = "Bloodbowl_Play_Card";
    }

    var data = loadmissionData(latestFighterName);

    if (data) {
        console.log("Loaded data:");
        console.log(data);
    }
    else {
        console.log("Failed to load data - loading default");
        data = defaultCardData();
    }

    return data;
}

function saveLatestmissionData() {
    var missionData = readControls();
    if (!missionData.name) {
        return;
    }

    window.localStorage.setItem("latestFighterName", missionData.name);
    //savemissionData(missionData);
}

function loadmissionData(missionDataName) {
    if (!missionDataName) {
        return null;
    }

    var map = loadmissionDataMap();
    if (map[missionDataName]) {
        return map[missionDataName];
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

function getLatestmissionDataName() {
    return "latestmissionData";
}

window.onload = function () {
    //window.localStorage.clear();

    var missionData = loadLatestmissionData();
    writeControls(missionData);
    refreshSaveSlots();

    getPlayList()
    // log response or catch error of fetch promise
    .then((data) => updatePlayListDropdown(data))

    // Get the select element
    const imageSelect = document.getElementById("imageSelectList");

    // Fetch image file names from the GitHub repository directory
    fetch("https://api.github.com/repos/barrysheppard/bloodbowl-card-creator/git/trees/7c45c5794805da6173e17f89ff1f2427a72065f9?recursive=1")
        .then(response => response.json())
        .then(data => {
            // Filter out files from the response
            const imageFiles = data.tree.filter(item => item.type === 'blob' && item.path.startsWith('assets/img/logos/'));

            // Populate the select dropdown with image file names
            imageFiles.forEach(function(imageFile) {
                const option = document.createElement("option");
                option.value = imageFile.path; // Set the option's value to the image file path
                option.text = imageFile.path.replace('assets/img/logos/', ''); // Display the image file name in the dropdown
                imageSelect.appendChild(option); // Add the option to the select element
            });
        })
        .catch(error => {
            console.error("Error fetching image files from GitHub: ", error);
        });


}

function validateInput(input) {
    // Only allow letters, spaces, and hyphens
    var regex = /^[a-zA-Z\s:-]+$/;
    return regex.test(input);
}

onAnyChange = function () {
    var missionData = readControls();
    render(missionData);
    saveLatestmissionData();
}

onFighterImageUpload = function () {
    image = getModelImage();
    setModelImage(image);
    var missionData = readControls();
    render(missionData);
    saveLatestmissionData();
}


function onClearCache() {
    window.localStorage.clear();
    location.reload();
    return false;
}

function onResetToDefault() {
    var missionData = defaultmissionData();
    writeControls(missionData);
}

function refreshSaveSlots() {
    // Remove all
    $('select').children('option').remove();

    var missionDataName = readControls().name;

    var map = loadmissionDataMap();

    for (let [key, value] of Object.entries(map)) {
        var selected = false;
        if (missionDataName &&
            key == missionDataName) {
            selected = true;
        }
        var newOption = new Option(key, key, selected, selected);
        $('#saveSlotsSelect').append(newOption);
    }
}

async function onSaveClicked() {
    data = readControls();

    // weird situation where when no image is saved, but json is then saved
    // when the json is loaded a blank image loads and if you try save json
    // again, this section will hang.

    // here is where we should be changing the imageUrl to base64
    data.base64Image = await handleImageUrlFromDisk(data.imageUrl)
    data.base64CustomBackground = await handleImageUrlFromDisk(data.customBackgroundUrl)

    // temp null while I work out image saving
    //data.imageUrl = null;

    // need to be explicit due to sub arrays
    var exportObj = JSON.stringify(data);

    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportObj);
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    file_name = "Bloodbowl_Play_";

    file_name =  file_name + data.teamName.replace(/ /g, "_") + "_" + data.playName.replace(/ /g, "_") + ".json";
    downloadAnchorNode.setAttribute("download", file_name);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function saveCardAsImage() {
    data = readControls();
    var element = document.createElement('a');
    element.setAttribute('href', document.getElementById('canvas').toDataURL('image/png'));
    
    file_name = "Bloodbowl_Play_";
    file_name = file_name + data.teamName.replace(/ /g, "_") + "_" + data.playName.replace(/ /g, "_") + ".png";

    element.setAttribute("download", file_name);
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
        json.customBackgroundUrl =  null;
        if (typeof json.customBackgroundProperties === "undefined") {
            json.customBackgroundProperties = getDefaultModelImageProperties();
        }

        // Check with old jsons where bgselected didn't exist
        let bgSelectedValue;

        // Check if missionData.bgselected value already exists
        if (!json.bgselected) {
        // Iterate through each bg option in missionData
        for (const prop in json) {
            if (prop.startsWith('bg') && json[prop]) {
            bgSelectedValue = prop.replace('bg', 'bg-');
            break;
            }
        }

        // Update missionData.bgselected only if a value is found
        if (bgSelectedValue) {
            json.bgselected = bgSelectedValue;
        }
        }
        writeControls(json);
    };

    readJSONFile(file).then(json =>
        saveJson(json)
    );

}

function getCustomBackgroundProperties() {
    return {
        offsetX: $("#customBackgroundOffsetX")[0].valueAsNumber,
        offsetY: $("#customBackgroundOffsetY")[0].valueAsNumber,
        scalePercent: $("#customBackgroundScalePercent")[0].valueAsNumber,
    };
}

function setCustomBackgroundProperties(customBackgroundProperties) {
    $("#customBackgroundOffsetX")[0].value = customBackgroundProperties.offsetX || 0;
    $("#customBackgroundOffsetY")[0].value = customBackgroundProperties.offsetY || 0;
    $("#customBackgroundScalePercent")[0].value = customBackgroundProperties.scalePercent || 100;
}

function getCustomBackground() {
    var imageSelect = $("#customBackgroundSelect")[0];
    if (imageSelect.files.length > 0) {
        return URL.createObjectURL(imageSelect.files[0]);
    }
    return null;
}

function setCustomBackground(image) {
    $("#customBackgroundUrl")[0].value = image;
}

onCustomBackgroundUpload = function () {
    image = getCustomBackground();
    setCustomBackground(image);
    var missionData = readControls();
    render(missionData);
    saveLatestmissionData();
}

function getCustomBackgroundUrl() {
    var imageSelect = $("#customBackgroundUrl")[0].value;
    return imageSelect;
}

function drawOverlayTexts(missionData) {
    const {
      playName
    } = missionData;
    // These are the texts to overlay
    drawMap();
    drawplayName(playName);
    drawBorder();
  
  }

  function drawMap(){
    getContext().drawImage(document.getElementById('map'), 0, 0, getCanvas().width, getCanvas().height); 
  }

  function drawIcon(name, x, y){
    newCoord = convertInchesToPixels(x, y);
    getContext().drawImage(document.getElementById(name), newCoord.x, newCoord.y, 70, 70); 
  }

function convertInchesToPixels(x_inches, y_inches){
    // X start is 173 and end is 173+352+352.
    // in inches that 704 = 30 inches. 704/30 = 23.46
    // y start is 162 and end is 162+ 252
    // in inches that 504 is 22 inches. 504/22 = 22.9
    startX = 70;
    startY = 115;
    x = startX + x_inches * 70.5;
    y = startY + y_inches * 70.5;
    return { x, y };
}

function convertInchesToPixelsLine(x_inches, y_inches){
    // X start is 173 and end is 173+352+352.
    // in inches that 704 = 30 inches. 704/30 = 23.46
    // y start is 162 and end is 162+ 252
    // in inches that 504 is 22 inches. 504/22 = 22.9
    startX = 205;
    startY = 200;
    x = startX + x_inches * 23.7;
    y = startY + y_inches * 22.9;

    return { x, y };
}


function writeScaledBorder(value, startX, startY) {
    getContext().fillStyle = 'white';
    writeScaled(value, { x: startX+1, y: startY });
    writeScaled(value, { x: startX, y: startY+1 });
    writeScaled(value, { x: startX+1, y: startY+1 });
    writeScaled(value, { x: startX-1, y: startY });
    writeScaled(value, { x: startX, y: startY-1 });
    writeScaled(value, { x: startX-1, y: startY-1 });
    getContext().fillStyle = 'black';
    writeScaled(value, { x: startX, y: startY });
}



function splitWordWrap(context, text, fitWidth) {
    // this was modified from the print version to only return the text array
    return_array = [];
    var lines = text.split('\n');
    lineNum = 0;
    for (var i = 0; i < lines.length; i++) {
        fitWidth = fitWidth || 0;
        if (fitWidth <= 0) {
            return_array.push(lines[i]);
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
                return_array.push(words.slice(0, idx - 1).join(' '));
                lineNum++;
                words = words.splice(idx - 1);
                idx = 1;
            }
            else {
                idx++;
            }
        }
        if (idx > 0) {
            return_array.push(words.join(' '));
            lineNum++;
        }

    }
    return return_array;
}



function drawText(){
    
    cardText = document.getElementById("textValue").value;

    getContext().font = '32px Georgia, serif';

        getContext().fillStyle = 'black';

    
    getContext().textAlign = "left";
    getContext().textBaseline = "middle";

    font_size = 32;
    lineHeight = font_size;
    getContext().font = font_size + 'px Georgia, serif';

    text_array = (splitWordWrap(getContext(), cardText, 800));

    let xPosition = 180; // Initialize x-coordinate position

    for (line in text_array) {
        const text = text_array[line];
        let startIndex = 0;
        yStart = 180;

        while (startIndex < text.length) {
            const start = text.indexOf("**", startIndex);

            if (start === -1) {
                // No more ** sequences found in this line, print the rest in black
                getContext().font = font_size + 'px Georgia, serif';
                const printText = text.substring(startIndex);
                const textWidth = getContext().measureText(printText).width;
                getContext().fillText(printText, xPosition, yStart + (line * lineHeight));
                xPosition += textWidth; // Update the x-coordinate position
                break;
            }

            if (start > startIndex) {
                // Print text before the ** in black
                getContext().font = font_size + 'px Georgia, serif';
                const printText = text.substring(startIndex, start);
                const textWidth = getContext().measureText(printText).width;
                getContext().fillText(printText, xPosition, yStart + (line * lineHeight));
                xPosition += textWidth; // Update the x-coordinate position
            }

            const end = text.indexOf("**", start + 2);

            if (end === -1) {
                // If no closing ** found, print the rest in black
                getContext().font = font_size + 'px Georgia, serif';
                const printText = text.substring(start);
                const textWidth = getContext().measureText(printText).width;
                getContext().fillText(printText, xPosition, yStart + (line * lineHeight));
                xPosition += textWidth; // Update the x-coordinate position
                break;
            }

            // Print text between ** in special format
            //getContext().fillStyle = '#eb4a04';
            getContext().font = 'bold ' + font_size + 'px Georgia, serif';
            const printTextBetween = text.substring(start + 2, end);
            const textWidthBetween = getContext().measureText(printTextBetween).width;
            getContext().fillText(printTextBetween, xPosition, yStart + (line * lineHeight));
            getContext().font = font_size + 'px Georgia, serif';
            xPosition += textWidthBetween; // Update the x-coordinate position

            startIndex = end + 2;
        }

        // Reset x-coordinate position for the next line
        xPosition = 180;
    }

}

function drawDeployment(){

    var data = [];

    for (var i = 1; i <= 11; i++) {
        var xValue = document.getElementById("objective" + i + "X").value;
        var yValue = document.getElementById("objective" + i + "Y").value;
        var iconValue = document.getElementById("objective" + i + "Icon").value;

        // Assuming you want to store the values in an array of objects
        data.push({
            x: xValue,
            y: yValue,
            icon: iconValue
        });
    }
    // Draw circles with letters using data array
    for (var i = 0; i < data.length; i++) {
        if(data[i].icon != 0){
            drawCircleWithLetter(data[i].x, data[i].y, data[i].icon);
        }
    }
}



function drawCircleWithLetter(x, y, Letter) {
    // Get the canvas element and its 2d context
    var canvas = getCanvas();
    var ctx = canvas.getContext("2d");

    newCoord = convertInchesToPixels(x, y);
    // Set circle properties
    var circleRadius = 34; // Radius of the circle
    var circleX = newCoord.x; // X-coordinate of the circle center
    var circleY = newCoord.y; // Y-coordinate of the circle center

    // Draw the circle outline
    ctx.beginPath();
    ctx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4; 

    // Set circle fill style to white and fill the circle
    ctx.fillStyle = document.getElementById("colorPicker").value;
    ctx.fill();

    // Set text properties
    var fontSize = (Letter.length > 1) ? 38 : 42; // Reduce font size if Letter has two characters
    getContext().font = fontSize + 'px brothers-regular';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = document.getElementById("colorPickerText").value; // Text color
    ctx.stroke();

    // Draw the letter inside the circle
    ctx.fillText(Letter, circleX, circleY+2);
}

async function getPlayList(){
    // await response of fetch call
    let response = await fetch("assets/plays.json");
    // only proceed once promise is resolved
    let data = await response.json();
    return data;
}

function loadPlayFromList(){
    var x = document.getElementById("sel").selectedIndex;
    var y = document.getElementById("sel").options;
    console.log("Index: " + y[x].index + " is " + y[x].text);
    getPlayList()
    // log response or catch error of fetch promise
    .then((data) => writeControls(data[y[x].index]));
}

function updatePlayListDropdown(data){
    $.each(data, function(i, option) {
        $('#sel').append($('<option/>').attr("value", option.playName).text(option.teamName + " - " + option.playName));
    });
}

function onImageSelectChange() {
    const imageSelect = document.getElementById("imageSelectList");
    const selectedImagePath = imageSelect.value;

    // Handle the selected image path as needed
    console.log("Selected Image Path:", selectedImagePath);

    // If you want to set the selected image as the model image and render it, you can do something like this:
    setModelImage(selectedImagePath);
    var missionData = readControls();
    render(missionData);
    saveLatestmissionData();
}


