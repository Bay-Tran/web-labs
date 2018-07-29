/*
  Design, text, images and code by Richard K. Herz, 2017-2018
  Copyrights held by Richard K. Herz
  Licensed for use under the GNU General Public License v3.0
  https://www.gnu.org/licenses/gpl-3.0.en.html
*/
//
// WARNING: in units, local data array names for plotting must be
//          'profileData' for ['type'] = 'profile'
//          'stripData' for ['type'] = 'strip'
//          'colorCanvasData' for ['type'] = 'canvas'
//
// ---------- DECLARE PARENT OBJECT TO HOLD PLOT INFO --------
// --- DEFINITION OF PLOTS: PROFILE, STRIP CHART, & COLOR CANVAS ---
//
// the object properties are used by plotting functions
// more than one plot can be put one one web page by
// defining multiple object children, where the first index
// plotInfo[0] is the plot number index (starting at 0)
//
// plotting is called by the controller object and not individual process
// units in order that a plot may contain data from more than one process unit
//
// some options may be optional for some plotting packages, such as
// plotDataSeriesColors for flot.js package, in which case default values will
// be used by the plotting package
//
// method initialize() below places the plot definitions into plotInfo
//
let plotInfo = {

  // after the openThisLab() function in _main.js calls method initialize()
  // here, this object will contain a child object for each plot
  //
  // method initialize() is run after each process units initialize() method
  // is run by openThisLab() so that it can use values from the units,
  // e.g., processUnits[unum]['dataMin'][1]; // [1] is TinCold
  //
  // in _main.js, the function updateDisplay() uses the length of plotInfo
  // after subtracting 1 for method initialize, in order to plot all the plots;
  // if you add another method, you need to update the length correction
  // in updateDisplay()

  initialize : function() {
    //
    // WARNING: some of these object properties may be changed during
    //          operation of the program, e.g., show, scale
    //
    // --------- below are plots for the reactor ----------------
    //
    let unum = 0; // useful when only one unit in plot, processUnits[unum]
    //
    // plot 0 info
    let pnum = 0;
    plotInfo[pnum] = new Object();
    plotInfo[pnum]['type'] = 'profile';
    plotInfo[pnum]['title'] = 'Reactor Profiles';
    plotInfo[pnum]['canvas'] = '#div_PLOTDIV_PFR_plot'; // flot.js wants ID with prefix #
    plotInfo[pnum]['numberPoints'] = processUnits[unum]['numNodes']; // should match numNodes in process unit
    // plot has numberPoints + 1 pts!
    plotInfo[pnum]['xAxisLabel'] = 'Position in Reactor';
    plotInfo[pnum]['xAxisTableLabel'] = 'Position'; // label for copy data table
    // xAxisShow false does not show numbers, nor label, nor grid for x-axis
    // might be better to cover numbers if desire not to show numbers
    plotInfo[pnum]['xAxisShow'] = 1; // 0 false, 1 true
    plotInfo[pnum]['xAxisMin'] = 0;
    plotInfo[pnum]['xAxisMax'] = 1;
    plotInfo[pnum]['xAxisReversed'] = 0; // 0 false, 1 true, when true, xmax on left
    plotInfo[pnum]['yLeftAxisLabel'] = 'Trxr (K)'; // or d'less (T - TinCold)/(TinHot - TinCold)
    plotInfo[pnum]['yLeftAxisMin'] = 320; // XXX processUnits[unum]['dataMin'][9]; // [9] is Trxr
    plotInfo[pnum]['yLeftAxisMax'] = 420; // XXX processUnits[unum]['dataMax'][9];
    plotInfo[pnum]['yRightAxisLabel'] = 'Ca (mol/m3)';
    plotInfo[pnum]['yRightAxisMin'] = 0;
    plotInfo[pnum]['yRightAxisMax'] = 550; // processUnits[unum]['Cain'];
    plotInfo[pnum]['plotLegendShow'] = 1;  // Boolean, '' or 0 for no show, 1 or "show"
    plotInfo[pnum]['plotLegendPosition'] = 'nw';
    plotInfo[pnum]['plotGridBgColor'] = 'white';
    // colors can be specified rgb, rgba, hex, and color names
    // for flot.js colors, only basic color names appear to work, e.g., white, blue, red
    // for all html color names to hex see http://www.color-hex.com
    // for all color names to hex see https://www.w3schools.com/colors/colors_picker.asp
    plotInfo[pnum]['plotDataSeriesColors'] = ['#ff6347','#1e90ff']; // optional, in variable order 0, 1, etc.
    // ['#ff6347','#1e90ff'] is Tomato and DodgerBlue
    //
    // SET UP ARRAYS TO HOLD INFO FOR EACH VARIABLE on plot and/or copy data table
    // WARNING: all below with prefix 'var' must have same number of child objects,
    // one for each variable placed on plot
    plotInfo[pnum]['varUnitIndex'] = new Array();
    plotInfo[pnum]['var'] = new Array();
    plotInfo[pnum]['varLabel'] = new Array();
    plotInfo[pnum]['varDataUnits'] = new Array();
    plotInfo[pnum]['varShow'] = new Array();
    plotInfo[pnum]['varYaxis'] = new Array();
    plotInfo[pnum]['varYscaleFactor'] = new Array();
    //
    // ADD SETTINGS FOR EACH VARIABLE
    //
    let vnum = 0; // 1st variable
    plotInfo[pnum]['varUnitIndex'][0] = unum; // value is index of unit in processUnits object
    plotInfo[pnum]['var'][vnum] = 0; // value is variable index in plot data array
    plotInfo[pnum]['varLabel'][vnum] = 'Trxr';
    // varDataUnits are dimensional units used in copy data table, along with varLabel
    plotInfo[pnum]['varDataUnits'][vnum] = processUnits[unum]['dataUnits'][7]; // 1st var
    // varShow values are 'show' to show on plot and legend,
    // 'tabled' to not show on plot nor legend but list in copy data table
    // and any other value, e.g., 'hide' to not show on plot but do show in legend
    // varShow value can be changed by javascript if want to show/hide curve with checkbox
    plotInfo[pnum]['varShow'][vnum] = 'show';
    plotInfo[pnum]['varYaxis'][vnum] = 'left';
    plotInfo[pnum]['varYscaleFactor'][vnum] = 1;
    //
    vnum = 1; // 2nd variable
    plotInfo[pnum]['varUnitIndex'][1] = unum;
    plotInfo[pnum]['var'][vnum] = 1;
    plotInfo[pnum]['varLabel'][vnum] = 'Ca';
    plotInfo[pnum]['varDataUnits'][vnum] = processUnits[unum]['dataUnits'][8];
    plotInfo[pnum]['varShow'][vnum] = 'show';
    plotInfo[pnum]['varYaxis'][vnum] = 'right';
    plotInfo[pnum]['varYscaleFactor'][vnum] = 1;
    //
    // plot 1 info
    pnum = 1;
    plotInfo[pnum] = new Object();
    plotInfo[pnum]['type'] = 'canvas';
    plotInfo[pnum]['title'] = 'reactor color canvas';
    plotInfo[pnum]['canvas'] = 'canvas_CANVAS_reactor'; // without prefix #
    // for canvas type, all data comes from one process unit and one local array
    plotInfo[pnum]['varUnitIndex'] = unum; // index of unit in processUnits object
    plotInfo[pnum]['var'] = 0; // variable number in array spaceTimeData, 0, 1, etc.
    // varTimePts & varSpacePts must match values used in unit array colorCanvasData
    plotInfo[pnum]['varTimePts'] = processUnits[unum]['numNodes'];
    plotInfo[pnum]['varSpacePts'] = 1;
    plotInfo[pnum]['varValueMin'] = 320; // processUnits[unum]['dataMin'][9]; // [9] is Trxr
    plotInfo[pnum]['varValueMax'] = 420; // processUnits[unum]['dataMax'][9];
    plotInfo[pnum]['xAxisReversed'] = 0; // 0 false, 1 true, when true, xmax on left
    //
    // --------- below are plots for the heat exchanger ----------------
    //
    unum = 1; // useful when only one unit in plot, processUnits[unum]
    //
    // plot 2 info
    pnum = 2;
    plotInfo[pnum] = new Object();
    plotInfo[pnum]['type'] = 'profile';
    plotInfo[pnum]['title'] = 'Heat Exchanger Temperature Profiles';
    plotInfo[pnum]['canvas'] = '#div_PLOTDIV_T_plot'; // flot.js wants ID with prefix #
    plotInfo[pnum]['numberPoints'] = processUnits[unum]['numNodes'];
    // plot has numberPoints + 1 pts!
    plotInfo[pnum]['xAxisLabel'] = 'Position in Heat Exchanger';
    plotInfo[pnum]['xAxisTableLabel'] = 'Position'; // label for copy data table
    // xAxisShow false does not show numbers, nor label, nor grid for x-axis
    // might be better to cover numbers if desire not to show numbers
    plotInfo[pnum]['xAxisShow'] = 1; // 0 false, 1 true
    plotInfo[pnum]['xAxisMin'] = 0;
    plotInfo[pnum]['xAxisMax'] = 1;
    plotInfo[pnum]['xAxisReversed'] = 1; // 0 false, 1 true, when true, xmax on left
    plotInfo[pnum]['yLeftAxisLabel'] = 'T (K)'; // or d'less (T - TinCold)/(TinHot - TinCold)
    plotInfo[pnum]['yLeftAxisMin'] = 320; // processUnits[unum]['dataMin'][1]; // [1] is TinCold
    plotInfo[pnum]['yLeftAxisMax'] = 450; // processUnits[unum]['dataMax'][0]; // [0] is TinHot
    plotInfo[pnum]['yRightAxisLabel'] = 'yRight';
    plotInfo[pnum]['yRightAxisMin'] = 0;
    plotInfo[pnum]['yRightAxisMax'] = 1;
    plotInfo[pnum]['plotLegendPosition'] = "nw";
    plotInfo[pnum]['plotLegendShow'] = 0;  // Boolean, '' or 0 for no show, 1 or "show"
    plotInfo[pnum]['plotGridBgColor'] = 'white';
    // colors can be specified rgb, rgba, hex, and color names
    // for flot.js colors, only basic color names appear to work, e.g., white, blue, red
    // for all html color names to hex see http://www.color-hex.com
    // for all color names to hex see https://www.w3schools.com/colors/colors_picker.asp
    plotInfo[pnum]['plotDataSeriesColors'] = ['#ff6347','#1e90ff']; // optional, in variable order 0, 1, etc.
    // ['#ff6347','#1e90ff'] is Tomato and DodgerBlue
    //
    // SET UP ARRAYS TO HOLD INFO FOR EACH VARIABLE on plot and/or copy data table
    // WARNING: all below with prefix 'var' must have same number of child objects,
    // one for each variable placed on plot
    plotInfo[pnum]['varUnitIndex'] = new Array();
    plotInfo[pnum]['var'] = new Array();
    plotInfo[pnum]['varLabel'] = new Array();
    plotInfo[pnum]['varDataUnits'] = new Array();
    plotInfo[pnum]['varShow'] = new Array();
    plotInfo[pnum]['varYaxis'] = new Array();
    plotInfo[pnum]['varYscaleFactor'] = new Array();
    //
    // ADD SETTINGS FOR EACH VARIABLE
    //
    vnum = 0; // 1st variable
    plotInfo[pnum]['varUnitIndex'][vnum] = unum; // value is index of unit in processUnits object
    plotInfo[pnum]['var'][vnum] = 0; // value is variable index in plot data array
    // varlabel is used in plot legend
    plotInfo[pnum]['varLabel'][vnum] = 'Thot'; // 1st var
    // varDataUnits are dimensional units used in copy data table, along with varLabel
    plotInfo[pnum]['varDataUnits'][vnum] = 'K';
    // varShow values are 'show' to show on plot and legend,
    // 'tabled' to not show on plot nor legend but list in copy data table
    // and any other value, e.g., 'hide' to not show on plot but do show in legend
    // varShow value can be changed by javascript if want to show/hide curve with checkbox
    plotInfo[pnum]['varShow'][vnum] = 'show'; // 1st var
    plotInfo[pnum]['varYaxis'][vnum] = 'left'; // 1st var
    plotInfo[pnum]['varYscaleFactor'][vnum] = 1; // 1st var
    //
    vnum = 1; // 2nd variable
    plotInfo[pnum]['varUnitIndex'][vnum] = unum;
    plotInfo[pnum]['var'][vnum] = 1;
    plotInfo[pnum]['varLabel'][vnum] = 'Tcold';
    plotInfo[pnum]['varDataUnits'][vnum] = 'K';
    plotInfo[pnum]['varShow'][vnum] = 'show';
    plotInfo[pnum]['varYaxis'][vnum] = 'left';
    plotInfo[pnum]['varYscaleFactor'][vnum] = 1;

    // plot 3 info
    pnum = 3;
    plotInfo[pnum] = new Object();
    plotInfo[pnum]['type'] = 'canvas';
    plotInfo[pnum]['title'] = 'hot side color canvas';
    plotInfo[pnum]['canvas'] = 'canvas_CANVAS_hot'; // without prefix #
    // for canvas type, all data comes from one process unit and one local array
    plotInfo[pnum]['varUnitIndex'] = unum; // index of unit in processUnits object
    plotInfo[pnum]['var'] = 0; // variable number in data array for plot; 0, 1, etc.
    // varTimePts & varSpacePts must match values used in unit array colorCanvasData
    plotInfo[pnum]['varTimePts'] = processUnits[unum]['numNodes'];
    plotInfo[pnum]['varSpacePts'] = 1;
    plotInfo[pnum]['varValueMin'] = 320; // processUnits[unum]['dataMin'][1]; // [1] is TinCold
    plotInfo[pnum]['varValueMax'] = 450; // processUnits[unum]['dataMax'][0]; // [0] is TinHot
    plotInfo[pnum]['xAxisReversed'] = 1; // 0 false, 1 true, when true, xmax on left

    // plot 4 info
    pnum = 4;
    plotInfo[pnum] = new Object();
    plotInfo[pnum]['type'] = 'canvas';
    plotInfo[pnum]['title'] = 'cold side color canvas';
    plotInfo[pnum]['canvas'] = 'canvas_CANVAS_cold'; // without prefix #
    // for canvas type, all data comes from one process unit and one local array
    plotInfo[pnum]['varUnitIndex'] = unum; // index of unit in processUnits object
    plotInfo[pnum]['var'] = 1; // variable number in array for plot: 0, 1, etc.
    // varTimePts & varSpacePts must match values used in unit array colorCanvasData
    plotInfo[pnum]['varTimePts'] = processUnits[unum]['numNodes'];
    plotInfo[pnum]['varSpacePts'] = 1;
    plotInfo[pnum]['varValueMin'] = 320; // processUnits[unum]['dataMin'][1]; // [1] is TinCold
    plotInfo[pnum]['varValueMax'] = 450; // processUnits[unum]['dataMax'][0]; // [0] is TinHot
    plotInfo[pnum]['xAxisReversed'] = 1; // 0 false, 1 true, when true, xmax on left

  }, // end initialize method of plotInfo

} // end plotInfo
