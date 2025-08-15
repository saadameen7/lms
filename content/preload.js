// #####################
// Variables
// #####################

var url = '';
var video = document.getElementById('video');
var nextDisabled = false;
//<tilo>
var prevDisabled = false;
//</tilo>
var customEventExists = false;
var customEvent = undefined;
var hasSpeakertext = false;
var pageImages = [];
var imageButtons = [];
var videoLoaded = true;
var imagesLoaded = true;
var audioLoaded = true;
var currentPage = window.parent.getCurrentPage();
var videoHasEnded = false;
var VIDEO_TIMEGAP = 420;
var IE_VIDEO_TIMEGAP = 940;

// #####################
// Initialization
// #####################

if(!window.parent.enableLogging) {
	console.log = function() {}
}

// #####################
// Functions
// #####################

function exists(obj) {
	if(obj !== undefined && obj !== null) {
		return true;
	} else {
		return false;
	}
}

function playAudio(id) {
	window.parent.playAudio(id);
}

function pauseAudio(id) {
	window.parent.pauseAudio(id);
}

function resumeAudio(id) {
	window.parent.resumeAudio(id);
}

function getAudioById(id) {
	return window.parent.getAudioById(id);
}

function loadMedia(obj) {

	// Reset variables
	videoLoaded, imagesLoaded, audioLoaded = true;
	customEvent = undefined;

	// Video

	if(exists(obj.video)) {
		videoLoaded = false;
		loadVideo(obj.video.path);
		//console.log(currentPage.nr + ": Video available");
	} else {
		//console.log(currentPage.nr + ": No video available. Resetting Frame size");
		window.parent.resetFrameSize();
	}

	// Images

	if(exists(obj.images)) {
		imagesLoaded = false;
		loadImages(obj.images);
		//console.log(currentPage.nr + ": Images available");
	} else {
		//console.log(currentPage.nr + ": No images available");
	}

	// Audio

	if(exists(obj.audio)) {
		audioLoaded = false;
		if(exists(obj.settings.speakerAudioAutostart)) {
			window.parent.loadAudioFiles(obj.settings.speakerAudioAutostart,obj.audio);
		} else {
			window.parent.loadAudioFiles(true,obj.audio);
		}
		//console.log(currentPage.nr + ": Audio available");
	} else {
		//console.log(currentPage.nr + ": No audio available");
	}

	// Loading SVG

	if(!exists(obj.video) && (exists(obj.images) | exists(obj.audio))) {
		window.parent.showLoadingAnimation();
	}

	// Speakertext

	if(exists(obj.settings.speakertext)) {
		if(obj.settings.speakertext) {
			hasSpeakertext = true;
			var speakerwidth = window.parent.fullFrameWidth - window.parent.contentWidthStandard - 26;

			$('#speakertext').css('font-size',window.parent.speakertextFontSize + 'px');
			$('#speakertext').css('width',speakerwidth+'px');

			if(exists(obj.settings.customSpeakertext)) {
				if(typeof(obj.settings.customSpeakertext) == 'string') {
					$('#speakertext').html(obj.settings.customSpeakertext);
				} else {
					$('#speakertext').html(window.parent.getCurrentPage().text);
				}
			} else {
				$('#speakertext').html(window.parent.getCurrentPage().text);
			}


		} else {
			hasSpeakertext = false;
		}
	} else {
		hasSpeakertext = false;
	}

	// Custom Events

	if(exists(obj.video)) {
		if(exists(obj.video.customEvents)) {
			if(obj.video.customEvents.length > 0) {
				console.log(currentPage.nr + ": Custom Events detected");
				var _time = [];
				var _actions = [];
				var _dismissActions = [];
				var _options = [];
				for(var i = 0; i<obj.video.customEvents.length; i++) {
					_time[i] = obj.video.customEvents[i].time;
					_actions[i] = obj.video.customEvents[i].action;
					_dismissActions[i] = obj.video.customEvents[i].dismissAction;
					if(obj.video.customEvents[i].options !== undefined) {
						_options[i] = obj.video.customEvents[i].options;
					} else {
						_options[i] = '';
					}

				}
				customEvent = createCustomEvents({
					time:_time,
					actions:_actions,
					dismissActions:_dismissActions,
					options:_options
				})
			}
		}
	}

	// Interval

	function intervalTrigger(_obj) {
		return window.setInterval( function() {
			if(window.parent.audioLoaded) {
				audioLoaded = true;
			}
			//console.log("Video Update: " + video.currentTime + "/" + video.duration + ", " + video.error + ", " + video.ended+ ", " + video.paused+ ", " + video.readyState);
			//console.log("Status: Video loaded: " + videoLoaded + ", Images loaded: " + imagesLoaded + ", Audio loaded: " + audioLoaded);

			if(videoLoaded && audioLoaded && imagesLoaded) {
				window.clearInterval(interval);
				window.parent.hideLoadingAnimation();

				if(hasSpeakertext) {

					if(window.parent.isIE11) {
						$('#speakertext').css({opacity:.01});
						$('#speakertext').show();
						$('#speakertext').animate({
							opacity:1
						},600);
					} else {
						$('#speakertext').stop(true,false).fadeIn(600);
					}

				}

				if(exists(_obj.video)) {
					if(_obj.video.autostart) {
						playVideo();
					}
				}

				if(typeof(_obj.action) === 'function') {
					_obj.action();
				}
			}
		}, 500 );
	};

	var interval = intervalTrigger(obj);
}

