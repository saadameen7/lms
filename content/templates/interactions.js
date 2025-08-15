// ##############################
// Settings
// ##############################

// Constants
var FADE_SPEED = 600;

// Variables
var swapActive = false;
var currentSetImage = '';

// Slideshow
var sl_currentImage = 0;
var sl_automode = false;
var _sl_contentWarning = false;
var _sl_showControls = false;

// ##############################
// Useful functions
// ##############################

function togglePlayPause(enable) {
	window.parent.togglePlayPause(enable);
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


function defaultFadeIn() {
	//console.log("Default Fade in!");

	for(var i = 0; i < arguments.length; i++) {
		if(window.parent.isIE11) {
			//console.log("Fade in... Opacity: " + $(arguments[i]).css("opacity"));

			var curOpa = $(arguments[i]).css("opacity");
			var curDisplay = $(arguments[i]).css("display");

			if(curOpa < 1) {
				// is it visible at all?
				if(curDisplay === "none") {
					$(arguments[i]).css({opacity:.01});
					$(arguments[i]).show();
				} else {
					// Do nothing
				}

			} else {
				if(curDisplay === "none") {
					$(arguments[i]).css({opacity:.01});
					$(arguments[i]).show();
				} else {
					// Do nothing
				}

			}

			$(arguments[i]).stop(true,false).animate({
				opacity:1
			},FADE_SPEED);

		} else {
			$(arguments[i]).stop(true,false).fadeIn(FADE_SPEED);
		}
	}
}

function defaultFadeOut() {
	for(var i = 0; i < arguments.length; i++) {
		if(window.parent.isIE11) {
			var curOpa = $(arguments[i]).css("opacity");
			var curDisplay = $(arguments[i]).css("display");

			if(curDisplay !== "none") {
				if(curOpa > 0) {
					$(arguments[i]).stop(true,false).animate({
						opacity:0
					},FADE_SPEED,function() {
						$(this).hide(); // Important!
					});
				}
			}
		} else {
			$(arguments[i]).stop(true,false).fadeOut(FADE_SPEED);
		}
	}
}

function checkIfChapIsDone(chap) {
	var _num = chap.length;
	var _is = 0;

	for(var i = 0; i < chap.length; i++) {
		for(var j = 0; j<window.parent.pagesDone.length; j++) {
			if(window.parent.pagesDone[j].id === chap[i]) {
				_is++;
			}
		}
	}

	console.log(_is + " of " + _num + " pages of the chapter have been seen!");

	if(_is === _num) {
		return true;
	} else {
		return false;
	}
}

// ##############################
// Standard Buttons
// ##############################

function createInvisibleButton(id,target,className,pos,dim) {

	if ($(id).length ) {
		$('#'+id).fadeIn(FADE_SPEED);
	} else {
		var _div = '<div id="'+id+'" class="'+className+'" style="position:absolute; display:none; width:'+dim[0]+'px; height:'+dim[1]+'px; left:'+pos[0]+'px; top:'+pos[1]+'px;"></div>';

		if($(target).length) {
			//console.log("There is an element: " + $(target).length);
			$(target).append(_div);
		} else {
			var _targetId = target.slice(1,target.length);
			var _targetDiv = '<div class="'+_targetId+' stage-object">'+_div+'</div>';
			//console.log("Target not available. Creating container... " + _targetDiv);

			if($('.mediaContainer').length) {
				$('.mediaContainer').after(_targetDiv);
			} else {
				$('body').append(_targetDiv);
			}
		}


		$('#'+id).fadeIn(FADE_SPEED);
	}

	return $('#'+id);
}

function createButton(id,str,color,icon,target,pos,fadeIn,_width) {

	var _spanStyle = 'padding-right:12px;';
	var _style = '';
	var _class = '';
	var _icon = '';

	if(_width !== undefined) {
		_style+='width:'+_width+'px !important;';
	}

	switch(color.toLowerCase()) {
		case 'white':
			_class = 'btn-default';
			break;
		case 'orange':
			_class = 'btn-warning';
			break;
		case 'blue':
			_class = 'btn-info';
			break;
		case 'red':
			_class = 'btn-danger';
			break;
		case 'green':
			_class = 'btn-success';
			break;
		case 'sh':
			_class = 'btn-light';
			break;
		default:
			_class = 'btn-default';
			break;
	}

	if(str === '') {
		_spanStyle = '';
	} else {
		//_style = '';
	}

	switch(icon.toLowerCase()) {
		case 'fragezeichen':
		case 'questionmark':
		case 'question':
		case '?':
			_icon = '<span style="'+_spanStyle+'" class="glyphicon glyphicon-question-sign" aria-hidden="true"></span>';
			break;
		case 'ausrufezeichen':
		case 'exclamation':
		case 'exclamationmark':
		case '!':
			_icon = '<span style="'+_spanStyle+'" class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>';
			break;
		case 'info':
		case 'information':
		case 'i':
			_icon = '<span style="'+_spanStyle+'" class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>';
			break;
		case 'video':
		case 'mp4':
    case 'm4v':
		case 'movie':
		case 'film':
			_icon = '<span style="'+_spanStyle+'" class="glyphicon glyphicon-film" aria-hidden="true"></span>';
			break;
		case 'image':
		case 'picture':
		case 'img':
		case 'pic':
		case 'bild':
		case 'jpg':
		case 'jpeg':
		case 'png':
			_icon = '<span style="'+_spanStyle+'" class="glyphicon glyphicon-picture" aria-hidden="true"></span>';
			break;
		case 'download':
		case 'herunterladen':
		case 'save':
		case 'pdf':
			_icon = '<span style="'+_spanStyle+'" class="glyphicon glyphicon-download-alt" aria-hidden="true"></span>';
			break;
		case 'link':
		case 'external':
		case 'externallink':
			_icon = '<span style="'+_spanStyle+'" class="glyphicon glyphicon-link" aria-hidden="true"></span>';
			break;
		case 'attachment':
		case 'attach':
		case 'anhang':
			_icon = '<span style="'+_spanStyle+'" class="glyphicon glyphicon-paperclip" aria-hidden="true"></span>';
			break;
		case 'audio':
		case 'music':
		case 'sound':
		case 'mp3':
			_icon = '<span style="'+_spanStyle+'" class="glyphicon glyphicon-music" aria-hidden="true"></span>';
			break;
		case 'glossar':
		case 'glossary':
		case 'glossarbegriff':
		case 'glossarlink':
		case 'glossarylink':
			_icon = '<span style="'+_spanStyle+'" class="glyphicon glyphicon-book" aria-hidden="true"></span>';
			break;
		case 'excursion':
		case 'exkursion':
		case 'excursionlink':
		case 'exkursionslink':
			_icon = '<span style="'+_spanStyle+'" class="glyphicon glyphicon-tags" aria-hidden="true"></span>';
			break;
		case 'pagelink':
		case 'seitenlink':
			_icon = '<span style="'+_spanStyle+'" class="glyphicon glyphicon-link" aria-hidden="true"></span>';
			break;
		default:
			if(icon.toLowerCase().length > 1) {
				_icon = '<span style="'+_spanStyle+'" class="'+icon.toLowerCase()+'" aria-hidden="true"></span>';
			} else {
				_icon = '';
			}
			break;
	}

	if ($(id).length ) {
		$('#'+id).fadeIn(FADE_SPEED);
	} else {
		var _btn = '<button id="'+id+'" class="btn '+_class+'" style="position:absolute; display:none; left:'+pos[0]+'px; top:'+pos[1]+'px;'+_style+'">'+_icon+str+'</button>';
		$(target).append(_btn);

		if(fadeIn !== undefined) {
			if(fadeIn) {
				$('#'+id).fadeIn(FADE_SPEED);
			}
		} else {
			$('#'+id).fadeIn(FADE_SPEED);
		}

	}

	return $('#'+id);
}

function createImageButton(id,target,className,pos,src) {
	if ($(id).length ) {
		$('#'+id).fadeIn(FADE_SPEED);
	} else {
		var _div = '<div id="'+id+'" class="'+className+'" style="position:absolute; display:none; cursor:pointer; left:'+pos[0]+'px; top:'+pos[1]+'px;"><img src="'+src+'"></div>';
		$(target).append(_div);

		$('#'+id).hover(function() {
			$(this).addClass('hoverOver');
		}, function() {
			$(this).removeClass('hoverOver');
		})

		$('#'+id).fadeIn(FADE_SPEED);
	}

	return $('#'+id);
}

// ##############################
// jQuery Addons
// ##############################

jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) +  $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft()) + "px");
    return this;
}


