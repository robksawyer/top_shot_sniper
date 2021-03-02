/**
 * log
 * @see https://krasimirtsonev.com/blog/article/Chrome-extension-debugging-dev-tools-tab-or-how-to-make-console-log
 * @param {*} obj
 */
var log = (obj) => {
    if (chrome && chrome.runtime) {
        chrome.runtime.sendMessage({ type: 'bglog', obj });
    }
};

  
var sortDropdown = function(options) {
    var optionsArray = [];
    for (var i = 0; i < options.length; i++) {
        var optionsText = options[i].innerText;
        if(optionsText.includes('$')) {
            options[i].price = optionsText.split('$')[1];
            optionsArray.push(options[i]);
        }
        else {
            options[i].price = '$0';
            optionsArray.push(options[i]);        
        }
    }
    optionsArray = optionsArray.sort(function (a, b) {           
        if (parseInt(a.price.replace(/,/g, '')) === parseInt(b.price.replace(/,/g, ''))) {
            return 0;
        } else {
            return (parseInt(a.price.replace(/,/g, '')) < parseInt(b.price.replace(/,/g, ''))) ? -1 : 1;
        }   
    });

    for (var i = 0; i <= options.length; i++) {            
        options[i] = optionsArray[i];
    }
    options[0].selected = true;
};
var colorChanges = function(options, colors, toggles) {
    for (var i = 0; i < options.length; i++) {
        var digit = options[i].value.length;
        if (digit === 1) {
            options[i].classList.add('one-digit');
        }
        else if (digit === 2) {
            options[i].classList.add('two-digit');
        }
        else if (digit === 3) {
            options[i].classList.add('three-digit');
        }
        else if (digit === 4) {
            options[i].classList.add('four-digit');
        }
    }
    var dynamicStyles = '';
    if(toggles[0] === true) {
        dynamicStyles += '.one-digit {color:'+colors[0]+' !important}';
    }
    if(toggles[1] === true) {
        dynamicStyles += '.two-digit {color:'+colors[1]+' !important}';
    }
    if(toggles[2] === true) {
        dynamicStyles += '.three-digit {color:'+colors[2]+' !important}';
    }
    if(toggles[3] === true) {
        dynamicStyles += '.four-digit {color:'+colors[3]+' !important}';
    }
    var helperStyles = document.getElementById('helperStyles');
    if(helperStyles) {
        helperStyles.innerHTML = dynamicStyles;
    }
    else {
        var newStyle = document.createElement('style');
        newStyle.id = "helperStyles";
        document.querySelector('head').append(newStyle);
        newStyle.innerHTML = dynamicStyles;
    }
};
var addText = function(options, text, toggles) {
    for (var i = 0; i < options.length; i++) {
        var digit = options[i].value.length;
        var data = options[i].dataset.text;
        if (digit === 1 && toggles[0] === true && data === undefined && text[0] !== "") {
            options[i].innerText += " - " + text[0];
            options[i].dataset.text = "true";
        }
        else if (digit === 2 &&  toggles[1] === true && data === undefined && text[1] !== "") {
            options[i].innerText += " - " + text[1];
            options[i].dataset.text = "true";
        }
        else if (digit === 3 &&  toggles[2] === true && data === undefined && text[2] !== "") {
            options[i].innerText += " - " + text[2];
            options[i].dataset.text = "true";
        }
        else if (digit === 4 &&  toggles[3] === true && data === undefined && text[3] !== "") {
            options[i].innerText += " - " + text[3];
            options[i].dataset.text = "true";
        }
    }
}
chrome.storage.sync.get(['oneDigitColor', 'twoDigitColor', 'threeDigitColor', 'fourDigitColor', 'oneDigitText', 'twoDigitText', 'threeDigitText', 'fourDigitText', 'toggle', 'toggle1', 'toggle2', 'toggle3', 'toggle4'], function(items) {
    var color1 = items['oneDigitColor'];
    var color2 = items['twoDigitColor'];
    var color3 = items['threeDigitColor'];
    var color4 = items['fourDigitColor'];
    var colorArray = [];
    var text1 = items['oneDigitText'];
    var text2 = items['twoDigitText'];
    var text3 = items['threeDigitText'];
    var text4 = items['fourDigitText'];
    var textArray = [];
    var toggle = items['toggle'];
    var toggle1 = items['toggle1'];
    var toggle2 = items['toggle2'];
    var toggle3 = items['toggle3'];
    var toggle4 = items['toggle4'];
    var toggleArray = [];
    toggleArray.push(toggle1, toggle2, toggle3, toggle4);
    colorArray.push(color1, color2, color3, color4);
    textArray.push(text1, text2, text3, text4);
    var checkExist = setInterval(function() {
        var dropdown = document.getElementById('moment-detailed-serialNumber');
        if (dropdown !== null && dropdown.length) {
            if (toggle === true) {
                log(dropdown.options)
                sortDropdown(dropdown.options);
            }
            if(text1 !== "" || text2 !== "" || text3 !== "" || text4 !== "") {
                addText(dropdown, textArray, toggleArray);
            }
            colorChanges(dropdown, colorArray, toggleArray);
           clearInterval(checkExist);
        }
    }, 100);  
});