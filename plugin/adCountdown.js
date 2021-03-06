videojs.registerPlugin('adCountdown', function() {

  // +++ Helpful method to convert seconds +++
  /**
   * Utility to extract h/m/s from seconds
   * @param {number} secs - seconds to convert to hh:mm:ss
   */
  function secondsToTime(secs) {
    var hours = Math.floor(secs / (60 * 60));
    if (hours < 10) {
      hours = "0" + hours.toString();
    } else {
      hours = hours.toString();
    };
    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);
    minutes = minutes.toString();
    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);
    if (seconds < 10) {
      seconds = "0" + seconds.toString();
    } else {
      seconds = seconds.toString();
    };
    var obj = {
      "h": hours,
      "m": minutes,
      "s": seconds
    };
    return obj;
  }

  var myPlayer = this;

  // +++ Add the overlay to the player +++
  myPlayer.overlay({
    "content": "<p id='adOverlay'>Ad: <span id='timeTarget'></span></p>",
    "start": "loadedmetadata"
  })

  // +++ Get reference to element containing overlay +++
  var adPlayerElement = document.querySelector('#adOverlay').parentElement;
  // Hide overlay at startup
  adPlayerElement.setAttribute('style', 'display: none');

  myPlayer.on('loadedmetadata', function () {
    var theInterval,
      timeLeftInAd;

    // +++ Check progress of ad every second +++
    // Function to be called every second during ad playback
    // Calculates time remaining and injects into overlay
    function everySecond() {
      var timeObject = secondsToTime(Math.floor(myPlayer.ima3.adPlayer.duration() - myPlayer.ima3.adPlayer.currentTime()));
      document.getElementById('timeTarget').innerHTML = timeObject.m + ':' + timeObject.s;
    }

    // +++ Clean up at ad end or ad skipped +++
    function videoCompleteOrSkipped() {
      // Stop the counter
      clearInterval(theInterval);
      // Hide the overlay
      adPlayerElement.setAttribute('style', 'display: none');
      // Clear any numbers so on display of overlay no small numbers left
      document.getElementById('timeTarget').innerHTML = '';
    }

    // +++ Start counter on start of ad +++
    myPlayer.on('ima3-started', function () {
      adPlayerElement.setAttribute('class', 'vjs-overlay');
      // Display the overlay
      adPlayerElement.setAttribute("style", "display: block; left: 5px");
      // Start the counter that calls function every second
      theInterval = setInterval(everySecond, 1000);
    });

    // +++ Listen for ad end or skipped +++
    myPlayer.on('ima3-complete', videoCompleteOrSkipped);
    myPlayer.on('ads-ad-skipped', videoCompleteOrSkipped);
  });
});
