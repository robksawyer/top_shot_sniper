var SELECT_LIST_ID = 'moment-detailed-serialNumber';
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
 * addStyleLink
 * create a <link> with specific URL
 * @param {*} url
 */
var addStyleLink = function (url) {
  var link = document.createElement('link');
  link.href = url;
  link.rel = 'stylesheet';
  link.type = 'text/css'; // no need for HTML5
  //   document.querySelector('head').append(link);
  document.getElementsByTagName('head')[0].appendChild(link); // for IE6
};

/**
 * addSniperStyles
 * @param {string} styles
 */
var addSniperStyles = function (styles) {
  // Add the custom styles to the head of the page
  if (document.getElementById('sniperStyles')) {
    this.innerHTML = styles;
  } else {
    var newStyle = document.createElement('style');
    newStyle.id = 'sniperStyles';
    // document.querySelector('head').append(newStyle);
    document.getElementsByTagName('head')[0].appendChild(newStyle); // for IE6
    newStyle.innerHTML = styles;
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
  // Split the input values and build an array
  var serialListArray = serialList.split(',');
  //   Clean any whitespace
  serialListArray = serialListArray.map((item) => '#' + item.trim());
  var data = [];
  //   try {
  //     for (var i = 0; i < options.length; i++) {
  //       var tData = options[i].text;
  //       var serial = tData.split('-')[0].trim();
  //       var price = tData.split('-')[1].trim();
  //       data.push({ serial: serial, price: price });
  //     }
  //   } catch (err) {
  //     bglog(err);
  //   }

  var optionsArray = [];
  var foundSerials = [];
  var lowestAsks = 0;

  // Build some data arrays to use.
  // One array has only prices for sorting the list
  // Another has the price and serial for further analysis
  for (var i = 0; i < options.length; i++) {
    var tData = options[i].text;
    var serial = tData.split('-')[0].trim();
    var price = tData.split('-')[1].trim();
    data.push({ serial: serial, price: price });

    var digit = options[i].value.length;
    if (digit === 1) {
      options[i].classList.add('single-digit');
    } else if (digit === 2) {
      options[i].classList.add('double-digit');
    } else if (digit === 3) {
      options[i].classList.add('triple-digit');
    }
    options[i].price = options[i].innerText.split('$')[1];

    // Find if lowest ask
    var tLow = options[i].price.split('-').length;
    if (tLow > 1) {
      lowestAsks += 1;
    }

    // Fill the array
    optionsArray.push(options[i]);

    var serialAsInt = parseInt(serial, 10);
    if (serialListArray.indexOf(serial) !== -1) {
      foundSerials.push(serial);
    }
  }

  bglog('Data: ');
  bglog(data);

  bglog('Found Serials: ');
  bglog(foundSerials);

  bglog('Total lowest asks: ');
  bglog(lowestAsks);

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

  bglog('options');
  bglog(options);

  for (var i = 0; i <= options.length; i++) {
    options[i] = optionsArray[i];
  }

  //   Add the option groups
  var singleDigits = document.getElementsByClassName('single-digit');
  var doubleDigits = document.getElementsByClassName('double-digit');
  var tripleDigits = document.getElementsByClassName('triple-digit');

  var singleOptGroup = document.createElement('optgroup');
  singleOptGroup.setAttribute('label', 'Single Digit');

  //   for (var i = 0; i <= singleDigits.length; i++) {
  //     // this will in this case auto-select and default-select the third option
  //     bglog(singleDigits[i]);
  //     singleOptGroup.appendChild(singleDigits[i]);
  //   }
  //   Add the option group
  //   options[0].appendChild(singleOptGroup);
  var dynamicStyles =
    '.single-digit {color:' +
    c1 +
    ' !important} .double-digit {color:' +
    c2 +
    ' !important} .triple-digit {color:' +
    c3 +
    ' !important}';

  addSniperStyles(dynamicStyles);

  addStyleLink('https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css');

  //   Just select the first one.
  options[0].selected = true;

  if (foundSerials && foundSerials.length) {
    // Select the first found serial
    bglog(options);
  }

  //   Add the serials found to the page.
  var targetEl = document.getElementById('__next');
  //   bglog(targetEl.innerHTML);

  //   Add container
  if (document.getElementById('sniperDetails')) {
    // The details already exist
  } else {
    var containerEl = document.createElement('div');
    containerEl.id = 'sniperDetails';
    //   containerEl.style.width = '100%';
    containerEl.style.marginTop = '60px';
    containerEl.style.backgroundColor = '#325eff';
    containerEl.classList.add(
      'absolute',
      'top-0',
      'z-50',
      'w-screen',
      'h-auto',
      'bg-opacity-50',
      'py-6',
      'px-6'
    );

    // Sniper detail content
    var serialsFoundEl = document.createElement('div');
    serialsFoundEl.id = 'foundSerials';
    serialsFoundEl.classList.add('flex', 'flex-row', 'w-full');
    if (document.getElementById('foundSerials')) {
      // Already exists
    } else {
      // Create the element
      if (foundSerials.length) {
        var fTextEle = document.createElement('p');
        fTextEle.classList.add(
          'text-white',
          'font-bold',
          'pr-2',
          'inline-block'
        );
        fTextEle.innerText = 'Found Serials';
        serialsFoundEl.appendChild(fTextEle);

        serialsFoundEl.classList.add('text-white');
        var ul = document.createElement('ul');
        ul.classList.add('inline-block');
        serialsFoundEl.appendChild(ul);
        for (var r = 0; r < foundSerials.length; r++) {
          var li = document.createElement('li');
          li.classList.add('inline-block', 'pr-2');
          var serialAsInt = foundSerials
            ? parseInt(foundSerials[r].replace('#', ''), 10)
            : 0;
          li.innerHTML =
            '<a href="#!" onClick="function() { document.getElementById(' +
            SELECT_LIST_ID +
            ').value = "' +
            serialAsInt +
            '"; return void(0);} " title="Sniped serial #' +
            foundSerials[r] +
            '">' +
            foundSerials[r] +
            '</a>';
          if (
            foundSerials.length > 1 &&
            r >= 0 &&
            r < foundSerials.length - 1
          ) {
            li.innerHTML += ',';
          }
          // TODO: Add a link that auto selects the serial number
          ul.appendChild(li);
        }
      }
      containerEl.appendChild(serialsFoundEl);
    }

    targetEl.appendChild(containerEl);
    //   document.getElementsByTagName('body')[0].appendChild(containerEl);
  }

  bglog('Found Serials');
  bglog(foundSerials);
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
      var dropdown = document.getElementById(SELECT_LIST_ID);
      if (dropdown !== null) {
        // bglog('dropdown');
        // bglog(JSON.stringify(dropdown.innerHTML));
        init(dropdown.options, color1, color2, color3, serialList);
      }
    }
  }
);

// TODO: Write a method that searches to see if there's a specific list of serial numbers available.