// ##############################
// Call Functions
// ##############################

function createInteractionIcon(target,pos) {
	var icon = '.interactionIcon';

	if($(icon).length) {
		defaultFadeIn(icon);
	} else {
		loadImagesAndAction(["../../content/images/"+window.parent.interactionIcon],["interactionIcon"],function() { appendInteractionIcon(target,pos) });
	}
}

function openGlossaryEntry(title) {
	if(arguments[1] !== undefined) {
		window.parent.openGlossaryEntry(title,arguments[1]);
	} else {
		window.parent.openGlossaryEntry(title);
	}
}

function openExcursion(id) {
	window.parent.openExcursion(id);
}

function openPage(id) {
	var _id = id.split(".").join("-");
	if(arguments[1] !== undefined) {
		window.parent.initPage(_id,arguments[1]);
	} else {
		window.parent.initPage(_id);
	}

}

function openAttachment(path) {
	window.open(path,'_blank');
}

function openVideo(path,title,options) {
	if(options !== undefined) {
		openBootboxVideo(title,path,options);
	} else {
		openBootboxVideo(title,path,undefined);
	}

}

function showMessage(title,str,margin,func) {
	if(func !== undefined) {
		openBootboxText(title,str,margin,func);
	} else {
		openBootboxText(title,str,margin);
	}

}

function createTimedMessage(target,seconds,str,pos,size,className) {

	var _id = 'timed_message_' + String(Math.floor((Math.random() * 100000) + 1));
	var _target = '.mediaContainer';
	var _seconds = 4;
	var _str = 'No text specified';
	var _pos = [0,0];
	var _size = 400;
	var _class = 'stage-textfield';

	if(target !== undefined) _target = target;
	if(seconds !== undefined) _seconds = Number(seconds);
	if(str !== undefined) _str = str;
	if(pos !== undefined) _pos = pos;
	if(size !== undefined) _size = size;
	if(className !== undefined) _className = className;


	var _tag = '<div id="'+_id+'" class="'+_className+'" style="pointer-events:none; width:'+_size+'px; left:'+_pos[0]+'px; top:'+_pos[1]+'px">'+_str+'</div>';
	$(target).append(_tag);

	defaultFadeIn($('#'+_id));

	setTimeout (function() {
		$('#'+_id).stop(true,false).fadeOut(FADE_SPEED,function() {
			console.log("Removed...");
			$(this).remove();

		});
	}, _seconds * 1000);

}



