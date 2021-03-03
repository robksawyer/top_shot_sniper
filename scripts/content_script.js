/**
 * content_scripts
 */

var INITIALIZED = false;
var LOADING = false;
var SELECT_LIST_ID = 'moment-detailed-serialNumber';

/**
 * log
 * @see https://krasimirtsonev.com/blog/article/Chrome-extension-debugging-dev-tools-tab-or-how-to-make-console-log
 * @param {*} obj
 */
var log = function (obj) {
    if (chrome && chrome.runtime) {
        chrome.runtime.sendMessage({ type: 'bglog', obj });
    }
};

/**
 * ready
 * fired when the select list of serials and prices has loaded.
 * @param {*} dropdown 
 */
var ready = function (items, dropdown) {
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

    var percentArray = []
    if (dropdown !== null && dropdown.length > 1) {
        if (toggle === true) {
            percentArray = getPercentages(dropdown.options)
            // sortDropdown(dropdown.options);
        }
        if(text1 !== "" || text2 !== "" || text3 !== "" || text4 !== "") {
            var serialNumberParam = getParameterByName(location.search, 'serialNumber');
            log("serialNumber param: " + serialNumberParam);
            addText(dropdown, textArray, percentArray, toggleArray, serialNumberParam, true);
        }
        // colorChanges(dropdown, colorArray, toggleArray);
    }
}

/**
 * getParameterByName
 * @see https://stackoverflow.com/questions/11773190/chrome-extension-get-parameter-from-url
 * @param {*} queryString 
 * @param {*} name 
 */
