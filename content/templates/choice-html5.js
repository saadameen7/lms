// Constants
var _currentpage = window.parent.getCurrentPage();
var _fadespeed = 800;

// Variables
var multipleChoice = false;
var answers = [];
var currentAttempt = 1;
var correctAnswers = 0;
var textWidth = window.parent.contentWidthWide - 150;

// JSON Settings & Language Strings
var _answers = _currentpage.content.answers;
var numAttempts = _currentpage.settings.numAttempts;
var shuffle = _currentpage.settings.shuffle;
var hasSpeaker = _currentpage.settings.speaker;

var str_wrong = _currentpage.content.feedbackWrong;
var str_wrong_repeat = _currentpage.content.feedbackWrongRepeat;
var str_correct = _currentpage.content.feedbackCorrect;
var str_question = _currentpage.content.question;

var str_evaluate = window.parent.lang(window.parent.jsonLanguage.tasks.evaluate);
var str_retry = window.parent.lang(window.parent.jsonLanguage.tasks.retry);
var str_solution = window.parent.lang(window.parent.jsonLanguage.tasks.solution);
var str_mysolution = window.parent.lang(window.parent.jsonLanguage.tasks.mySolution);


// Functions

function initChoicePage() {
	
	// Console Log
	
	console.log("Init HTML5 Choice Page");
	
	// Play audio
	
	if(hasSpeaker !== undefined) {
		if(hasSpeaker) {
			window.parent.playAudio();
		} else {
			console.log("No spoken text");
		}
	}
	
	// Initialization
	
	var img = getPageImageById("task-mouse");
	var p = '<p>'+str_question+'</p>';
	
	$('#headline').append(p);
	$('#btnEvaluate').html(str_evaluate);
	$('#btnSolution').html(str_solution);
	$('#btnMySolution').html(str_mysolution);
	
	$(img.result).css({display:'none'});
	$('#headline').append(img.result);
	
	defaultFadeIn($(img.result));
	
	
	// Choice type detection
	
	var _cacount = 0;
	for(var i = 0; i<_answers.length; i++) {
		if(_answers[i].correct) _cacount++;
	}
	if(_cacount > 1) {
		multipleChoice = true;
	} 
	
	// Interactions
	
	if(!multipleChoice) {
		// Single Choice

		$('.radioButtons').html('');
		for(var i = 0; i<_answers.length; i++) {
			var _answer = {
				"id":"answer_"+(i+1),
				"correct":_answers[i].correct,
				"text":_answers[i].text,
				"dom":'',
				"selected":false
			}
			
			_answer.dom = '<div class="radio"><label><input type="radio" class="radioDefault" name="radioButton" id="'+_answer.id+'" value="'+_answer.id+'"><div id="'+_answer.id+'_text'+'" class="textBlock">'+_answer.text+'</div></label></div>';

			answers.push(_answer);
		}
		
		if(shuffle) {
			var _randAnswers = answers;
			shuffleArray(_randAnswers);
			for(var i = 0; i<_randAnswers.length;i++) {
				$('.radioButtons').append(_randAnswers[i].dom);
			}
		} else {
			for(var i = 0; i<answers.length;i++) {
				$('.radioButtons').append(answers[i].dom);
			}
		}

		$('input[type="radio"]').click(function() {
			if($('#btnEvaluate').hasClass("disabled")) {
				$('#btnEvaluate').removeClass("disabled");
			}
			selectRadioButton($(this).val());
		});

		//$('.radioButtons').fadeIn(_fadespeed);
		//defaultFadeIn('.radioButtons');
		$('.radioButtons').show();
		
	} else {
		// Multiple Choice
		$('.checkboxButtons').html('');
		if($('#btnEvaluate').hasClass("disabled")) {
			$('#btnEvaluate').removeClass("disabled");
		}
		for(var i = 0; i<_answers.length; i++) {
			var _answer = {
				"id":"answer_"+(i+1),
				"correct":_answers[i].correct,
				"text":_answers[i].text,
				"dom":'',
				"selected":false
			}
			
			_answer.dom = '<div class="checkbox"><label><input type="checkbox" class="checkboxDefault" name="checkboxButton" id="'+_answer.id+'" value="'+_answer.id+'"><div id="'+_answer.id+'_text'+'" class="textBlock">'+_answer.text+'</div></label></div>';

			answers.push(_answer);
		}
		
		if(shuffle) {
			var _randAnswers = answers;
			shuffleArray(_randAnswers);
			for(var i = 0; i<_randAnswers.length;i++) {
				$('.checkboxButtons').append(_randAnswers[i].dom);
			}
		} else {
			for(var i = 0; i<answers.length;i++) {
				$('.checkboxButtons').append(answers[i].dom);
			}
		}

		$('input[type="checkbox"]').click(function() {
			selectCheckboxButton($(this));
		});
		
		//defaultFadeIn('.checkboxButtons');
		$('.checkboxButtons').show();
	}
	
	// Evaluate Button
	
	$('#btnEvaluate').on("click",function() {
		// Only trigger if button is not disabled
		if(!$(this).hasClass("disabled")) {
			correctAnswers = 0;
			for(var i = 0; i<answers.length; i++) {
				if(answers[i].correct) {
					if(answers[i].selected) {
						correctAnswers++;
					}
				} else {
					if(!answers[i].selected) {
						correctAnswers++;
					}
				}
			}
			
			if(correctAnswers == answers.length) {
				disableAnswers();
				window.parent.showFeedbackMessage(window.parent.lang(window.parent.jsonLanguage.tasks.titleFeedbackCorrect),window.parent.lang(window.parent.jsonLanguage.tasks.buttonFeedbackCorrect), str_correct,true);
				
				if(window.parent.isOption(window.parent.getCurrentPage().options,"mandatory")) {
					completeQuestion();
				}
				
				defaultFadeOut('#btnEvaluate');
				//$('#btnEvaluate').show();
				
				
			} else {
				if(currentAttempt >= numAttempts && numAttempts > 0) {
					// No attempts left
					disableAnswers();
					window.parent.showFeedbackMessage(window.parent.lang(window.parent.jsonLanguage.tasks.titleFeedbackWrong),window.parent.lang(window.parent.jsonLanguage.tasks.buttonFeedbackWrong), str_wrong,false);
					$(this).fadeOut(_fadespeed,function() {
						$('#btnSolution').fadeTo(_fadespeed,1);
						$('#btnSolution').removeClass("disabled");
						
						$('#btnMySolution').fadeTo(_fadespeed,0.5);
						$('#btnMySolution').addClass("disabled");
					});
				} else {
					// Attempts left
					window.parent.showFeedbackMessage(window.parent.lang(window.parent.jsonLanguage.tasks.titleFeedbackWrong),window.parent.lang(window.parent.jsonLanguage.tasks.buttonFeedbackWrongRepeat), str_wrong_repeat,false);
				}
			}

			currentAttempt++;
		} 
	});
	
	// Solution Button
	
	$('#btnSolution').on("click",function() {
		if(!$(this).hasClass("disabled")) {
			window.parent.highlightNext();
			toggleButton('#btnMySolution',true);
			toggleButton('#btnSolution',false);
			for(var i = 0; i<answers.length;i++) {
				$('#'+answers[i].id).prop("checked", false);
				$('#'+answers[i].id+"_text").removeClass("green");
				$('#'+answers[i].id+"_text").removeClass("red");
			}
			
			for(var i = 0; i<answers.length;i++) {
				if(answers[i].correct) {
					$('#'+answers[i].id+"_text").addClass("green");
					$('#'+answers[i].id).prop("checked", true);
				}
			}
		}
	});
	
	// My Solution Button
	
	$('#btnMySolution').on("click",function() {
		if(!$(this).hasClass("disabled")) {
			toggleButton('#btnMySolution',false);
			toggleButton('#btnSolution',true);
			
			for(var i = 0; i<answers.length;i++) {
				$('#'+answers[i].id).prop("checked", false);
				$('#'+answers[i].id+"_text").removeClass("green");
				$('#'+answers[i].id+"_text").removeClass("red");
			}
			
			for(var i = 0; i<answers.length;i++) {
				if(answers[i].selected) {
					$('#'+answers[i].id).prop("checked", true);
					if(answers[i].correct) {
						$('#'+answers[i].id+"_text").addClass("green");
					} else {
						$('#'+answers[i].id+"_text").addClass("red");
					}
				}
			}
		}
	});
	
	// Resize
	
	$('.textBlock').css('width','auto');
	$('.textBlock').css('max-width','900px');
	
	// Console Logs
	
	console.log("# Choice Page Options: Attempts: " + numAttempts + ", Shuffle: " + shuffle + ", Multiple Choice: " + multipleChoice + ", Number of answers: " + answers.length);
	
	defaultFadeIn('#content');
	
}