function createTextfield(id,target,str,pos,size,className) {

	var options = '';

	if(arguments[6] !== undefined) {
		options = arguments[6];
	}

	if($('#'+id)[0] === undefined) {
		var _class = 'stage-textfield';
		var _size = 400;
		if(className !== undefined) {
			_class = className;
		}
		if(size !== undefined) {
			_size = size;
		}
		var _tag = '<div id="'+id+'" class="'+_class+'" style="pointer-events:none; width:'+_size+'px; left:'+pos[0]+'px; top:'+pos[1]+'px">'+str+'</div>';
		$(target).append(_tag);
		if(options.indexOf('nofade') > -1) {
			$('#'+id).show();
		} else {
			if(options.indexOf('hide') > -1) {
				// Do nothing
			} else {
				defaultFadeIn('#'+id);
			}
		}

	} else {
		if(options.indexOf('nofade') > -1) {
			$('#'+id).show();
		} else {
			if(options.indexOf('hide') > -1) {
				// Do nothing
			} else {
				defaultFadeIn('#'+id);
			}

		}

	}
}



function showTextfield(id) {
	if($('#'+id)[0] === undefined) {
		// Do nothing
	} else {
		defaultFadeIn('#'+id);
	}
}



function hideTextfield(id) {

	var options = '';

	if(arguments[1] !== undefined) {
		options = arguments[1];
	}

	if(options.indexOf('nofade') > -1) {
		$('#'+id).hide();
	} else {
		defaultFadeOut($('#'+id));
	}

}

function showVideo(id,url,target,pos,className,options) {
	if($('#'+id)[0] === undefined) {
		var _class = 'stage-video';
		var _options = '';
		if(className !== undefined) {
			_class = className;
		}
		if(options !== undefined) {
			if(options.length > 0) {
				for(var i = 0; i<options.length;i++) {
					if(i < options.length-1) {
						_options+=options[i] + " ";
					} else {
						_options+=options[i];
					}

				}
			}
		}
		var _videotag = '<div id="'+id+'" class="'+_class+'" style="position:absolute;left:'+pos[0]+'px; top:'+pos[1]+'px"><video '+_options+' style="display:block; margin:0 auto; background-color:white;" autoplay="autoplay" preload="auto" src="'+url+'"></video></div>';

		$(target).append(_videotag);
		defaultFadeIn('#'+id);

		$('#'+id).find('video').on('loadedmetadata',function() {
			var pageW = window.parent.contentWidthWide;
			if(window.parent.getCurrentPage().type === "poster") {
				pageW = window.parent.contentWidthWide;
			} else if (window.parent.getCurrentPage().type === "standard") {
				pageW = window.parent.contentWidthStandard;
			}
			var pageH = window.parent.contentHeight;
			var _w = $(this)[0].videoWidth;
			var _h = $(this)[0].videoHeight;


		    var _y = Math.floor((pageH - _h) / 2);
			var _x = Math.floor((pageW - _w) / 2);

		});

		$('#'+id).find('video').on('canplay',function() {
			$(this)[0].play();
		});
	} else {
		console.log("Video already available. Fading in and starting again.");
		defaultFadeIn('#'+id);
		$('#'+id).find('video').each(function() {
			$(this)[0].play();
		});
	}
}

function hideVideo(id) {
	defaultFadeOut($('#'+id));
}

function removeImagesFromContainer(container) {
	$(container).find('img').each(function() {
		$(this).remove();
	});
}

function trackMouseMovement(boo) {
	if(boo) {
		document.addEventListener("mousemove", trackCursor);
	} else {
		document.removeEventListener("mousemove", trackCursor);
	}
}

function trackCursor(e) {
	var _x = e.pageX;
	var _y = e.pageY;
	console.log(_x+"/"+_y);
}

function setImage(container,_id,position,mapstr) {

	var usemap = false;

	if(mapstr !== undefined) {
		if(mapstr.length > 0 && typeof(mapstr) == 'string') {
			usemap = true;
		}
	}

	// Delete current image
	$(container).find('img').each(function() {
		$(this).remove();
	});

	currentSetImage = _id;

	$(container).append(getPageImageById(_id).result);
	//$(container).stop(true,false).fadeIn(FADE_SPEED);
	//defaultFadeIn(container);

	$(getPageImageById(_id).result).attr('id','img_'+_id);
	if(usemap) {
		$(getPageImageById(_id).result).attr('usemap',mapstr);
	}

	$(getPageImageById(_id).result).css('position','absolute');
	$(getPageImageById(_id).result).css('left',position[0]+'px');
	$(getPageImageById(_id).result).css('top',position[1]+'px');
	$(getPageImageById(_id).result).css("pointer-events","none");

}

