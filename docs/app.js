(function () {
  "use strict";

  var inputs = {
    panelWidth: document.getElementById("panel-width"),
    panelHeight: document.getElementById("panel-height"),
    ledsPerM: document.getElementById("leds-per-m"),
    perChannel: document.getElementById("per-channel"),
    wattPerLed: document.getElementById("watt-per-led"),
    volts: document.getElementById("volts"),
  };

  var outputs = {
    ledsW: document.getElementById("out-leds-w"),
    ledsH: document.getElementById("out-leds-h"),
    totalLeds: document.getElementById("out-total-leds"),
    outputAmount: document.getElementById("out-outputs"),
    watts: document.getElementById("out-watts"),
    amps: document.getElementById("out-amps"),
  };

  function parsePositiveNumber(el) {
    var raw = el.value.trim();
    if (raw === "") return null;
    var n = Number(raw);
    if (!Number.isFinite(n) || n < 0) return null;
    return n;
  }

  function formatEdgeCount(n) {
    if (!Number.isFinite(n)) return "—";
    if (Math.abs(n - Math.round(n)) < 1e-9) return String(Math.round(n));
    var s = n.toFixed(2);
    return s.replace(/\.?0+$/, "") || "0";
  }

  function formatDecimal(n, places) {
    if (!Number.isFinite(n)) return "—";
    return n.toFixed(places);
  }

  function setDash() {
    outputs.ledsW.textContent = "—";
    outputs.ledsH.textContent = "—";
    outputs.totalLeds.textContent = "—";
    outputs.outputAmount.textContent = "—";
    outputs.watts.textContent = "—";
    outputs.amps.textContent = "—";
  }

  function update() {
    var wCm = parsePositiveNumber(inputs.panelWidth);
    var hCm = parsePositiveNumber(inputs.panelHeight);
    var ledsPerM = parsePositiveNumber(inputs.ledsPerM);
    var perChannel = parsePositiveNumber(inputs.perChannel);
    var wattPerLed = parsePositiveNumber(inputs.wattPerLed);
    var volts = parsePositiveNumber(inputs.volts);

    if (
      wCm === null ||
      hCm === null ||
      ledsPerM === null ||
      perChannel === null ||
      wattPerLed === null ||
      volts === null ||
      perChannel <= 0 ||
      volts === 0
    ) {
      setDash();
      return;
    }

    var ledsW = (wCm / 100) * ledsPerM;
    var ledsH = (hCm / 100) * ledsPerM;
    var ledCountW = Math.floor(ledsW);
    var ledCountH = Math.floor(ledsH);
    var totalLeds = ledCountW * ledCountH;
    var outputAmount = Math.ceil(totalLeds / perChannel);
    var totalWatts = totalLeds * wattPerLed;
    var amps = totalWatts / volts;

    outputs.ledsW.textContent = formatEdgeCount(ledCountW);
    outputs.ledsH.textContent = formatEdgeCount(ledCountH);
    outputs.totalLeds.textContent = String(totalLeds);
    outputs.outputAmount.textContent = String(outputAmount);
    outputs.watts.textContent = formatDecimal(totalWatts, 2);
    outputs.amps.textContent = formatDecimal(amps, 2);
  }

  var form = document.getElementById("calc-form");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
  });

  Object.keys(inputs).forEach(function (key) {
    inputs[key].addEventListener("input", update);
    inputs[key].addEventListener("change", update);
  });

  inputs.panelWidth.addEventListener("input", function () {
    inputs.panelHeight.value = inputs.panelWidth.value;
  });

  update();
})();
