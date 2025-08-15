// ######################################################################################

// This file contains variables, methods etc. which can be used for createjs animations

// ######################################################################################

// Global variables
var that = null;
var isMobile = false;

window.parent.toggleButton('#btn-reload',true);

function getInternetExplorerVersion()
{
	var rv = -1;
	if (navigator.appName == 'Microsoft Internet Explorer')
	{
		var ua = navigator.userAgent;
		var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat( RegExp.$1 );
	}
	else if (navigator.appName == 'Netscape')
	{
		var ua = navigator.userAgent;
		var re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat( RegExp.$1 );
	}
	return rv;
}


function shuffleArray(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

function openExcursion(id) {
	window.parent.openExcursion(id);
}

if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;


// Anonymous function to avoid polluting the global scope. Will be triggered after a createjs page has been opened.

function initClasses(id) {
	
	// ##########################
	// Initialization
	// ##########################

	var stageWidth,stageHeight;
	
	var numOfSounds = 0;
	var soundsLoaded = 0;
	var soundInstances = [];
	
	var soundsPreloaded = false;
	var imagesPreloaded = false;

	createjs.Stage.prototype.init = function(mc) {
		that = mc;
		that.speakerAudio = undefined;
		that.imageContainer = [];
		that.preloadImages = false;
		that.preloadSounds = false;
		
		var _comp = AdobeAn.getComposition(id);
		var _lib = _comp.getLibrary();
		var _canvas = document.getElementById("canvas");
		
		that.lib = _lib;
		
		try {
			that.stageWidth = _lib.properties.width;
			that.stageHeight = _lib.properties.height;
		} catch(err) {
			try {
				that.stageWidth = lib.properties.width;
				that.stageHeight = lib.properties.height;
			} catch(err) {
				that.stageWidth = _canvas.clientWidth;
				that.stageHeight = _canvas.clientHeight;
			}
			
		}

		stageWidth = that.stageWidth;
		stageHeight = that.stageHeight;
		
		if(that.externalSounds == undefined) {
			that.externalSounds = [];
		}
		if(that.externalImages == undefined) {
			that.externalImages = [];
		}
		
		if(that.externalImages.length > 0) { that.preloadImages = true; };
		if(that.externalSounds.length > 0) { that.preloadSounds = true; };
		
		console.log("Preload Images: " + that.preloadImages + "; Preload Sounds: " + that.preloadSounds);

		window.parent.setPlayPause('pause');
		window.parent.togglePlayPause(false);
		window.parent.canvasTimeline = that;
		
		// Preload
		
		if(that.preloadImages | that.preloadSounds) {
			that.stop();
			var loadingScreen = that.addChild(new LoadingScreen());
			
			// ****************
			// Image Preloader
			// ****************
			
			if(that.preloadImages) {
				that.imageContainer = [];
				var queue = new createjs.LoadQueue(true);
				// If ONE image is loaded
			    queue.on("fileload", function(event) {
					var result = event.result;
					var bitmap = new createjs.Bitmap(result);
					bitmap.id = event.item.id;
					bitmap.alpha = 0;
					that.imageContainer.push(bitmap);
			    }, this);
				// If ALL images are loaded
			    queue.on("complete", function(event) {
			    	console.log("All images have been loaded!");
					imagesPreloaded = true;
			
					if(that.preloadSounds) {
						// If sound has loaded before the images, continue playing
						if(soundsPreloaded) {
							// If its not mobile, just play it
							if(!isMobile) {
								createjs.Tween.get(loadingScreen).to({alpha: 0},600).call(function() {
									that.removeChild(loadingScreen);
									that.play();
								})
							} else {
								// [Mobile] If there is sound, you need to interact in order to play it
								createjs.Tween.get(loadingScreen).to({alpha: 0},600).call(function() {
									that.removeChild(loadingScreen);
									
									var mobileScreen = that.addChild(new MobileScreen());
									mobileScreen.alpha = 0;
									createjs.Tween.get(mobileScreen).to({alpha: 1},600);
								
									mobileScreen.on("click",function() {
										createjs.Tween.get(this).to({alpha: 0},600).call(function() {
											that.removeChild(this);
											that.play();
										});
									});
								});
							}
						}
					// If there are no sounds for preloading
					} else {
						
						createjs.Tween.get(loadingScreen).to({alpha: 0},600).call(function() {
							that.removeChild(loadingScreen);
							that.play();
						})
						
					}
					
			    }, this);
		
				queue.loadManifest(that.externalImages);
			}
			
			// ****************
			// Sound Preloader
			// ****************
			
			if(that.preloadSounds) {
				createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin, createjs.FlashPlugin]);
				
				numOfSounds = that.externalSounds.length;
				
				/*
				var _audioPath = "";
				if(window.parent.getCurrentPage().path.indexOf("/") != -1) {
					_audioPath = window.parent.getCurrentPage().path.slice(0,window.parent.getCurrentPage().path.indexOf("/"));
				} else {
					_audioPath = window.parent.getCurrentPage().path;	
				}
				*/
				
				//var audioPath = "../../"+window.parent.contentPath+_audioPath+ "/";
				
				var audioPath = "";

				createjs.Sound.on("fileload",function(evt,data) {
					soundsLoaded++;
					if(soundsLoaded == numOfSounds) {
						console.log("All sounds loaded!");
						soundsPreloaded = true;
						if(that.preloadImages) {
							// If images have been loaded before the sound, continue playing
							if(imagesPreloaded) {
								if(!isMobile) {
									createjs.Tween.get(loadingScreen).to({alpha: 0},600).call(function() {
										that.removeChild(loadingScreen);
										that.play();
									})
								} else {
									createjs.Tween.get(loadingScreen).to({alpha: 0},600).call(function() {
										that.removeChild(loadingScreen);
										
										var mobileScreen = that.addChild(new MobileScreen());
										mobileScreen.alpha = 0;
										createjs.Tween.get(mobileScreen).to({alpha: 1},600);
				
										mobileScreen.on("click",function() {
											createjs.Tween.get(this).to({alpha: 0},600).call(function() {
												that.removeChild(this);
												that.play();
											});
										});
									});
								}
							}
						// No images, therefor continue playing
						} else {
							if(!isMobile) {
								createjs.Tween.get(loadingScreen).to({alpha: 0},600).call(function() {
									that.removeChild(loadingScreen);
									that.play();
								})
							} else {
								var mobileScreen = that.addChild(new MobileScreen());
								mobileScreen.alpha = 0;
								createjs.Tween.get(mobileScreen).to({alpha: 1},600).call(function() {
									createjs.Tween.get(loadingScreen).to({alpha: 0},600).call(function() {
										that.removeChild(loadingScreen);
									});
								});
				
								mobileScreen.on("click",function() {
									createjs.Tween.get(this).to({alpha: 0},600).call(function() {
										that.removeChild(this);
										that.play();
									});
								});
							}
						}
					}
				}, null, false, {scope:that,loadScreen:loadingScreen});
				createjs.Sound.registerSounds(that.externalSounds, audioPath);
			}
		}
	}

	createjs.MovieClip.prototype.getImageById = function(id) {
		for(var i = 0; i<that.imageContainer.length; i++) {
			if(that.imageContainer[i].id == id) {
				return that.imageContainer[i];
			}
		}
		
		return null;
	}

	// ##########################
	// Sound Handling
	// ##########################

	createjs.MovieClip.prototype.playSound = function(id) {
		
		var soundInstance = createjs.Sound.play(id);
		if(parent.isMuted()) {
			soundInstance.volume = 0;
		}
		if(id.indexOf("speaker") != -1) {
			if(this.speakerAudio != undefined && this.speakerAudio != null) {
				this.speakerAudio.stop();
			}
			this.speakerAudio = soundInstance;
		}
		
	}
	
	createjs.MovieClip.prototype.pauseSpeaker = function(id) {
		
		if(id.indexOf("speaker") != -1) {
			if(this.speakerAudio != undefined && this.speakerAudio != null) {
				this.speakerAudio.paused = true;
			}
		}
		
	}

	
	// ##########################
	// Add Interaction Icon
	// ##########################
	
	function InteractionIcon(posX,posY) {
		this.MovieClip_constructor();
		this.setup(posX,posY);
	}
	
	var ii = createjs.extend(InteractionIcon, createjs.MovieClip);
	
	ii.setup = function(posX,posY) {
	
		var pic;
		
		if(isMobile) {
			console.log("Mobile Interaction");
			pic = new createjs.Bitmap("../../content/images/"+window.parent.interactionIcon);
		} else {
			console.log("Computer Interaction");
			pic = new createjs.Bitmap("../../content/images/"+window.parent.interactionIcon);
		}
		
		pic.alpha = 0;
		
		pic.x = posX;
		pic.y = posY;
		pic.fade(true);
		this.addChild(pic);
	}
	
	window.InteractionIcon = createjs.promote(InteractionIcon, "MovieClip");
	
	// ##########################
	// Log
	// ##########################
	
	createjs.DisplayObject.prototype.log = function(str) {
		parent.log(str);
	}
	
	// ##########################
	// Reload Page Method
	// ##########################
	
	createjs.Container.prototype.reload = function(that,id) {
		window.location.reload();
	}
	
	// ##########################
	// Highlight Next Method
	// ##########################
	
	createjs.Container.prototype.highlightNext = function() {
		parent.highlightNext();
	}
	
	// ##########################
	// Toggle Button
	// ##########################
	
	createjs.Container.prototype.toggleButton = function(id,enabled) {
		parent.toggleButton(id,enabled);
	}
	
	// ##########################
	// Toggle Navigation
	// ##########################
	
	createjs.Container.prototype.toggleNavigation = function(str,enable) {
		parent.toggleNavigation(str,enable);
	}
	
	// ##########################
	// Fade Method
	// ##########################
	
	createjs.DisplayObject.prototype.fade = function(fadeIn) {
		if(fadeIn) {
			createjs.Tween.get(this).to({alpha: 1},800);
		} else {
			createjs.Tween.get(this).to({alpha: 0},800);
		}
	}
	
	// ##########################
	// Hide & Show
	// ##########################
	
	createjs.DisplayObject.prototype.hide = function() {
		this.alpha = 0.05;
	}
	createjs.DisplayObject.prototype.show = function() {
		this.alpha = 1;
	}
	
	// ##########################
	// Roll Over Method (Invisible)
	// ##########################

	createjs.DisplayObject.prototype.defaultHover = function() {
		this.cursor = "pointer";
		this.on("mouseover", function() {
			this.alpha = 1;
		});
		this.on("mouseout", function() {
			this.alpha = 0.05;
		});
		this.on("pressmove", function() {
			this.alpha = 0.05;
		});
		this.on("mousedown", function() {
			this.alpha = 1;
		});
	}
	
	// ##########################
	// Roll Over Method (Buttons)
	// ##########################
	
	createjs.DisplayObject.prototype.alphaHover = function() {
		this.cursor = "pointer";
		this.on("mouseover", function() {
			this.alpha = 0.8;
		});
		this.on("mouseout", function() {
			this.alpha = 1;
		});
		this.on("pressmove", function() {
			this.alpha = 1;
		});
		this.on("mousedown", function() {
			this.alpha = 0.8;
		});
	}
	
	// ##########################
	// Load Picture Method
	// ##########################
	
	createjs.DisplayObject.prototype.addPicture = function(src) {
		var suffix = ".svg";
		if(getInternetExplorerVersion() == 11) {
			suffix = ".png";
		}
		var pic = new createjs.Bitmap("../../content/"+src+suffix);
		pic.setBounds(0,0,200,200);
		return pic;
	}

	// ##########################
	// Loading Screen Class
	// ##########################
	
	function LoadingScreen() {
		this.Container_constructor();
		this.setup();
	}
	
	var ls = createjs.extend(LoadingScreen, createjs.Container);

	ls.setup = function() {
		var shape = new createjs.Shape();
		var _stageWidth = stageWidth;
		var _stageHeight = stageHeight;
		if(that.stageWidth != undefined) {
			_stageWidth = that.stageWidth;
		} 
		if(that.stageHeight != undefined) {
			_stageHeight = that.stageHeight;
		}
		shape.graphics.beginFill("#FFFFFF").drawRect(0,0,_stageWidth,_stageHeight).endFill();
		var pic = new createjs.Bitmap("../../content/images/loading.gif");
		pic.x = _stageWidth/2 - 30;
		pic.y = _stageHeight/2 - 30;
		this.addChild(shape,pic);
	}
	
	window.LoadingScreen = createjs.promote(LoadingScreen, "Container");
	
	
	// ##########################
	// Mobile Screen Class
	// ##########################
	
	
	function MobileScreen() {
		this.Container_constructor();
		this.label = "Touch to continue";
		this.textFormat = "26px Arial";
		this.textColor = "#666666";
		this.setup();
	}
	
	var ms = createjs.extend(MobileScreen, createjs.Container);
	
	ms.setup = function() {
		var text = new createjs.Text(this.label, this.textFormat, this.textColor);
		text.textBaseline = "top";
		text.textAlign = "left";
		
		var _stageWidth = stageWidth;
		var _stageHeight = stageHeight;
		if(that.stageWidth != undefined) {
			_stageWidth = that.stageWidth;
		} 
		if(that.stageHeight != undefined) {
			_stageHeight = that.stageHeight;
		}
		
		
		var shape = new createjs.Shape();
		shape.graphics.beginFill("#FFFFFF").drawRect(0,0,_stageWidth,_stageHeight).endFill();
		
		var pic = new createjs.Bitmap("../../content/images/touch.svg");
	
		pic.setTransform(null,null,0.3,0.3);
		pic.x = _stageWidth/2-200;
		pic.y = _stageHeight/2-70;
		
		text.x = pic.x + 170;
		text.y = Math.floor(_stageHeight/2-(text.getMeasuredHeight()/2));
		

		this.cursor = "pointer";
		this.mouseChildren = false;

		this.addChild(shape,pic,text);
		
	}
	
	window.MobileScreen = createjs.promote(MobileScreen, "Container");
	
	// ##########################
	// Button Class
	// ##########################
	
	function Button(label,size,action,arg) {
		arg = arg || 0;
		this.Container_constructor();
		switch(size) {
			case 'small':
				this.textFormat = "bold 12px Arial";
				this.textColor = "#ffffff";
				break;
			case 'medium':
				this.textFormat = "bold 14px Arial";
				this.textColor = "#ffffff";
				break;
			case 'big':
				this.textFormat = "bold 16px Arial";
				this.textColor = "#ffffff";
				break;
			default:
				this.textFormat = "bold 14px Arial";
				this.textColor = "#ffffff";
				break;
		}
		
		this.shapeColor = "#3296B9";
		this.paddingX = 15;
		this.paddingY = 10;
		this.label = label;
		this.handleClick = action;
		this.alpha = 0;
		this.enable = true;
		
		this.setup();
		
		if(arg == "disable") {
			this.mouseEnabled = false;
			createjs.Tween.get(this).to({alpha: 0.5},800);
			
		} else if(arg == 0){
			this.fade(true);
		}
	}
	
	var p = createjs.extend(Button, createjs.Container);

	p.setup = function() {
		
		var text = new createjs.Text(this.label, this.textFormat, this.textColor);
		text.textBaseline = "top";
		text.textAlign = "center";
		
		var width = Math.floor(text.getMeasuredWidth() + (2*this.paddingX));
		var height = Math.floor(text.getMeasuredHeight()+ (2*this.paddingY));
		
		this._width = width;
		this._height = height;
		
		text.x = Math.floor(width/2);
		text.y = Math.floor(this.paddingY-2);
		
		var background = new createjs.Shape();
		background.graphics.beginFill(this.shapeColor).drawRoundRect(0,0,width,height,8).endFill();

		this.addChild(background, text);
		this.cursor = "pointer";
		this.mouseChildren = false;
		this.on("click",this.handleClick);
		
		this.on("mouseover", function() {
			//console.log("classes.js");
			if(this.enable) {
				this.alpha = 0.8;
			}
		});
		this.on("mouseout", function() {
			if(this.enable) {
				this.alpha = 1;
			}
		});
		this.on("pressmove", function() {
			if(this.enable) {
				this.alpha = 1;
			}
		});
		this.on("mousedown", function() {
			if(this.enable) {
				this.alpha = 0.8;
			}
		});
	};
	
	p.handleRollOver = function(event) {
		this.alpha = event.type == "rollover" ? 0.4 : 1;
	}

	window.Button = createjs.promote(Button, "Container");

};