function setSolidImage(container,_id,position,mapstr) {

	var usemap = false;

	if(mapstr !== undefined) {
		if(mapstr.length > 0 && typeof(mapstr) == 'string') {
			usemap = true;
		}
	}

	// Delete current image
	$(container).find('img').each(function() {
		$(this).remove();
	});

	currentSetImage = _id;

	$(container).append(getPageImageById(_id).result);
	//$(container).stop(true,false).fadeIn(FADE_SPEED);
	defaultFadeIn(container);

	$(getPageImageById(_id).result).attr('id','img_'+_id);
	if(usemap) {
		$(getPageImageById(_id).result).attr('usemap',mapstr);
	}

	$(getPageImageById(_id).result).css('position','absolute');
	$(getPageImageById(_id).result).css('left',position[0]+'px');
	$(getPageImageById(_id).result).css('top',position[1]+'px');
	//$(getPageImageById(_id).result).css("pointer-events","none");

}

function addImage(container,_id,position,mapstr) {

	var usemap = false;

	if(mapstr !== undefined) {
		if(mapstr.length > 0 && typeof(mapstr) == 'string') {
			usemap = true;
		}
	}

	$(container).append(getPageImageById(_id).result);

	$(getPageImageById(_id).result).attr('id','img_'+_id);
	if(usemap) {
		$(getPageImageById(_id).result).attr('usemap',mapstr);
	}

	$(getPageImageById(_id).result).css('position','absolute');
	$(getPageImageById(_id).result).css('left',position[0]+'px');
	$(getPageImageById(_id).result).css('top',position[1]+'px');

}


function initAutomaticSlideshow(settings) {

	console.log("Init automatic slideshow...");

	console.log("... new slideshow");

	// Vars
	var asl_interval;
	var currentSlideshowContainer = '.slideshow-images1';
	var asl_slides = settings.slides;
	var _ci = 0;
	var _csc = settings.container + ' ' + currentSlideshowContainer;
	var _style = 'background-color:' + settings.backgroundColor;
	var _closebtn = '<div class="closeButton"><img src="../../content/images/close-btn.png"></div>';

	// Functions
	function closeAutomaticSlideshow(con) {
		defaultFadeOut(con);

	}

	function nextAutomaticSlide() {

		console.log("Next Slide: " + _ci + ", " + asl_slides[_ci]);

		_csc = settings.container + ' ' + currentSlideshowContainer;

		defaultFadeOut(_csc);

		if(currentSlideshowContainer === '.slideshow-images1') {
			currentSlideshowContainer = '.slideshow-images2';
		} else {
			currentSlideshowContainer = '.slideshow-images1';
		}

		_csc = settings.container + ' ' + currentSlideshowContainer;

		setImage(_csc,asl_slides[_ci],[0,0]);

		defaultFadeIn(_csc);

		_ci++;

		if(_ci >= asl_slides.length) {
			_ci = 0;
		}


	}

	// DOM
	$(settings.container).html('<div style="position:absolute;top:0;left:0;width:994px;height:500px;background-color:'+settings.backgroundColor+'"></div><div class="slideshow-images1 stage-object"></div><div class="slideshow-images2 stage-object"></div>');
	$(settings.container).append(_closebtn);

	$(settings.container + ' .slideshow-images1').css({
		left:settings.imagePosition[0]+'px',
		top:settings.imagePosition[1]+'px'
	});

	$(settings.container + ' .slideshow-images2').css({
		left:settings.imagePosition[0]+'px',
		top:settings.imagePosition[1]+'px'
	})

	// Core
	asl_interval = setInterval(function() {
		console.log("interval...");
		if($(settings.container).is(":visible")) {
			nextAutomaticSlide();
		} else {
			console.log("Pausing interval...");
			_ci = 0;
		}


	},settings.imageDuration*1000);

	$(settings.container).show();

	nextAutomaticSlide();

	$(settings.container + ' .closeButton').on("click",function() {
		closeAutomaticSlideshow(settings.container);
	});

	$(settings.container + ' .closeButton').hover(function() {
		$(this).addClass("hoverOver-9");
	}, function() {
		$(this).removeClass("hoverOver-9");
	})

	$(settings.container + ' .closeButton').css('left',settings.closeButtonPosition[0]+'px');
	$(settings.container + ' .closeButton').css('top',settings.closeButtonPosition[1]+'px');
}

