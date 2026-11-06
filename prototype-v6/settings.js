/* EDIT THESE SIX NUMBERS, SAVE, THEN RELOAD index.html IN YOUR BROWSER.
   No Node.js or automated tests are needed to play manually.
   Probabilities below apply at 70 F and 80 precipitation days.
   Keep those two sliders fixed while comparing density settings.
   0.14 means 14%, 1 means 100%, and 0 means 0%.
   Counts are whole numbers; each low/high pair must total at most 100.
   Starting values confirmed by Ileah on 5 November 2026.
*/
(function(root){
 const settings={
  shrubIgnitionProbability: 0.9,
  treeIgnitionProbability: 0.07,
  lowSuppressionTrees: 15,
  lowSuppressionShrubs: 35,
  highSuppressionTrees: 30,
  highSuppressionShrubs: 70
 };
 if(typeof module!=='undefined'&&module.exports)module.exports=settings;
 else root.FuelSettings=settings;
})(typeof window!=='undefined'?window:globalThis);
