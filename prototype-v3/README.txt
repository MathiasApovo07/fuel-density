FUEL DENSITY — PROTOTYPE 3
Open index.html in a modern browser. No server, installation or account required.
1. Adjust Fire Suppression, Temperature and Precipitation.
2. Select GO. One random plant ignites; observe the spread and results.
3. Select RESET to stop the fire, keep the settings and create a new forest.

Implementation choices and the source specification are in the parent Documentation folder. This is an educational model, not a wildfire prediction. A fire may stop after burning just one plant. Ignition probabilities are not final burn percentages.
Keyboard: Tab between controls, arrow keys/Home/End to adjust sliders, Enter/Space for buttons.
Tests: node --test tests/engine.test.cjs tests/calibration.test.cjs
Browser checks: tests/browser.cjs requires Playwright and installed Edge; not required to play.
All runtime files are local: index.html, styles.css, engine.js and app.js. Keep them together when sharing. No Food Water Shelter resources or code are used.

Review update 29 October 2026: suppression changes population only (20 trees / 40 shrubs to 30 / 70). Climate response remains provisional. The revised calibration targets are NOT yet met; see ../Documentation/Modifications-2026-10-29.txt and ../calibration/oct29/feasibility.json. Propagation rules remain unchanged.

Pause / Resume above the forest freezes and continues the same trial, including the remaining time before the next step. RESET discards the trial even while paused.


Version 3, step 1: low suppression updated to 20 trees and 40 shrubs per Ileah's 29 October reply. High suppression provisionally retained at 30 trees and 70 shrubs, with linear interpolation. Ignition probabilities and spread rules unchanged. New calibration not yet performed.