function showImage(id,con,settings) {
	var _id = 'picture_'+id;
	var pic = getPageImageById(id);
	var _pic = pic.result;

	if($('#'+_id)[0] === undefined) {
		var _style = '';
		var imgtag = '';

		var shapeSize = window.parent.contentWidthWide;
		if(window.parent.getCurrentPage().type === "poster") {
			shapeSize = window.parent.contentWidthWide;
		} else if (window.parent.getCurrentPage().type === "standard") {
			shapeSize = window.parent.contentWidthStandard;
		} else {
			if($('#video').length) {
				shapeSize = $('#video')[0].videoWidth;
			}
		}

		if(settings !== undefined) {
			// Background Settings
			if(settings.background !== undefined) {
				if(settings.background) {
					if(settings.backgroundColor !== undefined) {
						_style='background-color:'+settings.backgroundColor;
					} else {
						_style='background-color:rgba(255,255,255,0,8)';
					}
				}
			}
			// Close Button
			if(typeof settings.closeButton === 'boolean' && settings.closeButton === true) {
				if(settings.interaction !== undefined) {
					imgtag = '<div id="'+_id+'" style="'+_style+'" class="stage-object"><div style="position:absolute; left:'+settings.interaction[0][0]+'px; top:'+ settings.interaction[0][1]+'px; width:' +settings.interaction[1][0]+'px; height:'+settings.interaction[1][1]+'px" class="interactive-element '+settings.interaction[2]+'"></div><div class="closeButton"><img src="../../content/images/close-btn.png"></div></div>';
				} else {
					imgtag = '<div id="'+_id+'" style="'+_style+'" class="stage-object"><div class="closeButton"><img src="../../content/images/close-btn.png"></div></div>';
				}

			} else {
				if(settings.interaction !== undefined) {
					imgtag = '<div id="'+_id+'" style="'+_style+'" class="stage-object"></div><div class="interactive-element '+settings.interaction[2]+' stage-object"></div>';
				} else {
					imgtag = '<div id="'+_id+'" style="'+_style+'" class="stage-object"></div>';
				}
			}
		}

		$(con).append(imgtag);

		$('#'+_id).css('width',shapeSize + 'px');
		$('#'+_id).css('height',window.parent.contentHeight + 'px');

		$('#'+_id).prepend(_pic);

		var _x = 0;
		var _y = 0;

		var pageW = shapeSize;
		var pageH = window.parent.contentHeight;
		var _picW = Number(pic.size[0]);
		var _picH = Number(pic.size[1]);
		var picW = _picW;
		var picH = _picH;
		var _percent;

		if(settings.interaction !== undefined) {
			$('#'+_id + ' .interactive-element').on('click',function() {
				settings.interaction[3]();
			});
		}

		// Position Settings
		if(settings.position !== undefined && settings.position !== '') {
			if(typeof(settings.position) === "string") {
				if(settings.position.toLowerCase() === "center") {
					if(_picH > (window.parent.contentHeight-30)) {
						_picH = (window.parent.contentHeight-30);
						$(_pic).css('height',_picH+'px');
						_percent = (_picH/pic.size[1])*100;
						_picW = (_picW/100)*_percent;
					}

					picW = _picW;
					picH = _picH;

					_x = (pageW - picW) / 2;
					_y = (pageH - picH) / 2;

					$(_pic).css({
						position:'absolute',
						top:_y+'px',
						left:_x+'px'
					});
				}
			} else {
				if(settings.position[0] !== undefined && settings.position[1] !== undefined) {
					$(_pic).css({
						position:'absolute',
						top:settings.position[1]+'px',
						left:settings.position[0]+'px'
					});
				}
			}
		}

		// Position Close Button

		var bump = 25;
		if(_percent !== undefined) {
			if(_percent < 99 && _percent > 60) {
				var _t = (bump/100)*_percent;
				bump+=_t;
			} else if(_percent <= 60) {
				var _t = (bump/100)*_percent;
				bump+=_t+15;
			}
		}

		var _closePosX = Math.floor(_x + picW - 25);
		var _closePosY = Math.floor(_y - 10);

		$('#'+_id + ' .closeButton').css('left',_closePosX+'px');
		$('#'+_id + ' .closeButton').css('top',_closePosY+'px');

		// Class settings

		if(settings.className !== undefined && settings.className !== '') {
			$('#'+_id + ' img').addClass(settings.className);
		}

		// Click through Background settings

		if(settings.backgroundClickthrough !== undefined) {

			if(settings.backgroundClickthrough) {
				$('#'+_id).css("pointer-events","none");
			} else {
				$(con).css('z-index',8000);
				if(settings.ignoreBackgroundClick !== undefined) {
					if(settings.ignoreBackgroundClick) {
						$('#'+_id).on("click",function(event) {
							// Do nothing
						})
					} else {
						$('#'+_id).on("click",function(event) {
							defaultFadeOut($(this),$(con));
						})
					}

				} else {
					$('#'+_id).on("click",function(event) {
						defaultFadeOut($(this),$(con));
					})

				}
			}
		}

		// Close Button

		$('#'+_id + ' .closeButton').on("click",function() {
			defaultFadeOut($('#'+_id),$(con));
		});

		$('#'+_id + ' .closeButton').hover(function() {
			$(this).addClass("hoverOver-9");
		}, function() {
			$(this).removeClass("hoverOver-9");
		})

		defaultFadeIn($('#'+_id),$(con));

	} else {
		defaultFadeIn($('#'+_id),$(con));
	}

}

function hideImage() {
	for(var i = 0; i< arguments.length; i++) {
		defaultFadeOut($('#picture_'+arguments[i]));
	}
}

function hideAllImages(target) {
	$(target).find('div').each(function() {
		//$(this).stop(true,false).fadeOut(FADE_SPEED);
		defaultFadeOut($(this));
	});
}


// ##############################
// General functions
// ##############################

function openBootboxVideo(title,url,options) {

	var loop = ' ';
	var controls = ' ';

	if(options !== undefined) {
		if(options.indexOf('loop') !== -1) {
			loop = ' loop ';
		}
		if(options.indexOf('controls') !== -1) {
			controls = ' controls ';
		}
	}

	var _path = window.parent.contentPath + window.parent.getCurrentPath() + "/" + url;
	var _videotag = '<div class="bootbox-video"><video style="display:block; margin:0 auto; background-color:white; max-height:450px; max-width:100%" autoplay="autoplay" preload="auto"'+loop+controls+'src="'+_path+'"></video></div>';
	var _title;

	if(title.length > 1) {
		_title = title;
	} else {
		_title = false;
	}

	window.parent.bootbox.dialog({
		title: _title,
		size: "large",
		message: _videotag,
		closeButton: true,
		backdrop: true,
		onEscape: true
	}).find('video').on("loadedmetadata",function() {
		var _maxModalWidth = 900;
		var _w = $(this)[0].videoWidth;
		var _h = $(this)[0].videoHeight;
		var _modalwidth = _w+40;
		var _modalMargin = 0;
		if(_h < 300) {
			_modalMargin = 130;
		} else {
			_modalMargin = 60;
		}
		if(_modalwidth > _maxModalWidth) {
			_modalwidth = _maxModalWidth;
		}
		$(this).parents('.modal-dialog').css({
			'width':_modalwidth + 'px',
			'margin-top':_modalMargin + 'px'
		});
	});
}

