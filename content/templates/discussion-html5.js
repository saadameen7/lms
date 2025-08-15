// Constants
var _currentpage = window.parent.getCurrentPage();
var _fadespeed = 800;

// Variables

var answers = [];

// JSON Settings & Language Strings
var _answers = _currentpage.content.answers;
var shuffle = _currentpage.settings.shuffle;
var str_question = _currentpage.content.question;
var hasSpeaker = _currentpage.settings.speaker;

// Functions

function initDiscussionPage() {
	
	// Console Log
	
	console.log("Init HTML5 Discussion Page");
	
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
	$('#headline').append(img.result).append(p);
	
	// Interactions
	
	$('.discussionEntries').html('');
	
	for(var i = 0; i<_answers.length; i++) {
		var _answer = {
			"id":"answer_"+(i+1),
			"type":_answers[i].status,
			"text":_answers[i].text,
			"feedback":_answers[i].feedback,
			"dom":'',
			"selected":false
		}
		
		_answer.dom = '<div class="discussionEntry" id="'+_answer.id+'">&#8618 '+_answer.text+'</div>';

		answers.push(_answer);
	}
	
	$('.textBlock').css('width','auto');
	$('.textBlock').css('max-width','900px');
	
	if(shuffle) {
		var _randAnswers = answers;
		shuffleArray(_randAnswers);
		for(var i = 0; i<_randAnswers.length;i++) {
			$('.discussionEntries').append(_randAnswers[i].dom);
		}
	} else {
		for(var i = 0; i<answers.length;i++) {
			$('.discussionEntries').append(answers[i].dom);
		}
	}
	
	for(var i = 0; i<answers.length;i++) {
		$('#'+answers[i].id).on('click',function() {
			answerClick($(this).attr("id"));
		});
		$('#'+answers[i].id).hover(function() {
			$(this).addClass('hoverOver');
		},function() {
			$(this).removeClass('hoverOver');
		});
	}
	
	$('.discussionEntries').fadeIn(700);
	
}

function answerClick(id) {
	for(var i = 0; i<answers.length; i++) {
		if(id === answers[i].id) {
			var _title = "";
			var _feedback = answers[i].feedback;
			var _class = "";
			if(answers[i].type === "correct" | answers[i].type === "right") {
				_class = "btn-success";
				_title = window.parent.lang(window.parent.jsonLanguage.tasks.titleFeedbackCorrect);
			} else if (answers[i].type === "wrong") {
				_class = "btn-danger";
				_title = window.parent.lang(window.parent.jsonLanguage.tasks.titleFeedbackWrong);
			} else if (answers[i].type === "neutral") {
				_class = "btn-default";
				//console.log("Neutral answer: " + window.parent.jsonLanguage.tasks.titleFeedbackNeutral);
				_title = window.parent.lang(window.parent.jsonLanguage.tasks.titleFeedbackNeutral);
			}

			window.parent.bootbox.dialog({
				title: _title,
				message: _feedback,
				closeButton: true,
				backdrop: true,
				onEscape: true,
				buttons: {
					confirm: {
						label: window.parent.lang(window.parent.jsonLanguage.tasks.buttonFeedbackCorrect),
						className: _class
					}
				}
			}).find('.modal-content').css({
				'margin-top': 160 + "px"
			});
		}
	}
	window.parent.highlightNext();
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