function playVideo() {
	if(arguments[0] !== undefined) {
		window.parent.playVideo(arguments[0]);
	} else {
		window.parent.playVideo();
	}

}

function pauseVideo() {
	var isPlaying = video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2;

	if (isPlaying) {
		video.pause();
	} else {
		// Do nothing
	}
}

function loadImages(arr) {

	var imagePath = "";
	var imageManifest = [];
	var imageCount = 0;

	if (window.parent.version === false | window.parent.version >= 11) {
		var queue = new createjs.LoadQueue(false,imagePath);
	} else {
		var queue = new createjs.LoadQueue(true,imagePath);
	}

	queue.on("fileload", handleImageLoad, this);
	queue.on("complete", handleImageComplete, this);


	for(var i = 0; i < arr.length; i++) {

		if(arr[i].numOfPictures !== undefined) {
			for(var j = 0; j<arr[i].numOfPictures; j++) {
				var file = {
					id:arr[i].id + (j+1),
					src:arr[i].path + (j+1) + "." + arr[i].suffix
				}
				imageCount++;
				imageManifest.push(file);
			}

		} else {
			var file = {
				id:arr[i].id,
				src:arr[i].path
			}
			imageCount++;
			imageManifest.push(file);
		}
	}

	if(arr.length > 1) {
		console.log("Loading " + imageCount + " images...");
	} else {
		console.log("Loading image...");
	}

	queue.loadManifest(imageManifest);

}

function loadImagesAndAction(arr,IDs,action) {

	var _imagesLoaded = false;

	function intervalTrigger() {
		return window.setInterval( function() {

			if(_imagesLoaded) {
				console.log("Special Images loaded");
				window.clearInterval(interval);
				_imagesLoaded = false;
				action();
			} else {
				console.log("Interval");
			}

		}, 500 );
	}

	var interval = intervalTrigger();

	var imagePath = "";
	var imageManifest = [];
	if (window.parent.version === false | window.parent.version >= 11) {
		var queue = new createjs.LoadQueue(false,imagePath);
	} else {
		var queue = new createjs.LoadQueue(true,imagePath);
	}

	queue.on("fileload", handleImageLoad, this);
	queue.on("complete", function() { _imagesLoaded = true; }, this);

	for(var i = 0; i < arr.length; i++) {
		var file = {
			id:IDs[i],
			src:arr[i]
		}
		imageManifest.push(file);
	}

	queue.loadManifest(imageManifest);

}