function openBootboxText(title,str,margin,func) {
	var _title;
	var _margin;

	if(title.length > 1) {
		_title = title;
	} else {
		_title = false;
	}

	if(margin !== undefined && margin !== null) {
		if(typeof(margin) === 'string') {
			if(margin.indexOf('px') === -1) {
				_margin = margin + 'px';
			} else {
				_margin = margin;
			}
		} else {
			_margin = margin + 'px';
		}

	} else {
		_margin = '60px';
	}

	window.parent.bootbox.dialog({
		title: _title,
		message: str,
		closeButton: true,
		backdrop: true,
		onEscape: function() {
			if(func !== undefined) {
				func();
			}
		}
	}).find('.modal-content').each(function() {
		$(this).css('margin-top',_margin);

	});
}

function appendInteractionIcon(target,pos) {
	var _pic = getPageImageById("interactionIcon").result;
	$(_pic).css("position","absolute");
	$(_pic).css("display","none");
	$(_pic).css("pointerEvents", "none");
	$(_pic).offset({top:pos[1],left:pos[0]});
	$(target).append(_pic);

	if(window.parent.isIE11) {
		$(_pic).css({opacity:.01});
		$(_pic).show();
		$(_pic).animate({
			opacity:1
		},FADE_SPEED);
	} else {
		defaultFadeIn(_pic);
	}
}


// ##############################
// Sort out
// ##############################


function swapContentInteraction(_settings) {
	var buttonCon = _settings.buttonContainer;

	if(swapActive) {
		$(buttonCon).fadeIn(FADE_SPEED);
	} else {

		$(buttonCon).find('div').each(function() {
			var btnPos = $(this).data('position').split(",");
			var btnSize = $(this).data('size').split(',');

			var originalData = $(this).html();
			var swapData = $(this).data('replace');


			$(this).offset({top:Number(btnPos[1]),left:Number(btnPos[0])});
			$(this).css("width",btnSize[0] + "px");
			$(this).css("height",btnSize[1] + "px");


			$(this).hover(function() {
				$(this).html(swapData);

			}, function() {
				$(this).html(originalData);
			});

		});
		$(buttonCon).fadeIn(FADE_SPEED);
	}
}


function swapInteraction(_settings) {
	var buttonCon = _settings.buttonContainer;
	var targetCon = _settings.targetContainer;

	if(swapActive) {
		$(buttonCon).fadeIn(FADE_SPEED);
		$(targetCon).fadeIn(FADE_SPEED);
	} else {

		// Make all targets invisible
		swapActive = true;
		$(targetCon).find('div').each(function() {
			var targetPos = $(this).data('position').split(",");
			$(this).offset({top:Number(targetPos[1]),left:Number(targetPos[0])});
			$(this).css("display","none");
		});

		$(buttonCon).find('div').each(function() {
			var btnPos = $(this).data('position').split(",");
			$(this).offset({top:Number(btnPos[1]),left:Number(btnPos[0])});

			$(this).hover(function() {
				$('#'+$(this).data('target')).stop(true,false).fadeIn(300);
				$(this).stop(true,false).animate({ opacity: 0 },300);
			}, function() {
				$('#'+$(this).data('target')).stop(true,false).fadeOut(300);
				$(this).stop(true,false).animate({ opacity: 1 },300);
			});

		});

		$(buttonCon).fadeIn(FADE_SPEED);
		$(targetCon).fadeIn(FADE_SPEED);
	}
}

// ##############################
// Image Slider
// ##############################

function initImageSlider(id,slides) {

	var slider = $('#'+id);

	for(var i = 0; i<slides.length; i++) {

		var _slide = '<div class="'+slides[i].class+'" id="'+slides[i].id+'" data-title="'+slides[i].title+'" data-image="'+slides[i].image+'" data-hover-image="'+slides[i].hoverImage+'" data-hover-title="'+slides[i].hoverTitle+'" data-hover-class="'+slides[i].hoverClass+'" data-hover-show="'+slides[i].hoverShow+'"></div>';

		slider.append(_slide);

		$('#' + slides[i].id).append(getPageImageById(slides[i].image).result);

		if(slides[i].title !== undefined && slides[i].title !== '') {
			$('#' + slides[i].id).append('<p>'+slides[i].title+'</p>');
		}
	}

	$('.slide-entry').on('click',function() {
		//console.log("sup");
	});


	$('.slide-entry').hover(function() {
		if($(this).data('hover-show') !== undefined && $(this).data('hover-show') !== '') {
			$($(this).data('hover-show')).stop(true,false).fadeIn(400);
		}

		if($(this).data('hover-title') !== undefined && $(this).data('hover-title') !== '') {
			if($(this).children('p').length > 0) {
				// If p tag is available
				$(this).children('p').html($(this).data('hover-title'));

			} else {
				// If no p tag is available
				$(this).append('<p>'+$(this).data('hover-title')+'</p>');
			}
		}

		if($(this).data('hover-image') !== undefined && $(this).data('hover-image') !== '') {
			$(this).children('img').replaceWith(getPageImageById($(this).data('hover-image')).result);
		}
		$(this).children('img').addClass($(this).data('hover-class'));
	}, function() {

		if($(this).data('hover-show') !== undefined && $(this).data('hover-show') !== '') {
			$($(this).data('hover-show')).stop(true,false).fadeOut(400);
		}

		if($(this).data('hover-title') !== undefined && $(this).data('hover-title') !== '') {
			if($(this).children('p').length > 0) {
				// If p tag is available
				$(this).children('p').html($(this).data('title'));

			} else {
				// If no p tag is available
				$(this).append('<p>'+$(this).data('title')+'</p>');
			}
		}

		if($(this).data('hover-image') !== undefined && $(this).data('hover-image') !== '') {
			$(this).children('img').replaceWith(getPageImageById($(this).data('image')).result);
		}
		$(this).children('img').removeClass($(this).data('hover-class'));
	});


	$('.custom-content').fadeIn();

}


