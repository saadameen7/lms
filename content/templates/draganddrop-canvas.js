// ##########################
// Variables
// ##########################

var btnEvaluate,btnSolution,btnMySolution = null;
var targets = [];
var solutions = [];
var maxAttempts = window.parent.getCurrentPage().settings.numAttempts;
var attempts = 0;
var resetSolutions = "";
var showQuestionText = true;
var demoMode = false;
var defaultPaddings = [30,20];
var buttonGap = 10;
var hasSpeaker = false;

// Strings
var str_wrong = window.parent.getCurrentPage().content.feedbackWrong;
var str_wrong_repeat = window.parent.getCurrentPage().content.feedbackWrongRepeat;
var str_correct = window.parent.getCurrentPage().content.feedbackCorrect;

var str_question = window.parent.getCurrentPage().content.question;

var str_evaluate = window.parent.lang(window.parent.jsonLanguage.tasks.evaluate);
var str_retry = window.parent.lang(window.parent.jsonLanguage.tasks.retry);
var str_solution = window.parent.lang(window.parent.jsonLanguage.tasks.solution);
var str_mysolution = window.parent.lang(window.parent.jsonLanguage.tasks.mySolution);

// ##########################
// Constants
// ##########################

var SOLUTION_TO_START_SPEED = 600;
var SOLUTION_TO_TARGET_SPEED = 400;
var PAGE_PATH = window.parent.getCurrentPage().path;

// ##########################
// Functions
// ##########################