function handleImageLoad(event) {

	var obj = new Object();
	obj.item = event.item;
	obj.type = obj.item.type;
	obj.result = event.result;
	obj.id = event.item.id;

	//console.log("handleImageLoad: " + obj.id + ", " + obj.result.width + "," + obj.result.naturalWidth + ", " + obj.result.clientWidth + ", " + obj.result.complete);
	obj.size = [$(obj.result).prop('naturalWidth'),$(obj.result).prop('naturalHeight')];

	pageImages.push(obj);
}


function handleImageComplete(event) {
	console.log("All image files loaded.");
	imagesLoaded = true;
}


function imageInfo(id) {
	var img = getPageImageById(id);
	console.log("Image Info – ID: " + img.id + ", Size: [" + img.size + "]");
}

function placeImage(target,id,position,className) {

	var img = getPageImageById(id).result;

	$(img).css("position","absolute");
	$(img).css("display","none");
	$(img).css("pointerEvents", "none");
	$(img).offset({top:position[1],left:position[0]});

	if(typeof(className) !== undefined) {
		$(img).addClass(className);
	}

	$(target).append(img);
	$(img).fadeIn(FADE_SPEED);


}


function loadVideo(src) {
	url = src;
	loadVideoFully();
	//loadVideoWithoutBlob();
}

function loadVideoWithoutBlob(event) {

	window.parent.togglePageNavigation(false);

	video.src = url;

	initVideo();

}


function loadVideoFully(event) {

	window.parent.showLoadingAnimation();
	window.parent.togglePageNavigation(false);

	GET(url);

    function onLoad(event) {
		window.parent.hideLoadingAnimation();
		var type = 'video/mp4';
		var blob = new Blob([event.target.response], {
			type: type
		});

		video.type = type;

		var url = window.URL.createObjectURL(blob);
		video.autoplay = true;
		video.src = url;
		video.pause();

		initVideo();
    }

    function GET(url) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        xhr.responseType = 'arraybuffer';
        xhr.onload = onLoad;
        xhr.send();
    }

}

function cleanupAutoplay() {
	if ($(".div-autoplay").length) {
		$('.div-autoplay').stop(true,false).fadeOut(800);
	}
}

function showAutoplayScreen() {

	var _pa1 = '../../img/'+window.parent.language+"/";
	var _pa2 = 'autoplay-desktop.png';

	if(window.parent.isMobile) {
		_pa2 = 'autoplay-mobile.png';
	}

	var _imgpath = _pa1+_pa2;

	// src="img/'+language+'/navi-static.png"

	if ($(".div-autoplay").length) {
		$('.div-autoplay').stop(true,false).fadeOut(600);
		console.log("autoplay auslblendne und video starten");
		video.play();
	} else {
		$('body').append('<div class="div-autoplay"><img src="'+_imgpath+'"></div>')
		$('.div-autoplay').stop(true,false).fadeIn(400);
		$('.div-autoplay').on('click',function() {
			$(this).stop(true,false).fadeOut(600);
			video.play();
		});
	}

}