// ##############################
// New Slideshow (04.04.19)
// ##############################

function getStageDimensions() {
	var w = window,
  	d = document,
   	e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    ww = w.innerWidth || e.clientWidth || g.clientWidth,
    wh = w.innerHeight|| e.clientHeight|| g.clientHeight;

	if(ww !== undefined && wh !== undefined) {
		return [ww,wh];
	} else {
		console.log("getClientDimensions(); jquery")
		return [$(window).width(),$(window).height()];
	}
}

function openSlideshow(options) {
	console.log("Open slideshow in " + options.container);
	var _stageDimensions = getStageDimensions();
	var slideshow_opacity_level = .7;
	var slideshow_disabled_opacity_level = .4;

	if($(options.container).length) {

		if($(options.container + ' .sl-image-a').length) {
			console.log("Open existing slideshow...")
			defaultFadeIn(options.container);
		} else {
			console.log("Creating new slideshow...")
			var slideshow_cs = 0;
			var slideshow_cc = '.sl-image-a';
			var slideshow_div = '<div class="sl-background sl-object"></div><div class="sl-image-a sl-object"></div><div class="sl-image-b sl-object"></div><div class="sl-close sl-object"></div>';
			if(options.controls.showControls) {
				slideshow_div+='<div class="sl-controls '+options.controls.class+' sl-object"></div>';
			}

			$(options.container).html(slideshow_div);

			$(options.container + ' .sl-image-a').hide();
			$(options.container + ' .sl-image-b').hide();

			$(options.container + ' .sl-background').css({
				width:_stageDimensions[0] + 'px',
				height:_stageDimensions[1] + 'px',
				backgroundColor:options.background
			});

			$(options.container + ' .sl-background').click(function() {
				// Close Slideshow?
			});

			// Images

			var slideshow_images = [];

			for(var i = 0; i<options.slides.images.length; i++) {
				var slide_image = {
					image:getPageImageById(options.slides.images[i]),
					id:i,
					position:[0,0]
				}

				if(typeof(options.slides.position) === 'string') {
					if(options.slides.position.toLowerCase() === 'center') {
						slide_image.position[0] = (_stageDimensions[0]-slide_image.image.size[0])/2;
						slide_image.position[1] = (_stageDimensions[1]-slide_image.image.size[1])/2;
					} else {
						slide_image.position[0] = 0;
						slide_image.position[1] = 0;
					}
				} else {
					slide_image.position[0] = options.slides.position[0];
					slide_image.position[1] = options.slides.position[1];
				}

				//console.log(slide_image);
				slideshow_images.push(slide_image);
			}


			$(options.container + ' .sl-image-a').html(slideshow_images[0].image.result);
			$(options.container + ' .sl-image-a img').addClass(options.slides.class);

			$(options.container + ' .sl-image-a img').css({
				position:'absolute',
				left:slideshow_images[0].position[0]+'px',
				top:slideshow_images[0].position[1]+'px'
			});
			defaultFadeIn(options.container + ' .sl-image-a');

			// Close Button

			$(options.container + ' .sl-close').html(options.closeButton.src);
			$(options.container + ' .sl-close').css({
				left:options.closeButton.position[0] + 'px',
				top:options.closeButton.position[1] + 'px'
			});

			$(options.container + ' .sl-close').hover(function() {
				$(this).css({
					opacity:slideshow_opacity_level
				});
			},function() {
				$(this).css({
					opacity:1
				});
			});

			$(options.container + ' .sl-close').on('click',function() {
				closeSlideshow(options.container);
			});


			// Controls

			if(options.controls.showControls) {

				// Previous Button
				if(options.controls.buttons.previous !== undefined) {
					if(options.controls.buttons.previous.html !== '') {
						$(options.container + ' .sl-controls').append('<div class="sl-previous '+options.controls.buttons.previous.class+'">'+options.controls.buttons.previous.html+'</div>')
						$(options.container + ' .sl-controls .sl-previous').hover(function() {
							if(!$(this).hasClass('sl-disabled')) {
								$(this).css({
									opacity:slideshow_opacity_level
								});
							}
						},function() {
							if(!$(this).hasClass('sl-disabled')) {
								$(this).css({
									opacity:1
								});
							}
						});

						$(options.container + ' .sl-controls .sl-previous').click(function() {
							if(!$(this).hasClass('sl-disabled')) {
								if($(options.container + ' .sl-controls .sl-next').hasClass('sl-disabled')) {
									$(options.container + ' .sl-controls .sl-next').removeClass('sl-disabled');
									$(options.container + ' .sl-controls .sl-next').css({
										opacity:1
									});
								}
								slideshow_cs--;
								console.log("Previous slideshow image...");
								defaultFadeOut(slideshow_cc);

								if(slideshow_cc === '.sl-image-a') {
									slideshow_cc = '.sl-image-b';
								} else {
									slideshow_cc = '.sl-image-a';
								}

								for(var i = 0; i < slideshow_images.length; i++) {
									if(slideshow_images[i].id === slideshow_cs) {
										$(options.container + ' ' + slideshow_cc).html(slideshow_images[i].image.result);
										$(options.container + ' ' + slideshow_cc + ' img').addClass(options.slides.class);

										$(options.container + ' ' + slideshow_cc + ' img').css({
											position:'absolute',
											left:slideshow_images[i].position[0]+'px',
											top:slideshow_images[i].position[1]+'px'
										});
										defaultFadeIn(options.container + ' ' + slideshow_cc);
									}
								}

								if(slideshow_cs <= 0) {
									$(this).css({
										opacity:slideshow_disabled_opacity_level
									});
									$(this).addClass('sl-disabled');
								}
							}
						});
					}
				} else {
					// Not available
				}

				// Next Button
				if(options.controls.buttons.next !== undefined) {
					if(options.controls.buttons.next.html !== '') {
						$(options.container + ' .sl-controls').append('<div class="sl-next '+options.controls.buttons.next.class+'">'+options.controls.buttons.next.html+'</div>')
						$(options.container + ' .sl-controls .sl-next').hover(function() {
							if(!$(this).hasClass('sl-disabled')) {
								$(this).css({
									opacity:slideshow_opacity_level
								});
							}
						},function() {
							if(!$(this).hasClass('sl-disabled')) {
								$(this).css({
									opacity:1
								});
							}
						});

						$(options.container + ' .sl-controls .sl-next').click(function() {
							if(!$(this).hasClass('sl-disabled')) {
								if($(options.container + ' .sl-controls .sl-previous').hasClass('sl-disabled')) {
									$(options.container + ' .sl-controls .sl-previous').removeClass('sl-disabled');
									$(options.container + ' .sl-controls .sl-previous').css({
										opacity:1
									});
								}
								slideshow_cs++;
								console.log("Next slideshow image...");
								defaultFadeOut(slideshow_cc);

								if(slideshow_cc === '.sl-image-a') {
									slideshow_cc = '.sl-image-b';
								} else {
									slideshow_cc = '.sl-image-a';
								}

								for(var i = 0; i < slideshow_images.length; i++) {
									if(slideshow_images[i].id === slideshow_cs) {
										$(options.container + ' ' + slideshow_cc).html(slideshow_images[i].image.result);
										$(options.container + ' ' + slideshow_cc + ' img').addClass(options.slides.class);

										$(options.container + ' ' + slideshow_cc + ' img').css({
											position:'absolute',
											left:slideshow_images[i].position[0]+'px',
											top:slideshow_images[i].position[1]+'px'
										});
										defaultFadeIn(options.container + ' ' + slideshow_cc);
									}
								}

								if(slideshow_cs >= slideshow_images.length-1) {
									$(this).css({
										opacity:slideshow_disabled_opacity_level
									});
									$(this).addClass('sl-disabled');
								}
							}
						});
					}
				} else {
					// Not available
				}

				$(options.container + ' .sl-controls .sl-previous').addClass('sl-disabled');

				// Auto Button
				// TBD

			}

		}

		// Show slideshow
		defaultFadeIn(options.container);
	} else {
		console.log("Error! Container does not exist.");

	}

}

