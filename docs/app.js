(function () {
  "use strict";

  var inputs = {
    panelWidth: document.getElementById("panel-width"),
    panelHeight: document.getElementById("panel-height"),
    ledsPerM: document.getElementById("leds-per-m"),
    perChannel: document.getElementById("per-channel"),
    wattPerLed: document.getElementById("watt-per-led"),
    typicalBrightness: document.getElementById("typical-brightness"),
    volts: document.getElementById("volts"),
  };

  var outputs = {
    ledsW: document.getElementById("out-leds-w"),
    ledsH: document.getElementById("out-leds-h"),
    totalLeds: document.getElementById("out-total-leds"),
    outputAmount: document.getElementById("out-outputs"),
    wattsTypical: document.getElementById("out-watts-typical"),
    ampsTypical: document.getElementById("out-amps-typical"),
    wattsMax: document.getElementById("out-watts-max"),
    ampsMax: document.getElementById("out-amps-max"),
  };

  var gridGeneratorWrap = document.getElementById("grid-generator-wrap");
  var gridGeneratorLink = document.getElementById("grid-generator-link");
  var typicalBrightnessValue = document.getElementById("typical-brightness-value");

  var GRID_SCAD_FILE =
    "https://raw.githubusercontent.com/brantje/led-grid/refs/heads/main/grid_generator.scad";

  function gridGeneratorUrl(ledCountX, ledCountY) {
    var vars = JSON.stringify({
      // led_count_x: ledCountX,
      // led_count_y: ledCountY,
    });
    return (
      "https://scadder.dev/index.html?file=" +
      encodeURIComponent(GRID_SCAD_FILE) +
      "&vars=" +
      encodeURIComponent(vars)
    );
  }

  function parsePositiveNumber(el) {
    var raw = el.value.trim();
    if (raw === "") return null;
    var n = Number(raw);
    if (!Number.isFinite(n) || n < 0) return null;
    return n;
  }

  function parseBrightnessPercent(el) {
    var raw = el.value.trim();
    if (raw === "") return null;
    var n = Number(raw);
    if (!Number.isFinite(n) || n < 0 || n > 100) return null;
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
    outputs.wattsTypical.textContent = "—";
    outputs.ampsTypical.textContent = "—";
    outputs.wattsMax.textContent = "—";
    outputs.ampsMax.textContent = "—";
    gridGeneratorWrap.hidden = true;
  }

  function update() {
    var wCm = parsePositiveNumber(inputs.panelWidth);
    var hCm = parsePositiveNumber(inputs.panelHeight);
    var ledsPerM = parsePositiveNumber(inputs.ledsPerM);
    var perChannel = parsePositiveNumber(inputs.perChannel);
    var wattPerLed = parsePositiveNumber(inputs.wattPerLed);
    var brightnessPct = parseBrightnessPercent(inputs.typicalBrightness);
    var volts = parsePositiveNumber(inputs.volts);

    inputs.typicalBrightness.setAttribute(
      "aria-valuenow",
      brightnessPct === null ? "" : String(brightnessPct)
    );
    typicalBrightnessValue.textContent =
      brightnessPct === null ? "—" : String(brightnessPct) + "%";

    if (
      wCm === null ||
      hCm === null ||
      ledsPerM === null ||
      perChannel === null ||
      wattPerLed === null ||
      brightnessPct === null ||
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
    var totalWattsMax = totalLeds * wattPerLed;
    var totalWattsTypical = totalWattsMax * (brightnessPct / 100);
    var ampsTypical = totalWattsTypical / volts;
    var ampsMax = totalWattsMax / volts;

    outputs.ledsW.textContent = formatEdgeCount(ledCountW);
    outputs.ledsH.textContent = formatEdgeCount(ledCountH);
    outputs.totalLeds.textContent = String(totalLeds);
    outputs.outputAmount.textContent = String(outputAmount);
    outputs.wattsTypical.textContent = formatDecimal(totalWattsTypical, 2);
    outputs.ampsTypical.textContent = formatDecimal(ampsTypical, 2);
    outputs.wattsMax.textContent = formatDecimal(totalWattsMax, 2);
    outputs.ampsMax.textContent = formatDecimal(ampsMax, 2);

    gridGeneratorLink.href = gridGeneratorUrl(ledCountW, ledCountH);
    gridGeneratorWrap.hidden = false;
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