function initVideo() {

	window.parent.currentVideoPlayer = video;
	window.parent.currentFrameBody = $('body');

	// Speakertext height
	$('.auto').css('max-height',(window.parent.contentHeight + window.parent.speakertextBuffer) +'px');

	// Does not work in safari
	video.addEventListener('loadedmetadata', function(err) {

		console.log("Loaded Metadata...");

		if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
		     // Do Firefox-related activities
		} else {
			var is_safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
			if(is_safari) {
				// Do nothing
			} else {
				if (video.buffered.length === 0) return;
			}

		}

		document.getElementById('video').setAttribute('width',this.videoWidth);
		document.getElementById('video').setAttribute('height',this.videoHeight);

		if(this.videoWidth > 760) {
			window.parent.setFrameSize(this.videoWidth,this.videoHeight);
			//console.log("Setting Frame size to... " + this.videoWidth + ", " + this.videoHeight);
		} else {
			window.parent.resetFrameSize();
		}

		if($('.videoOverlay').length > 0) {
			$('.videoOverlay').css('width',this.videoWidth + 'px');
		}

		if (typeof hasSpeakertext === 'undefined' || hasSpeakertext === null || hasSpeakertext === false) {
		    // if there is no speaker text, center video
		} else {
			if(hasSpeakertext) {
				$('#video').removeClass('center-block');
			}
		}
	});

	if(customEvent !== undefined) {
		customEventExists = true;
		if($('.videoOverlay').length > 0) {
			$('.videoOverlay').show();
		}
	}

	// If video throws an error
	video.addEventListener('error', function(err){
		//console.log(video.error.code);
		//console.log(err);
		console.log("Video could not be loaded (Error Code: "+video.error.code+"). Trying to load fallback image...");
		console.log("Resetting Frame size");
		window.parent.resetFrameSize();
		$('#video-container').hide();

		window.parent.togglePlayPause(false);
		window.parent.toggleButton('#btn-reload',false);
		console.log(window.parent.getCurrentPage().type);

		var _class = 'placeholder-image-standard';
		var _placeholderImage = 'placeholder-standard.jpg';
		if(window.parent.getCurrentPage().type == 'posterpage' | window.parent.getCurrentPage().type == 'poster') {
			_class = 'placeholder-image-poster';
			_placeholderImage = 'placeholder-wide.jpg';
		}


		$('body').prepend('<img src="../../'+window.parent.contentPath+window.parent.getCurrentPage().path + '/placeholder.jpg" class="'+_class+'" style="display:none">');

		$('.'+_class).on("error", function() {
			$(this).attr('src','../../content/images/'+_placeholderImage);
		});


		$('#speakertext').css({opacity:.01});
		$('#speakertext').show();
		$('#speakertext').animate({
			opacity:1
		},600);

		$('.'+_class).css({opacity:.01});
		$('.'+_class).show();
		$('.'+_class).animate({
			opacity:1
		},600);

	});

	// Time update event
	video.addEventListener('timeupdate', function(err) {

		//console.log("Video Update: " + video.currentTime + "/" + video.duration + ", " + video.error + ", " + video.ended+ ", " + video.paused+ ", " + video.readyState);


		if(window.parent.allowControlsAfterWatching) {
			var currentPos = video.currentTime; // Get current time
			var maxduration = video.duration; // Get video duration
			var percentage = 100 * currentPos / maxduration; // in %

			var _isDone = window.parent.getCurrentPage().completed;

			//console.log(videoHasEnded + " | " + percentage + " | " + _isDone);

			if(videoHasEnded | percentage >= 99 | _isDone == true) {
				if(this.hasAttribute('controls')) {
					//console.log("Video already has controls...");
				} else {
					console.log("Adding controls to video...");
					this.setAttribute('controls','controls');
				}
			}
		}

		if(customEventExists) {
			for(var i = 0; i<customEvent.time.length; i++) {
				if(customEvent.time[i] == -1) {
					if(this.currentTime < (this.duration-1) && customEvent.active[i]) {
						customEvent.active[i] = false;
						customEvent.dismissActions[i]();
					}
				} else {
					if(this.currentTime <= customEvent.time[i] && customEvent.active[i]) {
						customEvent.active[i] = false;
						customEvent.dismissActions[i]();
					} else if(this.currentTime > customEvent.time[i] && !customEvent.active[i]) {
						customEvent.active[i] = true;
						customEvent.actions[i]();
					}
				}
			}
		}
	});

	// If video has ended
	video.addEventListener('ended', function() {
		videoHasEnded = true;

		var customEndingExists = false;
		if(customEventExists && !customEndingExists) {
			for(var i = 0; i<customEvent.time.length; i++) {
				if(customEvent.time[i] == -1) {
					customEndingExists = true;
					customEvent.actions[i]();
					customEvent.active[i] = true;

					if(customEvent.options != undefined) {
						if(customEvent.options.indexOf('customEnd') != -1) {
							// Do nothing
						} else {
							window.parent.highlightNext();
						}
					} else {
						window.parent.highlightNext();
					}
				}
			}

			if(window.parent.getCurrentPage().type != "video" && window.parent.getCurrentPage().type != "poster" && window.parent.getCurrentPage().type != "standard") {

				window.parent.togglePlayPause(false);
			}
		}

		// Default action if no custom end-action exists

		if(!customEndingExists && !nextDisabled) {
			// -1 is intro
			if(window.parent.currentPage != -1) {
				if(window.parent.isOption(window.parent.pages[window.parent.currentPage].options,"excursion")) {
					// If excursion
					if(!window.parent.document.getElementById('btn-next').disabled) {
						window.parent.highlightNext();
					}
				} else {
					// If not excursion
					if(window.parent.currentPage < (window.parent.pages.length-(window.parent.countExcursionPages()+1))) { // Abzüglich Exkursionen
						window.parent.highlightNext();
					}
				}

				if(window.parent.getCurrentPage().type != "video" && window.parent.getCurrentPage().type != "poster" && window.parent.getCurrentPage().type != "standard") {
					window.parent.togglePlayPause(false);
				}

			} else {
				window.parent.highlightNext();
			}
		}
	});

	// Fallback for IE11 and Firefox (gets triggered after progress in webkit)

	video.addEventListener('canplay', function() {

		var _timegap = VIDEO_TIMEGAP;

		if(window.parent.isIE11) {
			_timegap = IE_VIDEO_TIMEGAP;
		}

		if(!videoLoaded) {
			//console.log("canplay");
			videoLoaded = true;
			window.parent.hideLoadingAnimation();

			var _tempTimeout = setTimeout(function() {
				$(video).css({opacity:.01});
				$(video).show();
				$(video).animate({
					opacity:1
				},600);
			},_timegap);
		}
	}, false);

	video.addEventListener('canplaythrough', function(e) {

		var _timegap = VIDEO_TIMEGAP;

		if(window.parent.isIE11) {
			_timegap = IE_VIDEO_TIMEGAP;
		}

		if(!videoLoaded) {
			//console.log("canplaythrough");
			videoLoaded = true;
			window.parent.hideLoadingAnimation();

			var _tempTimeout = setTimeout(function() {
				$(video).css({opacity:.01});
				$(video).show();
				$(video).animate({
					opacity:1
				},600);
			},_timegap);
		}
	}, false);


	// If video is paused / playing
	video.addEventListener('pause', function(e) {
		window.parent.setPlayPause("play");
	}, false);

	video.addEventListener('play', function(e) {
		window.parent.setPlayPause("pause");
	}, false);

	// If volume changes
	video.addEventListener('volumechange', function(e) {
		if(this.volume == 0) {
			window.parent.setMute(true);
		} else {
			window.parent.setMute(false);
		}
	}, false);

	if(window.parent.isMuted()) {
		video.volume = 0;
	}
	window.parent.toggleButton('#btn-reload',true);
	window.parent.togglePlayPause(true);

	// Interaction for Video Navigation

	if(window.parent.videoNavigation) {
		$('.progressBar').css( 'cursor', 'pointer' );

		var timeDrag = false;   /* Drag status */
		$('.progressBar').mousedown(function(e) {
			timeDrag = true;
			updatebar(e.pageX);
		});
		$(document).mouseup(function(e) {
			if(timeDrag) {
				timeDrag = false;
				updatebar(e.pageX);
			}
		});
		$(document).mousemove(function(e) {
			if(timeDrag) {
				updatebar(e.pageX);
			}
		});

		//update Progress Bar control
		var updatebar = function(x) {
			var progress = $('.progressBar');
			var maxduration = video.duration; //Video duraiton
			var position = x - progress.offset().left; //Click pos
			var percentage = 100 * position / progress.width();

			//Check within range
			if(percentage > 100) {
				percentage = 100;
			}
			if(percentage < 0) {
				percentage = 0;
			}

			//Update progress bar and video currenttime
			$('.timeBar').css('width', percentage+'%');
			video.currentTime = maxduration * percentage / 100;
		};
	}

	if(window.parent.disableRightClick) {
		$('#video').attr("oncontextmenu","return false");
	}


	window.parent.togglePageNavigation(true);

	// Excursion Code

	if(window.parent.excursionDeparturePage == window.parent.getCurrentPage().id) {

		setTimeout(function() {
			pauseVideo();
		}, 500);

		window.parent.bootbox.confirm({
			title: window.parent.lang(window.parent.jsonLanguage.resumeExcursion.title),
			size: "small",
			message: window.parent.lang(window.parent.jsonLanguage.resumeExcursion.content),
			buttons: {
				confirm: {
					label: window.parent.lang(window.parent.jsonLanguage.buttons.btnYes),
					className: 'btn-primary'
				},
				cancel: {
					label: window.parent.lang(window.parent.jsonLanguage.buttons.btnCancel),
					className: 'btn-default'
				}
			},
			callback: function(result){
				if(result) {
					console.log("Seeking to " + window.parent.excursionDeparturePageTime + " seconds... Video duration is " + video.duration);
					if(window.parent.excursionDeparturePageTime >= video.duration) {
						video.currentTime = video.duration - .3;
						window.parent.togglePlayPause(false);
						window.parent.highlightNext();
						video.pause();
					} else {
						video.currentTime = window.parent.excursionDeparturePageTime;
						playVideo();
					}

				} else {
					playVideo();
				}
			}
		}).find('.modal-content').css({
			'margin-top': '200px'
		});
	}
}