function closeSlideshow(target) {
	defaultFadeOut(target);
}



// ##############################
// No Video Page
// ##############################

function initNoVideoPage() {

	window.parent.setPlayPause("pause");

	if(arguments[0] !== undefined) {
		if(typeof(arguments[0] === 'string')) {
			if(window.parent.getAudioById(arguments[0]) !== null) {
				window.parent.playAudio(arguments[0]);
				var speakerAudio = window.parent.getAudioById(arguments[0]);

				try {
					speakerAudio.audio.on("complete",function() {
						console.log("Audio completed!");
						window.parent.setPlayPause("play");
						window.parent.togglePlayPause(false);
						window.parent.highlightNext();
					},this);
				} catch(e) {
					console.log("Audio Error");
				}
			}
		}
	} else {
		window.parent.togglePlayPause(false);
		window.parent.highlightNext();
	}
}

// ##############################
// Introduction Page
// ##############################

function initIntroductionPage(obj) {

	togglePlayPause(false);

	$('.introduction-text p').html(obj.text);
	$('.introduction-text').css('top',obj.marginTop);

	defaultFadeIn('.mediaContainer');

	// mediaContainer, mediaContainer > introduction-bg, intrduction-text

	showImage('background','.introduction-bg',{
		closeButton:false,
		background:false,
		backgroundColor:"rgba(255,255,255,1)",
		backgroundClickthrough:true,
		position:[0,0],
		className:''
	});

	defaultFadeIn('.introduction-text');

}

// ##############################
// Audio
// ##############################

function stopAudio(arg) {
	window.parent.stopAudio(arg);
}