function disableAnswers() {
	for(var i = 0; i<answers.length;i++) {
		$('#'+answers[i].id).attr('disabled',true);
	}
}

function toggleButton(id,boo) {
	if(boo) {
		$(id).fadeTo(300,1);
		$(id).removeClass("disabled");
	} else {
		$(id).fadeTo(300,0.5);
		$(id).addClass("disabled");
	}
	
}

function selectRadioButton(id) {
	for(var i = 0; i<answers.length; i++) {
		if(answers[i].id != id) {
			answers[i].selected = false;
		} else {
			answers[i].selected = true;
		}
	}
}

function selectCheckboxButton(cb) {

	if(cb.prop("checked")) {
		for(var i = 0; i<answers.length; i++) {
			if(answers[i].id == cb.val()) {
				answers[i].selected = true;
			}
		}
	} else {
		for(var i = 0; i<answers.length; i++) {
			if(answers[i].id == cb.val()) {
				answers[i].selected = false;
			}
		}
	}
	
	/*
	for(var i = 0; i<answers.length; i++) {
		console.log(answers[i].id + ": " + answers[i].selected);	
	}
	*/
}

function shuffleArray(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
}

function completeQuestion() {
	
	var isIn = false;
	for(var j = 0; j<window.parent.mandatoryQuestionsDone.length; j++) {
		if(window.parent.getCurrentPage().id == window.parent.mandatoryQuestionsDone[j].id) {
			isIn = true;
		}
	}
	if(!isIn) {
		window.parent.mandatoryQuestionsDone.push(window.parent.getCurrentPage());
	}
	
	
	var percentageNeeded = window.parent.completionRequiredTestScore;
	var percentageGot = Math.floor(((window.parent.mandatoryQuestions.length/100)*window.parent.mandatoryQuestionsDone.length)*100);
	
	console.log("Task percentage: " + percentageGot + " of " + percentageNeeded +" %");
}

function getPageImageById(id) {
	for(var i = 0; i<pageImages.length; i++) {
		if(pageImages[i].id == id) {
			return pageImages[i];
		}
	}
	console.log("Wrong page image returned!");
	return pageImages[0];
}
/*
var _pic = pic.result;
$(_pic).css("position","absolute");
$(_pic).css("display","none");
$(_pic).css("pointerEvents", "none");
$(con).append(_pic);
*/