if(window.parent.getCurrentPage().settings.speaker) {
	hasSpeaker = true;
	window.parent.loadAudioFiles(false,[{
		id:"speaker",
		path:"speaker.mp3"
	}]);
}
function initCore() {

	// ##########################
	// Create Elements
	// ##########################
	
	if(showQuestionText) {
		$('#dom_overlay_container').html('<div id="questiontext" style="margin:0;padding:0;color:#333333;line-height:20px;font-family:Arial,sans-serif; font-size:14px; width:'+window.parent.getCurrentPage().settings.questionPosition[2]+'px;position:absolute;left:'+window.parent.getCurrentPage().settings.questionPosition[0]+'px;top:'+window.parent.getCurrentPage().settings.questionPosition[1]+'px;"><p style="margin:0;padding:0">'+window.parent.getCurrentPage().content.question+'</p></div>');
		$('#dom_overlay_container').fadeIn(1000);
	}

	// ##########################
	// Init Targets & Solutions
	// ##########################

	// Solutions
	for(var i = 0; i < window.parent.getCurrentPage().content.solutions.length; i++) {
		var obj = new Object();
		obj.id = window.parent.getCurrentPage().content.solutions[i].id;
		obj.currentTarget = "";
		obj.correctTargets = [];
		obj.mc = that[obj.id];
		obj.mc.id = obj.id;
		obj.mc.startX = obj.mc.x;
		obj.mc.startY = obj.mc.y;
		obj.mc.mouseChildren = false;
		obj.mc.cursor = "pointer";
		
		solutions.push(obj);
	}
	
	// Targets
	for(var i = 0; i < window.parent.getCurrentPage().content.targets.length; i++) {
		var obj = new Object();
		obj.id = window.parent.getCurrentPage().content.targets[i].id;
		obj.mc = that[obj.id];
		obj.mc.id = obj.id;
		obj.currentSolution = "";
		obj.solutions = window.parent.getCurrentPage().content.targets[i].solutions;
		
		targets.push(obj);
	}
	
	// Misc
	
	for(var i = 0; i<solutions.length; i++) {
		for(var j = 0; j<targets.length; j++) {
			for(var k = 0; k<targets[j].solutions.length; k++) {
				if(solutions[i].id == targets[j].solutions[k]) {
					solutions[i].correctTargets.push(targets[j].id);
				}
			}
		}
	}
	
	for(var i = 0; i<solutions.length; i++) {
		solutions[i].mc.fade(true);
		//console.log("# "+solutions[i].id + ": " + solutions[i].correctTargets + " ("+solutions[i].correctTargets.length+")");
	}
	
	for(var i = 0; i<targets.length; i++) {
		targets[i].mc.fade(true);
		//console.log("# "+targets[i].id + ": " + targets[i].solutions + " ("+targets[i].solutions.length+")");
		//console.log("# "+targets[i].id + ": " + targets[i].mc.x + "/" + targets[i].mc.y);
	}
	
	// ##########################
	// Core Code
	// ##########################

	for(var i = 0; i<solutions.length; i++) {
		
		solutions[i].mc.on("mouseover", function() {
			this.alpha = .8;
		});
		
		solutions[i].mc.on("mouseout", function() {
			this.alpha = 1;
		});
		
		solutions[i].mc.on("mousedown", function(evt) {
			//stage.setChildIndex(this, stage.getNumChildren()-1);
			this.alpha = 0.8;
			this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
			resetSolution(this.id);					
		});
		
		solutions[i].mc.on("pressmove", function(evt) {
			if(pixelRatio != 1) {
				this.x = (evt.stageX/pixelRatio) - this.nominalBounds.width/2;
				this.y = (evt.stageY/pixelRatio) - this.nominalBounds.height/2;
			} else {
				this.x = evt.stageX + this.offset.x;
				this.y = evt.stageY + this.offset.y;
			}
		});
		
		solutions[i].mc.on("pressup", function(evt) {
			this.alpha = 1;
			var _this = getSolutionById(this.id);
			
			for(var j = 0; j<targets.length; j++) {
				//var dimensions = [targets[j].mc.x,targets[j].mc.x+this.nominalBounds.width,targets[j].mc.y,targets[j].mc.y + this.nominalBounds.height];
				var dimensions = [targets[j].mc.x,targets[j].mc.x+targets[j].mc.nominalBounds.width,targets[j].mc.y,targets[j].mc.y + targets[j].mc.nominalBounds.height];
				var mX = evt.stageX;
				var mY = evt.stageY;
				
				if(pixelRatio != 1) {
					mX = evt.stageX/pixelRatio;
					mY = evt.stageY/pixelRatio;
				}
				
				//console.log("Mouse position: " + mX + "/" + mY + " | " + "From X: " + dimensions[0] + " to " + dimensions[1] + " and from Y: " + dimensions[2] + " to " + dimensions[3]);
				
				if(mX > dimensions[0] && mX < dimensions[1] && mY > dimensions[2] && mY < dimensions[3] && targets[j].currentSolution == "") {
					//console.log(targets[j].id + " has been hit by " + _this.id + " (Correct Target: "+targets[j].solutions + ")");
					targets[j].currentSolution = _this.id;
					_this.currentTarget = targets[j].id;
					break;
				} else {
					//console.log("No hit");
				}
			}

			if(_this.currentTarget == "") {
				moveToStart(_this.id);
			} else {
				moveSolutionToTarget(_this.id,_this.currentTarget);
			}
		});
	}
	if(hasSpeaker) {
		window.parent.playAudio();
	}

	createEvaluateButton();
}


