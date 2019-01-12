function puWaterTank(pUnitIndex) {
  // constructor function for process unit

  // *********************************************
  // define PRIVATE variables >> use "let " before
  // *********************************************

  let unitIndex = pUnitIndex; // index of this unit as child in parent object processUnits
  // unitIndex may be used in this object's updateUIparams() method

  // DISPLAY CONNECTIONS FROM THIS UNIT TO HTML UI CONTROLS, see updateDisplay below
  let theDisplayWaterDivID = "#div_water";
  // theDisplayWaterDivBtm = SUM orig CSS file specs of top+height pixels for water div
  let theDisplayWaterDivBtm = 268; // PIXELS, bottom of html water div IN PIXELS

  // allow this unit to take more than one step within one main loop step in updateState method
  let unitStepRepeats = 1;
  let unitTimeStep = simParams.simTimeStep / unitStepRepeats;

  let ssCheckSum = 0; // used in this.checkForSteadyState() method
  let flowRate = 0; // input flow rate from feed process unit
  let command = 0; // input command from controller process unit

  // *******************************************
  // define PRIVATE methods >> use "let " before
  // *******************************************

  // INPUT CONNECTIONS TO THIS UNIT FROM OTHER UNITS, used in updateInputs() method
  let getInputs = function() {
    let inputs = [];
    // *** e.g., inputs[0] = processUnits[1]['Tcold'][0];
    inputs[0] = processUnits[0].flowRate; // input flowRate from feed process unit
    inputs[1] = processUnits[2].command; // command from controller process unit
    return inputs;
  }

  // *******************************************
  // define PUBLIC variables >> use this. prefix
  // *******************************************

  this.name = 'process unit Water Tank'; // used by interfacer.copyData()
  this.level = 0; // water level in this tank used by controller process unit
  this.residenceTime = 0; // used by controller.checkForSteadyState()

  // define arrays to hold info for variables
  // all used in interfacer.getInputValue() &/or interfacer.copyData() &/or plotInfo obj
  // these will be filled with values in method initialize()
  this.dataHeaders = []; // variable names
  this.dataInputs = []; // input field ID's
  this.dataUnits = [];
  this.dataMin = [];
  this.dataMax = [];
  this.dataInitial = [];
  this.dataValues = [];

  // define arrays to hold data for plots, color canvas
  // these arrays will be used by plotter object
  // these will be filled with initial values in method reset()
  //
  // this.profileData = []; // for profile plots, plot script requires this name
  this.stripData = []; // for strip chart plots, plot script requires this name
  // this.colorCanvasData = []; // for color canvas, plot script requires this name

  // *****************************************
  // define PUBLIC methods >> use this. prefix
  // *****************************************

  this.initialize = function() {
    //
    // OPTIONAL - add entries for output variables if want to use info
    //            to constrain data in updateState or units in plotInfo
    //
    // SPECIAL - in this unit no UI inputs - input only from feed & controller
    //
    // OPTIONAL - add entries for output variables if want to use min-max to
    //            constrain values in updateState or dimensional units in plotInfo
    //
  } // END of initialize() method

  this.reset = function() {
    //
    // On 1st load or reload page, the html file fills the fields with html file
    // values and calls reset, which needs updateUIparams to get values in fields.
    // On click reset button but not reload page, unless do something else here,
    // reset function will use whatever last values user has entered.

    this.updateUIparams(); // this first, then set other values as needed

    // set state variables not set by updateUIparams() to initial settings

    this.residenceTime = 10;  // used in controller.checkForSteadyState() method

    // each unit has its own data arrays for plots and canvases

    // initialize strip chart data array
    // initPlotData(numStripVars,numStripPts)
    let numStripVars = 1; // flowRate
    let numStripPts = plotInfo[0]['numberPoints'];
    this.stripData = plotter.initPlotData(numStripVars,numStripPts);

    // update display
    this.updateDisplay();

  } // END of reset() method

  this.updateUIparams = function() {
    //
    // GET INPUT PARAMETER VALUES FROM HTML UI CONTROLS
    // SPECIFY REFERENCES TO HTML UI COMPONENTS ABOVE in this unit definition
    //
    // SPECIAL - NONE FOR THIS UNIT

    // need to reset controller.ssFlag to false to get sim to run
    // after change in UI params when previously at steady state
    controller.resetSSflagsFalse();
    // set ssCheckSum != 0 used in checkForSteadyState() method to check for SS
    ssCheckSum = 1;

  } // END of updateUIparams() method

  this.updateInputs = function() {
    //
    // GET INPUT CONNECTION VALUES FROM OTHER UNITS FROM PREVIOUS TIME STEP,
    //   SINCE updateInputs IS CALLED BEFORE updateState IN EACH TIME STEP
    // SPECIFY REFERENCES TO INPUTS ABOVE in this unit definition

    // check for change in overall main time step simTimeStep
    unitTimeStep = simParams.simTimeStep / unitStepRepeats;

    // *** GET REACTOR INLET T FROM COLD OUT OF HEAT EXCHANGER ***
    // get array of current input values to this unit from other units
    let inputs = getInputs();
    flowRate = inputs[0]; // input water flow rate from feed unit
    command = inputs[1]; // command from controller unit

  } // END of updateInputs() method

  this.updateState = function() {
    //
    // BEFORE REPLACING PREVIOUS STATE VARIABLE VALUE WITH NEW VALUE, MAKE
    // SURE THAT VARIABLE IS NOT ALSO USED TO UPDATE ANOTHER STATE VARIABLE HERE -
    // IF IT IS, MAKE SURE PREVIOUS VALUE IS USED TO UPDATE THE OTHER
    // STATE VARIABLE
    //
    // WARNING: this method must NOT contain references to other units!
    //          get info from other units ONLY in updateInputs() method

    // compute new value of level
    // here have normally open valve
    // increasing command to valve results in decreasing valve coefficient

    let Ax = 10; // cross sectional area of tank
    let maxValveCoeff = 3;
    let newCoef = maxValveCoeff*(1 - command);

    if (newCoef > maxValveCoeff) {
      newCoef = maxValveCoeff;
    }
    if (newCoef < 0) {
      newCoef = 0;
    }

    let exprValue = (this.level +
      unitTimeStep / Ax * (flowRate - newCoef * Math.pow(this.level,0.5)));

    // make sure within limits
    // see puWaterController function updateInputs, maxSPvalue, minSPvalue
    if (exprValue > 2){exprValue = 2}
    if (exprValue < 0){exprValue = 0}

    // set new value
    this.level = exprValue;

  } // END of updateState() method

  this.updateDisplay = function() {
    // update display elements which only depend on this process unit
    // except do all plotting at main controller updateDisplay
    // since some plots may contain data from more than one process unit

    // SET LEVEL OF WATER IN TANK
    //    css top & left sets top-left of water rectangle
    //    from top of browser window - can't use css bottom because
    //    that is from bottom of browser window (not bottom rect from top window)
    //    and bottom of browser window can be moved by user,
    //    so must compute new top value to keep bottom of water rect
    //    constant value from top of browser window
    let pixPerHtUnit = 48; // was 50
    let newHt = pixPerHtUnit * this.level;
    let origBtm = theDisplayWaterDivBtm;
    let el = document.querySelector(theDisplayWaterDivID);
    el.style.height = newHt + "px";
    el.style.top = (origBtm - newHt) + "px";

    // HANDLE STRIP CHART DATA

    let v = 0; // used as index
    let p = 0; // used as index
    let tempArray = [];
    let numStripPoints = plotInfo[0]['numberPoints'];
    let numStripVars = 1; // only the variables from this unit

    // handle level
    v = 0;
    tempArray = this.stripData[v]; // work on one plot variable at a time
    // delete first and oldest element which is an [x,y] pair array
    tempArray.shift();
    // add the new [x.y] pair array at end
    tempArray.push( [0,this.level] );
    // update the variable being processed
    this.stripData[v] = tempArray;

    // re-number the x-axis values to equal time values
    // so they stay the same after updating y-axis values
    let timeStep = simParams.simTimeStep * simParams.simStepRepeats;
    for (v = 0; v < numStripVars; v += 1) {
      for (p = 0; p <= numStripPoints; p += 1) { // note = in p <= numStripPoints
        // note want p <= numStripPoints so get # 0 to  # numStripPoints of points
        // want next line for newest data at max time
        this.stripData[v][p][0] = p * timeStep;
        // want next line for newest data at zero time
        // this.stripData[v][p][0] = (numStripPoints - p) * timeStep;
      }
    }

  } // END of updateDisplay() method

  this.checkForSteadyState = function() {
    // required - called by controller object
    // *IF* NOT used to check for SS *AND* another unit IS checked,
    // which can not be at SS, *THEN* return ssFlag = true to calling unit
    // returns ssFlag, true if this unit at SS, false if not
    // uses and sets ssCheckSum
    // ssCheckSum can be set by reset() and updateUIparams()
    // check for SS in order to save CPU time when sim is at steady state
    // check for SS by checking for any significant change in array end values
    // but wait at least one residence time after the previous check
    // to allow changes to propagate down unit
    //
    // multiply all numbers by a factor to get desired number significant
    // figures to left decimal point so toFixed() does not return string "0.###"
    // WARNING: too many sig figs will prevent detecting steady state
    //
    let rc = 1.0e3 * flowRate;
    let rt = 1.0e3 * command;
    let lt = 1.0e3 * this.level;
    rc = rc.toFixed(0); // strings
    rt = rt.toFixed(0);
    lt = lt.toFixed(0);
    // concatenate strings
    let newCheckSum = rc +'.'+ rt +'.'+ lt;
    //
    let oldSScheckSum = ssCheckSum;
    let ssFlag = false;
    if (newCheckSum == oldSScheckSum) {ssFlag = true;}
    ssCheckSum = newCheckSum; // save current value for use next time
    //
    return ssFlag;
  } // END checkForSteadyState method

} // END of puWaterTank