var getParameterByName = function (queryString, name) {
    // Escape special RegExp characters
    name = name.replace(/[[^$.|?*+(){}\\]/g, '\\$&');
    // Create Regular expression
    var regex = new RegExp("(?:[?&]|^)" + name + "=([^&#]*)");
    // Attempt to get a match
    var results = regex.exec(queryString);
    return decodeURIComponent(results[1].replace(/\+/g, " ")) || '';
}

/**
 * https://stackoverflow.com/questions/8934877/obtain-smallest-value-from-array-in-javascript
 * @param {*} array 
 */
Array.min = function( array ) {
    return Math.min.apply( Math, array );
};
Array.max = function( array ) {
    return Math.max.apply( Math, array );
};

/**
 * getArrayAverage
 * @param {array} arr 
 */
var getArrayAverage = function (arr) {
    var sum = 0;
    for( var i = 0; i < arr.length; i++ ){
        sum += parseInt( arr[i], 10 );
    }
    return sum/arr.length;
}

/**
 * getPercentages
 * @param {*} options 
 */
var getPercentages = function(options) {
    var optionsArray = [];
    try {
        for (var i = 0; i < options.length; i++) {
            var optionsText = options[i].innerText;
            if (optionsText.includes('$')) {
                var tPrice = optionsText.split('$')[1].replace(/,/g, '');
                optionsArray.push(parseFloat(tPrice));
            } else {
                var tPrice = 0.00;
                optionsArray.push(parseFloat(tPrice));        
            }
        }
    } catch (err) {
        log(err);
    }

    var min = Array.min(optionsArray.slice(1, optionsArray.length-1))
    // var max = Array.max(optionsArray.slice(1, optionsArray.length-1))
    // var average = getArrayAverage(optionsArray.slice(1, optionsArray.length-1))
    // log("min: " + min)
    // log("max: " + max)
    // log("average: " + average)
    var percArray = []
    for (var j = 0; j < optionsArray.length; j++) {
        var curr = parseInt(optionsArray[j], 10);
        var diff = curr - min;
        var percentageInc = Math.round(diff / min * 100 );
        percArray.push(percentageInc)
    }

    return percArray
}

/**
 * getPrices
 * @param {*} options 
 */
var getPrices = function(options) {
    var optionsArray = [];
    try {
        for (var i = 0; i < options.length; i++) {
            var optionsText = options[i].innerText;
            if (optionsText.includes('$')) {
                var tPrice = optionsText.split('$')[1].replace(/,/g, '');
                optionsArray.push(parseFloat(tPrice));
            } else {
                var tPrice = 0.00;
                optionsArray.push(parseFloat(tPrice));        
            }
        }
    } catch (err) {
        log(err);
    }
    return optionsArray
}
  
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

/**
 * allDescendents
 * @param {*} node
 */
var allDescendents = function(node) {
    const descendents = [];

    for (const childNode of node.childNodes) {
        descendents.push(childNode, ...allDescendents(childNode));
    }

    return descendents;
};

  
/**
 * addText
 * Adds the text next to the option item
 * @param {HTMLSelectElement} options 
 * @param {*} text 
 * @param {*} percentages 
 * @param {*} toggles 
 * @param {string} serialNumberParam 
 * @param {bool} showPercentages 
 */
var addText = function(options, text, percentages, toggles, serialNumberParam, showPercentages) {
    log("Total options: " + options.length);

    var prices = getPrices(options);
    
    for (var i = 0; i < options.length; i++) {
        var digit = options[i].value.length;
        var data = options[i].dataset.text;
        var serialNumber = options[i].value;

        var selectedSerial = parseInt(serialNumber, 10) === parseInt(serialNumberParam, 10)
 
        var isBuy = false;


        if (digit === 1 && toggles[0] === true && data === undefined && text[0] !== "") {
            options[i].innerText += " - " + text[0];
            options[i].dataset.text = "true";
        }
        else if (digit === 2 && toggles[1] === true && data === undefined && text[1] !== "") {
            options[i].innerText += " - " + text[1];
            options[i].dataset.text = "true";
        }
        else if (digit === 3 && toggles[2] === true && data === undefined && text[2] !== "") {
            options[i].innerText += " - " + text[2];
            
            options[i].dataset.text = "true";
        }
        else if (digit === 4 && toggles[3] === true && data === undefined && text[3] !== "") {
            options[i].innerText += " - " + text[3];
            options[i].dataset.text = "true";
        } 

        // Add percentages based on the lowest ask for all serials
        if (showPercentages && !serialNumberParam) {
            if (percentages[i] !== -100 && data === undefined) {
                options[i].innerText += " - " + percentages[i].toString() + "%";
                options[i].dataset.text = "true";
            }
        }

        if (selectedSerial) {
            log("serialNumber: " + serialNumber);
            log("Sorting serial numbers before " + serialNumber);

            var currVal = prices[i];

            // Sort the lower serials percentages
            // var sortedPercsBefore = [];
            // Get array of number before current index, sort them and figure out if this one is lower than all others
            var before = prices.splice(0, i);
            before = before.sort(function(a, b) {
                return a - b;
            });
            log(before);

            // Find the percentage away from the lowest price above 
            var minValAbove = before[1]; // Skip first because its the --- Select ...
            log("minValAbove: " + minValAbove)
            log("currVal: " + currVal)
            var diff = minValAbove - currVal;
            var tPerc = Math.round(diff / currVal * 100);
            log("Buy percentage: " + tPerc)

            if (tPerc && data === undefined) {
                options[i].innerText += " - " + tPerc.toString() + "%";
                options[i].dataset.text = "true";
            }
            

            log("Percentage away from low above current " + tPerc);
            if (prices[i] < before[1]) {
                log("Buy!")
                isBuy = true;
            } else if (prices[i] < before[1] && data === undefined) { 
                options[i].innerText += " - LOWEST ABOVE $" + before[1];
                options[i].dataset.text = "true";
            }

            if (isBuy && data === undefined && tPerc > 50) {
                options[i].innerText += " - BUY";
                options[i].dataset.text = "true";
            }
        }
    
    }
}


chrome.storage.sync.get([
    'oneDigitColor', 'twoDigitColor', 'threeDigitColor', 
    'fourDigitColor', 'oneDigitText', 'twoDigitText', 
    'threeDigitText', 'fourDigitText', 'toggle', 
    'toggle1', 'toggle2', 'toggle3', 'toggle4'
], function(items) {
    var dropdown = document.getElementById(SELECT_LIST_ID);

    if (dropdown && !INITIALIZED) {
        INITIALIZED = true;
        // ready(items, dropdown);
    } else if (!LOADING) {
        LOADING = true
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (!mutation.addedNodes) {
                    return;
                }
     
                for (var node of mutation.addedNodes) {
                    var childNodes = [node, ...allDescendents(node)];
                   
                    for (var childNode of childNodes) {
                      if (childNode.id === SELECT_LIST_ID) {
                          if (childNode.length > 1) {
                            ready(items, childNode);
                            break;
                          }
                      }
                    }
                }

                observer.disconnect();
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false,
        });
    } 
});