function createEvaluateButton() {
	
	if(btnEvaluate == null) {
		btnEvaluate = that.addChild(new Button(window.parent.lang(window.parent.jsonLanguage.tasks.evaluateDragAndDrop),"medium",function() {
			var _this = this;
			//console.log("Evaluation process...");
		
			attempts++;
			
			var correctEntries = 0;
			for(var i = 0; i < targets.length; i++) {
				if(isTargetCorrect(targets[i].id)) {
					correctEntries++;
				}
			}
			
			//console.log(correctEntries + " / " + targets.length);
			
			if(correctEntries == targets.length) {
				for(var i = 0; i < solutions.length; i++) {
					deactivate(solutions[i].mc);
				}
				window.parent.showFeedbackMessage(window.parent.lang(window.parent.jsonLanguage.tasks.titleFeedbackCorrect),window.parent.lang(window.parent.jsonLanguage.tasks.buttonFeedbackCorrect), str_correct,true);			
				that.highlightNext();
				this.removeAllEventListeners();
				this.fade(false);
			} else {
				// If there are attempts left
				if(attempts < maxAttempts | maxAttempts == 0) {
					window.parent.bootbox.alert({ 
						title: window.parent.lang(window.parent.jsonLanguage.tasks.titleFeedbackWrong),
						size: "small",
						message: str_wrong_repeat,
						buttons: {
								ok: {
									label: window.parent.lang(window.parent.jsonLanguage.tasks.buttonFeedbackWrongRepeat),
									className: 'btn-danger'
								}
							},
						callback: function(result){
							if(resetSolutions == "yes" | resetSolutions == "true") {
								for(var i = 0; i < solutions.length; i++) {
									moveToStart(solutions[i].id);
									resetSolution(solutions[i].id);
								}
							} else if(resetSolutions == "no" | resetSolutions == "false") {
								// Do nothing
							} else if(resetSolutions == "onlyWrong") {
								for(var i = 0; i < targets.length; i++) {
									if(!isTargetCorrect(targets[i].id) && targets[i].currentSolution != "") {
										moveToStart(targets[i].currentSolution);
										resetSolution(targets[i].currentSolution);
									} 	
								}
							}
						}
					}).find('.modal-content').css({
						'margin-top':'200px'
					});
				// No attempts left
				} else {
					window.parent.bootbox.alert({ 
						title: window.parent.lang(window.parent.jsonLanguage.tasks.titleFeedbackWrong),
						size: "small",
						message: str_wrong,
						buttons: {
								ok: {
									label: window.parent.lang(window.parent.jsonLanguage.tasks.buttonFeedbackWrong),
									className: 'btn-danger'
								}
							},
						callback: function(result){
							for(var i = 0; i < solutions.length; i++) {
								deactivate(solutions[i].mc);
							}
							_this.removeAllEventListeners();
							_this.fade(false);
							createSolutionButtons();
						}
					}).find('.modal-content').css({
						'margin-top':'200px'
					});
				}
			}
		}));
		
		if(window.parent.getCurrentPage().settings.buttonPosition !== undefined) {
			btnEvaluate.x = that.stageWidth - btnEvaluate._width - Number(window.parent.getCurrentPage().settings.buttonPosition[0]);
			btnEvaluate.y = that.stageHeight - btnEvaluate._height - Number(window.parent.getCurrentPage().settings.buttonPosition[1]);
		} else {
			btnEvaluate.x = that.stageWidth - btnEvaluate._width - defaultPaddings[0];
			btnEvaluate.y = that.stageHeight - btnEvaluate._height - defaultPaddings[1];
		}
	}
}

function createSolutionButtons() {

	var _solutionTargets = [];
	
	for(var i = 0; i<solutions.length; i++) {
		_solutionTargets[i] = solutions[i].currentTarget;

	}
	
	btnSolution = that.addChild(new Button(window.parent.lang(window.parent.jsonLanguage.tasks.solution),"medium",function() {
		that.highlightNext();
		deactivate(this,0.4);
		activate(btnMySolution,1);
		
		
		// Step #1 - Reset Solutions
		
		for(var i = 0; i<solutions.length; i++) {
			// Every solution without a target is being sent back
			if(solutions[i].correctTargets.length == 0) {
				if(solutions[i].currentTarget != "") {
					resetSolution(solutions[i].id);
				}
				moveToStart(solutions[i].id);
			// Solution with targets...
			} else {
				// If solution is on the wrong target
				if(!isSolutionCorrect(solutions[i].id)) {
					resetSolution(solutions[i].id);
				}
			}
		}
		
		// Step #2 - Move Solutions
		
		if(!demoMode) {
			for(var i = 0; i<solutions.length; i++) {
			
				if(solutions[i].correctTargets.length > 0 && solutions[i].currentTarget == "") {
					for(var j = 0; j<solutions[i].correctTargets.length; j++) {
						if(!isTargetCorrect(solutions[i].correctTargets[j])) {
							getSolutionById(solutions[i].id).currentTarget = solutions[i].correctTargets[j];
							getTargetById(solutions[i].correctTargets[j]).currentSolution = solutions[i].id;
							
							getSolutionById(solutions[i].id).finalTarget = solutions[i].correctTargets[j];
	
							moveSolutionToTarget(solutions[i].id,solutions[i].correctTargets[j]);
							break;
						}
					}
				}
			}
			demoMode = true;
		} else {
			for(var i = 0; i<solutions.length; i++) {
				if(solutions[i].finalTarget != undefined) {
					moveSolutionToTarget(solutions[i].id,solutions[i].finalTarget);
				}
				
			}
		}
		
	}));
	
	btnMySolution = that.addChild(new Button(window.parent.lang(window.parent.jsonLanguage.tasks.mySolution),"medium",function() {
		deactivate(this,0.4);
		activate(btnSolution,1);
		
		for(var i = 0; i<solutions.length; i++) {
			if(_solutionTargets[i] == "") {
				moveToStart(solutions[i].id);
			} else {
				moveSolutionToTarget(solutions[i].id,_solutionTargets[i]);
			}
		}
		
	},"disable"));
	
	// Positioning
	
	if(window.parent.getCurrentPage().settings.buttonPosition !== undefined) {
		btnMySolution.x = that.stageWidth - btnMySolution._width - Number(window.parent.getCurrentPage().settings.buttonPosition[0]);
		btnMySolution.y = that.stageHeight - btnMySolution._height - Number(window.parent.getCurrentPage().settings.buttonPosition[1]);
	} else {
		btnMySolution.x = that.stageWidth - btnMySolution._width - defaultPaddings[0];
		btnMySolution.y = that.stageHeight - btnMySolution._height - defaultPaddings[1];
	}
	
	btnSolution.x = btnMySolution.x - btnSolution._width - buttonGap;
	btnSolution.y = btnMySolution.y;
	
}

