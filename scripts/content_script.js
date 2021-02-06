/**
 * bglog
 * @see https://krasimirtsonev.com/blog/article/Chrome-extension-debugging-dev-tools-tab-or-how-to-make-console-log
 * @param {*} obj
 */
var bglog = function (obj) {
  if (chrome && chrome.runtime) {
    chrome.runtime.sendMessage({ type: 'bglog', obj: obj });
  }
};

/**
 * createOptionGroup
 */
// function createOptionGroup() {
//   var optGroup = document.createElement('optgroup');

//   var objSelect = document.forms(0).elements(0);
//   var objOption = document.createElement('option');

//   objOption.innerHTML = 'tset';
//   objOption.value = 'simon';

//   optGroup.label = 'simple';

//   objSelect.appendChild(optGroup);
//   optGroup.appendChild(objOption);
// }

/**
 * init
 * @param {*} options
 * @param {*} c1
 * @param {*} c2
 * @param {*} c3
 */
var init = function (options, c1, c2, c3, serialList) {
  var optionsArray = [];

  var foundSerials = [];

  //   Build a price array that includes only the prices.
  for (var i = 0; i < options.length; i++) {
    var digit = options[i].value.length;
    if (digit === 1) {
      options[i].classList.add('single-digit');
    } else if (digit === 2) {
      options[i].classList.add('double-digit');
    } else if (digit === 3) {
      options[i].classList.add('triple-digit');
    }
    options[i].price = options[i].innerText.split('$')[1];

    if (serialList.indexOf(options[i].value)) {
      foundSerials.push(options[i]);
    }

    // Fill the array
    optionsArray.push(options[i]);
  }

  bglog('foundSerials', foundSerials);

  // Sort based on the lowest ask
  optionsArray = optionsArray.sort(function (a, b) {
    if (
      parseInt(a.price.replace(/,/g, '')) ===
      parseInt(b.price.replace(/,/g, ''))
    ) {
      return 0;
    } else {
      return parseInt(a.price.replace(/,/g, '')) <
        parseInt(b.price.replace(/,/g, ''))
        ? -1
        : 1;
    }
  });

  for (var i = 0; i <= options.length; i++) {
    options[i] = optionsArray[i];
  }

  var dynamicStyles =
    '.single-digit {color:' +
    c1 +
    ' !important} .double-digit {color:' +
    c2 +
    ' !important} .triple-digit {color:' +
    c3 +
    ' !important}';

  // Add the custom styles to the head of the page
  if (document.getElementById('sniperStyles')) {
    this.innerHTML = dynamicStyles;
  } else {
    var newStyle = document.createElement('style');
    newStyle.id = 'sniperStyles';
    document.querySelector('head').append(newStyle);
    newStyle.innerHTML = dynamicStyles;
  }
  options[0].selected = true;
};

chrome.storage.sync.get(
  ['oneDigitColor', 'twoDigitColor', 'threeDigitColor', 'toggle', 'serialList'],
  function (items) {
    var color1 = items['oneDigitColor'];
    var color2 = items['twoDigitColor'];
    var color3 = items['threeDigitColor'];
    var toggle = items['toggle'];
    var serialList = items['serialList'];
    if (toggle === true) {
      var dropdown = document.getElementById('moment-detailed-serialNumber');
      if (dropdown !== null) {
        init(dropdown.options, color1, color2, color3, serialList);
      }
    }
  }
);

// TODO: Write a method that searches to see if there's a specific list of serial numbers available.