// Is triggered in video.html pages
function vidplay() {

	if(window.parent.isMuted()) {
		video.volume = 0;
	}

	window.parent.toggleButton('#btn-reload',true);
	window.parent.togglePlayPause(true);

	video.play();
}

function openInGlossary(str) {
	window.parent.openGlossary(str);
}

function openGlossaryEntry(str) {
	if(arguments[1] !== undefined) {
		window.parent.openGlossaryEntry(str,arguments[1]);
	} else {
		window.parent.openGlossaryEntry(str);
	}
}

function seekToTime(ts) {
	// try and avoid pauses after seeking
	pauseVideo();
	video.currentTime = ts; // if this is far enough away from current, it implies a "play" call as well...oddly. I mean seriously that is junk.
	// however if it close enough, then we need to call play manually
	// some shenanigans to try and work around this:
	var timer = setInterval(function() {
		if (video.paused && video.readyState == 4 || !video.paused) {
			video.play();
			clearInterval(timer);
		}
	}, 50);
}

function disableNextButton() {
	nextDisabled = true;
	window.parent.toggleNavigation("next",false);
}

function enableNextButton() {
	nextDisabled = false;
	window.parent.toggleNavigation("next",true);
	window.parent.highlightNext();
}

//<tilo>
function disablePrevButton() {
	prevDisabled = true;
	window.parent.toggleNavigation("prev",false);
}
function enablePrevButton() {
	prevDisabled = false;
	window.parent.toggleNavigation("prev",true);
}
//</tilo>

function createCustomEvents(_ce) {
	var ce = _ce;
	ce.active = [];
	if(ce.time.length !== ce.actions.length | ce.time.length !== ce.dismissActions.length) {
		console.log("Custom Event error! Check if every array has the same number of elements.");
	} else {
		for(var i = 0; i<ce.actions.length; i++) {
			ce.active[i] = false;
		}
	}

	return ce;
}

function openExcursion(str) {
	window.parent.openExcursion(str);
}

function initPage(str) {
	if(arguments[1] !== undefined) {
		window.parent.initPage(str,arguments[1]);
	} else {
		window.parent.initPage(str);
	}
}