// ##########################
// Helpful Functions
// ##########################

function isSolutionCorrect(sId) {
	var _solution = getSolutionById(sId);
	
	for(var i = 0; i<_solution.correctTargets.length; i++) {
		if(_solution.currentTarget == _solution.correctTargets[i]) {
			return true;
		}
	}
	return false;
}

function isTargetCorrect(tId) {
	var _target = getTargetById(tId);
	
	for(var i = 0; i<_target.solutions.length; i++) {
		if(_target.currentSolution == _target.solutions[i]) {
			return true;
		}
	}
	return false;
}

function resetSolution(id) {
	var _solution = getSolutionById(id);
	if(_solution.currentTarget != "") {
		var _target = getTargetById(_solution.currentTarget);
		_target.currentSolution = "";
		_solution.currentTarget = "";
	} 
}

function getTargetById(id) {
	for(var i = 0; i< targets.length; i++) {
		if(targets[i].id == id) {
			return targets[i];
		}
	}
	console.log("No target with this ID. Returing first target.");
	return targets[0];
}

function getSolutionById(id) {
	for(var i = 0; i<solutions.length; i++) {
		if(solutions[i].id == id) {
			return solutions[i];
		}
	}

	console.log("No solution with this ID. Returing first solution.");
	return solutions[0];
}

function moveToStart(id) {
	var _solution = getSolutionById(id).mc;
	createjs.Tween.get(_solution).to({x: _solution.startX, y: _solution.startY},SOLUTION_TO_START_SPEED,createjs.Ease.getPowInOut(2));
}

function moveSolutionToTarget(sId,tId) {
	createjs.Tween.get(getSolutionById(sId).mc).to({x: getTargetById(tId).mc.x, y: getTargetById(tId).mc.y},SOLUTION_TO_TARGET_SPEED,createjs.Ease.getPowInOut(2));
}

function deactivate(obj,_alpha) {
	obj.enable = false;
	obj.mouseEnabled = false;
	if(_alpha != undefined) {
		createjs.Tween.get(obj).to({alpha: _alpha},600,createjs.Ease.getPowInOut(2));
	} else {
		obj.alpha = 1;
	}

}

function activate(obj,_alpha) {
	obj.enable = true;
	obj.mouseEnabled = true;
	if(_alpha != undefined) {
		createjs.Tween.get(obj).to({alpha: _alpha},600,createjs.Ease.getPowInOut(2));
	} else {
		obj.alpha = 1;
	}
}
