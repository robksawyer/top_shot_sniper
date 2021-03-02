/**
 * save_options
 * Saves options to chrome.storage
 */
function save_options() {
  var color1 = document.getElementById('oneDigitColor').value;
  var color2 = document.getElementById('twoDigitColor').value;
  var color3 = document.getElementById('threeDigitColor').value;
  var serialList = document.getElementById('serialList').value;
  var toggleChoice = document.getElementById('toggle').checked;
  chrome.storage.sync.set(
    {
      oneDigitColor: color1,
      twoDigitColor: color2,
      threeDigitColor: color3,
      serialList: serialList,
      toggle: toggleChoice,
    },
    function () {
      // Update status to let user know options were saved.
      var status = document.getElementById('status');
      status.textContent = 'Options saved, refreshing your browser.';
      setTimeout(function () {
        status.textContent = '';
        window.close();
      }, 3000);
    }
  );

  /**
   * @see https://stackoverflow.com/questions/6718256/how-do-you-use-chrome-tabs-getcurrent-to-get-the-page-object-in-a-chrome-extensi#:~:text=getCurrent%20to%20get%20the%20page%20object%20in%20a%20Chrome%20extension%3F,-javascript%20html%20google&text=The%20code%20is%20meant%20to,within%20a%20browser%20action%20page.&text=getCurrent(%20function(tab)%7B%20console.
   */
  var code = 'window.location.reload();';
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    chrome.tabs.executeScript(tabs[0].id, { code: code });
  });
}

/**
 * restore_options
 * Restores select box and checkbox state using the preferences stored in chrome.storage.
 */
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get(
    {
      oneDigitColor: 'magenta',
      twoDigitColor: 'red',
      threeDigitColor: 'blue',
      serialList: '',
      toggle: false,
    },
    function (items) {
      document.getElementById('oneDigitColor').value = items.oneDigitColor;
      document.getElementById('twoDigitColor').value = items.twoDigitColor;
      document.getElementById('threeDigitColor').value = items.threeDigitColor;
      document.getElementById('serialList').value = items.serialList;
      document.getElementById('toggle').checked = items.toggle;
    }
  );
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
