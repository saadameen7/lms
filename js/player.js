// #####################
// Settings
// #####################

var language = "de"; // Default langauge
var scormEnabled = false;

// Themes

var designTemplate = "";
var designTemplates,currentDesign;

// Logging Stuff

var consoleLogs = true;
var jsPanelLogs = false;

// Misc

var forceSequencing = true; // If set to true, the Next button will always be enabled
var forceTaskSequencing = false; // If set to true, tasks can be skipped
var cheatmode = false; // If enabled, you can click through the whole wbt
var showDisclaimer = false; // If disabled, there will be no disclaimer in the beginning
var showLanguageSelection = true // If disabled, there will be no language selection in the beginning
var showIntro = true;
var showBreadcrumbTooltips = true;
var expertEmail = "";
var passThreshold = 0;	// Percentage needed to pass the tests in the training
var cpvar = []; // Global variable for passing variables to iframe content
var interactiveTasksDone = []; // If the multiple emulator task template is used

var showPageNrInMenu = true; // If set to true, the chapter and page numbers are shown in the menu
var showPageNrInBreadcrumb = false; // If set to true, the chapter and page numbers are shown in the breadcrumb
var showWBTtitleInBreadcrumb = true; // If set to true, the title of the web based training will be shown in the breadcrumb instead of alternativeWBTtitleInBreadcrumb;
var shortenBreadcrumb = true; // If set to true, the breadcrumbs will get shortened
var disableRightClick = false;
var enableLogging = true;
var alternativeWBTtitleInBreadcrumb = "WBT";
var allowControlsAfterWatching = false;

var showExcursionsInMenu = false; // DO NOT ACTIVATE. If set to true, excursions will be shown as an extra chapter in the menu structure
var includeExcursionsInScore = false; // If set to true, excursions will be included in the learning progress

var completionCondition = "";
/* ### Conditions for completing the WBT. Possible values are:
"progress" = When reaching 100% completion rate (recommended)
"progress-and-testScore" = When reaching 100% completion rate and the completionRequiredTestScore
"score-or-testScore" = When reaching either completionRequiredTestScore and/or completionRequiredScore
*/

var completionRequiredTestScore = 80; // In percent. XX % of all mandatory questions in the WBT
var actualTestScore = 0;
var mandatoryQuestions = [];
var mandatoryQuestionsDone = [];

var completionRequiredScore = 80; // In POINTS. score/maxScore

// #####################
// SCORM 2004 Variables
// #####################

var startTimeStamp = null;
var processedUnload = false;
var reachedEnd = false;

// #####################
// Score Counter
// #####################

var showScore = true; // If set to true, there will be a score counter on the top right
var maxScore = 0; // How many points can you get. The sum is calculated automatically. Add "score=x" in the options tag inside the JSON, where x is a number.
var score = 0; // Current score

// Get IE or Edge browser version
var _result = "";
var version = detectIE();

// #####################
// Preload JS
// #####################

createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin, createjs.FlashPlugin]);

var pageAudio = [];
var pageImages = [];
var audioAutostart = false;
var currentAudio = null;

// #####################
// Variables
// #####################

var buttons = [];
var glossarySigns = [];
var logpanel = null;
var speakerSound = null;
var speakertextIsOpen = false;
var isMobile = false;
var audioLoaded = false;
var imagesLoaded = false;
var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
var jsonLanguage,jsonSettings,jsonStructure,jsonGlossary,jspanel,jsonMetadata;
var detectLanguage;
var copyrightMessage = "";
var contentPath = "content_"+language + "/";
var isCompleted = false;
var certificationLink = "";
var interactionIcon = "mouse-interaction.png";
var showSearchField = false;
var contentWidthWide, contentWidthStandard, contentHeight;
var widthBuffer = 30;
var speakertextBuffer = -16;
var fullFrameWidth = 994;
var searchOpen = false;
var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
var suspendData = {
	pages:[],
	points:[],
	data:[]
}

// Menu

var menuOpen = false;
var menuDomContainer = [];

// JSPanel Positions

var jspX = '';
var jspY = '';
var jspW = '';
var jspH = '';

// Player Content

var wbttitle = "";
var headerWbttitle = "";
var chapters = [];
var pages = [];
var pagesWithScore = [];

var excursionDeparturePage = ""; // Page ID
var excursionDeparturePageTime = 0;

var pagesDone = []; // Check after SCORM initialization, to set .done to true
var _pagesDone = []; // String Container for SCORM evaluation
var percentageDone = 0;

var currentPage = -1; // -1 because of the intro
var comingFromIntro = true; // initPage prolog

var playPauseState = "";
var introPage = new Object();
var currentVideoPlayer = null;
var currentFrameBody = null;
var canvasTimeline = null;

// SCORM

var currentLocation = 0;

// #####################
// jQuery Initialisation
// #####################

var xmlhttp1 = new XMLHttpRequest(); // settings.json
var xmlhttp2 = new XMLHttpRequest(); // language.json
var xmlhttp3 = new XMLHttpRequest(); // data.json

$(document).ready(function() {

	// Get dimensions

	var height_browser = $(window).height();   // height of browser viewport
	var height_document = $(document).height(); // height of HTML document
	var height_screen = screen.height;	// height of screen
	var width_browser = $(window).width();   // width of browser viewport
	var width_document = $(document).width(); // width of HTML document
	var width_screen = screen.width;	// width of screen

	// Device detetction
	if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
	    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;

	/*
	log('# Dimensions (Width / Height)');
	log('Screen: ' + width_screen + " / "+ height_screen);
	log('Browser viewport: ' + width_browser + " / "+ height_browser);
	log('Document: ' + width_document + " / "+ height_document);
	log("Mobile device: " + isMobile);
	*/

	if(isMobile && width_screen <= 400) {
		alert('It is not recommended to view this web-based training on a smartphone.');
	}

	// Parsing settings.json

	xmlhttp1.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var j_obj = JSON.parse(this.responseText);
			jsonSettings = j_obj.settings;
			jsonMetadata = j_obj.metadata;
			designTemplates = j_obj.designTemplates;
			language = jsonSettings.defaultLanguage;
			certificationLink = jsonSettings.certificationLink;

			var navLanguage = window.navigator.userLanguage || window.navigator.language;

			if(jsonSettings.detectLanguage) {
				if(navLanguage.indexOf("de") != -1) {
					language = "de";
				} else if(navLanguage.indexOf("en") != -1) {
					language = "en";
				} else if(navLanguage.indexOf("es") != -1) {
					language = "es";
				} else {
					// Do nothing
				}
			}

			contentPath = "content_"+language + "/";

			scormEnabled = jsonSettings.scormEnabled;
			scormVersion = jsonSettings.scormVersion;
			expertEmail = jsonSettings.expertEmail;
			passThreshold = jsonSettings.passThreshold;
			showWBTtitleInBreadcrumb = jsonSettings.showWBTtitleInBreadcrumb;
			designTemplate = jsonSettings.designTemplate;
			showLanguageSelection = jsonSettings.showLanguageSelection;
			showDisclaimer = jsonSettings.showDisclaimer;
			completionCondition = jsonSettings.completionCondition;
			showScore = jsonSettings.showScore;
			showIntro = jsonSettings.showIntro;
			disableRightClick = jsonSettings.disableRightClick;
			forceSequencing = jsonSettings.forceSequencing;
			enableLogging = jsonSettings.enableLogging;
			forceTaskSequencing = jsonSettings.forceTaskSequencing;
			showPageNrInMenu = jsonSettings.showPageNrInMenu;
			showPageNrInBreadcrumb = jsonSettings.showPageNrInBreadcrumb;
			showWBTtitleInBreadcrumb = jsonSettings.showWBTtitleInBreadcrumb;
			shortenBreadcrumb = jsonSettings.shortenBreadcrumb;
			showSearchField = jsonSettings.showSearchField;
			contentWidthWide = jsonSettings.playerDimensions.contentWidthWide;
			contentWidthStandard = jsonSettings.playerDimensions.contentWidthStandard;
			contentHeight = jsonSettings.playerDimensions.contentHeight;
			speakertextFontSize = jsonSettings.speakertext.fontSize;
			allowControlsAfterWatching = jsonSettings.allowControlsAfterWatching;

			// Window unloads

			if(scormEnabled) {
				window.onunload = scormOut;
				window.onbeforeunload = scormOut;
			}

			// Logging

			if(!enableLogging) {
				console.log("Logging is disabled.")
				console.log = function() {}
			}

			console.log("settings.json loaded successfully.");

			// Resize Player

			$('#playerFrame').attr('width',contentWidthWide + 'px');
			$('#playerFrame').attr('height',contentHeight + 'px');

			// Buttons

			if(!jsonSettings.activeButtons.btnMute) $('#btn-mute').remove();
			if(!jsonSettings.activeButtons.btnSpeakertext) $('#btn-speakertext').remove();
			if(!jsonSettings.activeButtons.btnPrint) $('#btn-print').remove();
			if(!jsonSettings.activeButtons.btnGlossary) $('#btn-glossary').remove();
			if(!jsonSettings.activeButtons.btnInfo) $('#btn-info').remove();
			if(!jsonSettings.activeButtons.btnHelp) $('#btn-help').remove();
			if(!jsonSettings.activeButtons.btnExpert) $('#btn-expert').remove();

			// Load language.json

			xmlhttp2.open("GET", "content/language.json", true);
			xmlhttp2.send();

		}
	}

	// Parsing language.json

	xmlhttp2.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var j_obj = JSON.parse(this.responseText);
			jsonLanguage = j_obj.language;

			if (version === false | version >= 11) {
				initProlog();
			} else {
				if(version < 11) {
					console.log("IE 10 or less detected");
					bootbox.alert({
						title: lang(jsonLanguage.browserCheck.title),
						size: "large",
						message: lang(jsonLanguage.browserCheck.content),
						callback: function(result){
							window.close();
							initProlog();
						}
					}).find('.modal-content').css({
						'margin-top':'100px'
					});
				}
			}
		}
	}

	// Parsing data.json

	xmlhttp3.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
			console.log("data.json loaded successfully.");

	    var myObj = JSON.parse(this.responseText);
			jsonStructure = myObj.wbt.structure.children;
			jsonGlossary = myObj.wbt.glossary;
			wbttitle = myObj.wbt.structure.title;

			if(myObj.wbt.structure.headerTitle != undefined && myObj.wbt.structure.headerTitle != "") {
				headerWbttitle = myObj.wbt.structure.headerTitle;
			} else {
				headerWbttitle = wbttitle;
			}

			// Remove Glossary Button if there is no glossary
			if(jsonGlossary.length == 0) {
				if($('#btn-glossary').length) {
					console.log("No glossary items found. Removing 'Glossary' button.");
					$('#btn-glossary').remove();
				}
			}

			for(var i = 0; i<jsonStructure.length; i++) {
				//log((i+1) +". " + jsonStructure[i].title + " ("+jsonStructure[i].type+")");

				if(jsonStructure[i].type.toLowerCase() == "chapter") {
					var chap = {
						id:String(i+1),
						nr:String(i+1),
						done:false,
						title:jsonStructure[i].title,
						type:jsonStructure[i].type.toLowerCase(),
						options:"",
						children:[]
					}

					if(jsonStructure[i].id != undefined) {
						chap.id = jsonStructure[i].id;
					}
					if(jsonStructure[i].options != undefined) {
						chap.options = jsonStructure[i].options;
					}

					chapters.push(chap);

				}

				// If there are sub-chapters or pages
				if(jsonStructure[i].children != undefined) {
					for(var j = 0; j<jsonStructure[i].children.length; j++) {

						var _tempPath = '';

						if(jsonStructure[i].children[j].path !== undefined) {
							_tempPath = jsonStructure[i].children[j].path;
						} else {
							_tempPath = jsonStructure[i].children[j].folder;
						}

						//log("   "+(i+1) +"."+(j+1)+". " + jsonStructure[i].children[j].title + " ("+jsonStructure[i].children[j].type+")");

						if(jsonStructure[i].children[j].type.toLowerCase() == "chapter" | jsonStructure[i].children[j].type.toLowerCase() == "subchapter") {
							var _chap = {
								id:(i+1)+"-"+(j+1),
								nr:(i+1)+"."+(j+1),
								done:false,
								title:jsonStructure[i].children[j].title,
								type:jsonStructure[i].children[j].type.toLowerCase(),
								options:"",
								children:[]
							}

							if(jsonStructure[i].children[j].id != undefined) {
								_chap.id = jsonStructure[i].children[j].id;
							}
							if(jsonStructure[i].children[j].options != undefined) {
								_chap.options = jsonStructure[i].children[j].options;
							}

							chap.children.push(_chap);
						} else {
							//console.log("Should be a page: " + jsonStructure[i].children[j].type.toLowerCase());
							// Must be a page


							var page = {
								i:0,
								id:(i+1)+"-"+(j+1),
								nr:(i+1)+"."+(j+1),
								done:false,
								completed:false,
								options:"",
								maxScore:0,
								score:[],
								title:jsonStructure[i].children[j].title,
								type:jsonStructure[i].children[j].type.toLowerCase(),
								path:_tempPath,
								text:parseSpeakertext(jsonStructure[i].children[j].text),
								originalText:parseSpeakertext(jsonStructure[i].children[j].text)
							}

							preparePage(page,jsonStructure[i].children[j]);

							if(jsonStructure[i].children[j].id != undefined) {
								page.id = jsonStructure[i].children[j].id;
							}

							if(jsonStructure[i].children[j].options != undefined) {
								page.options = jsonStructure[i].children[j].options;

								if(showScore) {
									if(page.options.indexOf("score=") != -1) {
										var _arr = page.options.split(",");
										for(var n = 0; n<_arr.length; n++) {
											if(_arr[n].indexOf("score=") != -1) {
												var _score = Number(_arr[n].slice("score=".length,_arr[n].length));
												if(_score != NaN) {
													page.maxScore = _score;
													maxScore+=_score;
													for(var o = 0; o < _score; o++) {
														var _point = {
															taken:false,
														}
														page.score.push(_point);
													}
												}
											}
										}
									}
								}
							}
							if(page.score.length > 0) {
								pagesWithScore.push(page);
							}

							if(isOption(page.options,"mandatory")) {
								mandatoryQuestions.push(page);
							}

							pages.push(page);
							chap.children.push(page);
						}

						// If there are sub-sub-chapters or pages
						if(jsonStructure[i].children[j].children != undefined) {
							for(var k = 0; k<jsonStructure[i].children[j].children.length; k++) {

								var _tempPath = '';

								if(jsonStructure[i].children[j].children[k].path !== undefined) {
									_tempPath = jsonStructure[i].children[j].children[k].path;
								} else {
									_tempPath = jsonStructure[i].children[j].children[k].folder;
								}

								//log("      "+(i+1) +"."+(j+1)+"."+(k+1)+". " + jsonStructure[i].children[j].children[k].title + " ("+jsonStructure[i].children[j].children[k].type+")");

								if(jsonStructure[i].children[j].children[k].type.toLowerCase() == "chapter" | jsonStructure[i].children[j].children[k].type.toLowerCase() == "subsubchapter") {
									var __chap = {
										id:(i+1)+"-"+(j+1)+"-"+(k+1),
										nr:(i+1)+"."+(j+1)+"."+(k+1),
										done:false,
										title:jsonStructure[i].children[j].children[k].title,
										type:jsonStructure[i].children[j].children[k].type.toLowerCase(),
										options:"",
										children:[]
									}

									if(jsonStructure[i].children[j].children[k].options != undefined) {
										__chap.options = jsonStructure[i].children[j].children[k].options;
									}

									if(jsonStructure[i].children[j].children[k].id != undefined) {
										__chap.id = jsonStructure[i].children[j].children[k].id;
									}

									_chap.children.push(__chap);
								} else {
									// Must be a page
									var page = {
										i:0,
										id:(i+1)+"-"+(j+1)+"-"+(k+1),
										nr:(i+1)+"."+(j+1)+"."+(k+1),
										done:false,
										completed:false,
										options:"",
										maxScore:0,
										score:[],
										title:jsonStructure[i].children[j].children[k].title,
										type:jsonStructure[i].children[j].children[k].type.toLowerCase(),
										path:_tempPath,
										text:parseSpeakertext(jsonStructure[i].children[j].children[k].text),
										originalText:parseSpeakertext(jsonStructure[i].children[j].children[k].text)
									}

									preparePage(page,jsonStructure[i].children[j].children[k]);

									if(jsonStructure[i].children[j].children[k].id != undefined) {
										page.id = jsonStructure[i].children[j].children[k].id;
									}

									if(jsonStructure[i].children[j].children[k].options != undefined) {
										page.options = jsonStructure[i].children[j].children[k].options;

										if(showScore) {
											if(page.options.indexOf("score=") != -1) {
												var _arr = page.options.split(",");
												for(var n = 0; n<_arr.length; n++) {
													if(_arr[n].indexOf("score=") != -1) {
														var _score = Number(_arr[n].slice("score=".length,_arr[n].length));
														if(_score != NaN) {
															page.maxScore = _score;
															maxScore+=_score;
															for(var o = 0; o < _score; o++) {
																var _point = {
																	taken:false,
																}
																page.score.push(_point);
															}
														}
													}
												}
											}
										}
									}
									if(page.score.length > 0) {
										pagesWithScore.push(page);
									}

									if(isOption(page.options,"mandatory")) {
										mandatoryQuestions.push(page);
									}

									pages.push(page);
									_chap.children.push(page);
								}


								// Can only be pages now
								if(jsonStructure[i].children[j].children[k].children != undefined) {
									for(var l = 0; l<jsonStructure[i].children[j].children[k].children.length; l++) {
										//log("        "+(i+1) +"."+(j+1)+"."+(k+1)+"."+(l+1)+". " + jsonStructure[i].children[j].children[k].children[l].title + " ("+jsonStructure[i].children[j].children[k].children[l].type+")");

										var _tempPath = '';

										if(jsonStructure[i].children[j].children[k].children[l].path !== undefined) {
											_tempPath = jsonStructure[i].children[j].children[k].children[l].path;
										} else {
											_tempPath = jsonStructure[i].children[j].children[k].children[l].folder;
										}


										if(jsonStructure[i].children[j].children[k].children[l].type.toLowerCase() != "chapter" && jsonStructure[i].children[j].children[k].children[l].type.toLowerCase() != "subchapter" && jsonStructure[i].children[j].children[k].children[l].type.toLowerCase() != "subsubchapter") {

											var page = {
												i:0,
												id:(i+1)+"-"+(j+1)+"-"+(k+1)+"-"+(l+1),
												nr:(i+1)+"."+(j+1)+"."+(k+1)+"."+(l+1),
												done:false,
												completed:false,
												options:"",
												maxScore:0,
												score:[],
												title:jsonStructure[i].children[j].children[k].children[l].title,
												type:jsonStructure[i].children[j].children[k].children[l].type.toLowerCase(),
												path:_tempPath,
												text:parseSpeakertext(jsonStructure[i].children[j].children[k].children[l].text),
												originalText:parseSpeakertext(jsonStructure[i].children[j].children[k].children[l].text)
											}

											preparePage(page,jsonStructure[i].children[j].children[k].children[l]);

											if(jsonStructure[i].children[j].children[k].children[l].id != undefined) {
												page.id = jsonStructure[i].children[j].children[k].children[l].id;
											}

											if(jsonStructure[i].children[j].children[k].children[l].options != undefined) {
												page.options = jsonStructure[i].children[j].children[k].children[l].options;

												if(showScore) {
													if(page.options.indexOf("score=") != -1) {
														var _arr = page.options.split(",");
														for(var n = 0; n<_arr.length; n++) {
															if(_arr[n].indexOf("score=") != -1) {
																var _score = Number(_arr[n].slice("score=".length,_arr[n].length));
																if(_score != NaN) {
																	page.maxScore = _score;
																	maxScore+=_score;
																	for(var o = 0; o < _score; o++) {
																		var _point = {
																			taken:false,
																		}
																		page.score.push(_point);
																	}
																}
															}
														}
													}
												}
											}
											if(page.score.length > 0) {
												pagesWithScore.push(page);
											}
											if(isOption(page.options,"mandatory")) {
												mandatoryQuestions.push(page);
											}
											pages.push(page);
											__chap.children.push(page);
										}
									}
								}
							}
						}
					}
				}
			}

			for(var i = 0; i < chapters.length; i++) {
				if(!isOption(chapters[i].options,"excursion")) {
					// If no excursion, no special
				} else {
					if(chapters[i].children != undefined) {
						for(var j = 0; j < chapters[i].children.length; j++) {

							if(chapters[i].children[j].children != undefined) {
								for(var k = 0; k < chapters[i].children[j].children.length; k++) {

									if(chapters[i].children[j].children[k].children != undefined) {
										for(var l = 0; l < chapters[i].children[j].children[k].children.length; l++) {

										}
									} else {
										// If page
										chapters[i].children[j].children[k].nr = (k+1) + " / " + chapters[i].children[j].children.length;
									}
								}
							} else {
								// If page
								chapters[i].children[j].nr = (j+1) + " / " + chapters[i].children.length;
							}
						}
					}
				}
			}

			for(var i = 0; i < pages.length; i++) {
				pages[i].i = i;
			}

			// Init SCORM
			if(scormEnabled) {
				if(scormVersion === '1.2') {
					SCOInitialize();
				} else if(scormVersion === '2004') {
					startTimeStamp = new Date();
					ScormProcessInitialize();
				} else {
					SCOInitialize();
				}
			}

			if(showScore) {
				console.log("Total Score: " + maxScore);
			}

			// Init Menu
			initMenu();

			// Init Player
			initPlayer();

			// Init Controls
			initControls();

			// Init Search
			initSearch();

	    }
	};

	xmlhttp1.open("GET", "content/settings.json", true);
	xmlhttp1.send();

});


// #####################
// General Functions
// #####################

function parseSpeakertext(str) {
	// Glossary Links

	if(str !== undefined) {
		// Glossary
		var _r1 = /<a href=\"\/#\/glossaryItem\/(.*?)" class="glossarylink">(.*?)<\/a>/g;
		var _r2 = '<a class="glossary-link" href="#" onclick="openGlossaryEntry(\'$1\')">$2</a>';

		// Page
		var _r3 = /<a href=\"\/#\/page\/(.*?)" class="pagelink">(.*?)<\/a>/g;
		var _r4 = '<a class="page-link" href="#" onclick="initPage(\'$1\')">$2</a>';

		// Excursion
		var _r5 = /<a href=\"\/#\/excursion\/(.*?)" class="excursionlink">(.*?)<\/a>/g;
		var _r6 = '<a class="excursion-link" href="#" onclick="openExcursion(\'$1\')">$2</a>';

		var cleanedText = str.replace(_r1,_r2).replace(_r3,_r4).replace(_r5,_r6);

		//cleanedText = str.replace(_r3, _r4);

		//console.log("Glossary entry found at: " + str.search(_r1));
		//console.log("Cleaned text: " +cleanedText);
		return cleanedText;
	} else {
		return '';
	}

}

function resetFrameSize() {

	var arg = fullFrameWidth;

	if(arguments[0] !== undefined) {
		arg = parseInt(arguments[0]);
		if(arg == NaN | arg == undefined | arg == null) {
			arg = fullFrameWidth;
		}
	}

	var _w = parseInt($('#playerFrame').attr('width'), 10);
	var _h = parseInt($('#playerFrame').attr('height'), 10);

	if(_w !== arg) {
		console.log("Changing Width");
		$('#playerFrame').attr('width',fullFrameWidth+'px');
	}

	if(_h !== contentHeight) {
		console.log("Changing Height");
		$('#playerFrame').attr('height',contentHeight+'px');
	}

}

function setFrameSize(w,h) {
	$('#playerFrame').attr('width',w+'px');
	$('#playerFrame').attr('height',h+'px');
}

function detectIE() {
	var ua = window.navigator.userAgent;

	var msie = ua.indexOf('MSIE ');
	if (msie > 0) {
		// IE 10 or older => return version number
		return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
	}

	var trident = ua.indexOf('Trident/');
	if (trident > 0) {
		// IE 11 => return version number
		var rv = ua.indexOf('rv:');
		return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
	}

	var edge = ua.indexOf('Edge/');
	if (edge > 0) {
		// Edge (IE 12+) => return version number
		return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
	}

	// other browser
	return false;
}


function initScoreCounter() {
	console.log("Init Score Counter");
	$('.progress').css('margin-right','120px');
	$('.progress').css('width','210px');

	refreshScore();

}

function showScoreCounter() {
	$('#score-div').fadeIn(1000);
}

function takePoint() {
	for(var i = 0; i<arguments.length; i++) {
		if(!getCurrentPage().score[arguments[i]].taken) {
			getCurrentPage().score[arguments[i]].taken = true;
			score++;
		}
	}

	refreshScore();
}

function refreshScore() {
	$('#score-div span').html(score + " / " + maxScore);
}


function initProlog() {

	if(language == "de") {
		$('title').html(jsonMetadata.companyTitle + ' &middot; ' + lang(jsonLanguage.wbt));
	} else {
		$('title').html(jsonMetadata.companyTitle + ' &middot; ' + lang(jsonLanguage.wbt));
	}


	if(showLanguageSelection) {

		var _languageString = '';

		_languageString+= '<div class="form-group"><div class="selectContainer"><select id="langSelector" name="language" class="form-control input-lg">';
		for(var i = 0; i<jsonSettings.languages.length; i++) {
			console.log(jsonSettings.languages[i]);
			var _str = '';
			if(jsonSettings.languages[i] === 'de') {
				_str = lang(jsonLanguage.languageSelection.de);
			} else if(jsonSettings.languages[i] === 'en') {
				_str = lang(jsonLanguage.languageSelection.en);
			} else if(jsonSettings.languages[i] === 'es') {
				_str = lang(jsonLanguage.languageSelection.es);
			}
			_languageString+='<option value="'+jsonSettings.languages[i]+'">'+_str+'</option>';
		}
		_languageString+='</select></div></div>'



		bootbox.dialog({
			size: "small",
			title: lang(jsonLanguage.languageSelection.title),
		    message: _languageString,
			onEscape: false,
			backdrop: undefined,
			closeButton:false,
			className:'bootbox-language-selection',
		    buttons: {
		        confirm: {
		            label: lang(jsonLanguage.buttons.btnConfirm),
					callback: function() {
						//console.log($('.selectContainer').find("option:selected"));
						switch($('#langSelector').val()) {
						case 'en':
							language = 'en';
							break;
						case 'de':
							language = 'de';
							break;
						case 'es':
							language = 'es';
							break;
						default:
							language = 'en';
							break;
						}
						contentPath = "content_"+language + "/";
						if(showDisclaimer) {
							bootbox.confirm({
								size: "large",
								title: lang(jsonLanguage.disclaimer.title),
							    message: lang(jsonLanguage.disclaimer.content),
								className: 'bootbox-disclaimer',
							    buttons: {
							        confirm: {
							            label: lang(jsonLanguage.disclaimer.btnAccept)
							        },
									cancel: {
										label: lang(jsonLanguage.disclaimer.btnCancel)
									}
							    },
							    callback: function (result) {
							       	if(result) {
										xmlhttp3.open("GET", contentPath+"data.json", true);
										xmlhttp3.send();
							       	} else {
										window.close();
										// Load anyway just in case the window wasn't opened by JS
										xmlhttp3.open("GET", contentPath+"data.json", true);
										xmlhttp3.send();
							       	}
							    }
							});
						} else {
							xmlhttp3.open("GET", contentPath+"data.json", true);
							xmlhttp3.send();
						}
					}
		        }
		    }
		});
	} else {
		if(showDisclaimer) {
			bootbox.confirm({
				size: "large",
				title: lang(jsonLanguage.disclaimer.title),
			    message: lang(jsonLanguage.disclaimer.content),
				className: 'bootbox-disclaimer',
			    buttons: {
			        confirm: {
			            label: lang(jsonLanguage.disclaimer.btnAccept)
			        },
					cancel: {
						label: lang(jsonLanguage.disclaimer.btnCancel)
					}
			    },
			    callback: function (result) {
			       	if(result) {
						xmlhttp3.open("GET", contentPath+"data.json", true);
						xmlhttp3.send();
			       	} else {
						window.close();
						// Load anyway just in case the window wasn't opened by JS
						xmlhttp3.open("GET", contentPath+"data.json", true);
						xmlhttp3.send();
			       	}
			    }
			});
		} else {
			xmlhttp3.open("GET", contentPath+"data.json", true);
			xmlhttp3.send();
		}
	}
}

// Prepare Page

function preparePage(obj,children) {
	var childrenType = children.type.toLowerCase();
	if(childrenType == "task-choice" | childrenType == "choicepage") {
		try {
			obj.type = "task-choice";
			obj.solved = false;
			obj.settings = new Object();
			obj.settings.numAttempts = children.taskSettings.numAttempts;

			obj.settings.shuffle = false;
			obj.settings.speaker = false;

			if(children.taskSettings.shuffle !== undefined) {
				obj.settings.shuffle = children.taskSettings.shuffle;
			}

			if(children.taskSettings.speaker !== undefined) {
				obj.settings.speaker =  children.taskSettings.speaker;
			}

			obj.content = new Object();
			obj.content.image = "";
			if(children.taskContent.image != undefined && children.taskContent.image != "") {
				obj.content.image = children.taskContent.image;
			}
			obj.content.question = children.taskContent.question;
			obj.content.feedbackWrong = children.taskContent.feedbackWrong;
			obj.content.feedbackWrongRepeat = obj.content.feedbackWrong;

			if(children.taskContent.feedbackWrongRepeat !== undefined) {
				obj.content.feedbackWrongRepeat = children.taskContent.feedbackWrongRepeat;
			}

			obj.content.feedbackCorrect = children.taskContent.feedbackCorrect;

			obj.content.answers = [];
			for(var i = 0; i<children.taskContent.answers.length; i++) {
				var _obj = new Object();
				_obj.text = children.taskContent.answers[i].text;
				_obj.correct = children.taskContent.answers[i].correct;
				obj.content.answers.push(_obj);
			}
		} catch(err) {
			console.log("An error encountered while preparing the "+children.type+" page... Check the data_"+language+".json for missing parameters");
		}
	} if(childrenType == "task-choice-custom") {
		try {
			obj.type = childrenType;
			obj.solved = false;
			obj.settings = new Object();
			//console.log(obj.id + ", " + obj.title);
			obj.settings.numAttempts = children.taskSettings.numAttempts;

			obj.settings.shuffle = false;
			obj.settings.speaker = false;

			if(children.taskSettings.shuffle !== undefined) {
				obj.settings.shuffle = children.taskSettings.shuffle;
			}

			if(children.taskSettings.speaker !== undefined) {
				obj.settings.speaker =  children.taskSettings.speaker;
			}

			obj.content = new Object();
			obj.content.image = "";
			if(children.taskContent.image != undefined && children.taskContent.image != "") {
				obj.content.image = children.taskContent.image;
			}
			obj.content.question = children.taskContent.question;
			obj.content.feedbackWrong = children.taskContent.feedbackWrong;
			obj.content.feedbackWrongRepeat = obj.content.feedbackWrong;

			if(children.taskContent.feedbackWrongRepeat !== undefined) {
				obj.content.feedbackWrongRepeat = children.taskContent.feedbackWrongRepeat;
			}

			obj.content.feedbackCorrect = children.taskContent.feedbackCorrect;

			obj.content.answers = [];
			for(var i = 0; i<children.taskContent.answers.length; i++) {
				var _obj = new Object();
				_obj.text = children.taskContent.answers[i].text;
				_obj.correct = children.taskContent.answers[i].correct;
				obj.content.answers.push(_obj);
			}
		} catch(err) {
			console.log("An error encountered while preparing the "+children.type+" page... Check the data_"+language+".json for missing parameters");
		}
	} else if(childrenType == "task-discussion" | childrenType == "diskussionpage") {
		try {
			obj.type = "task-discussion";
			obj.settings = new Object();

			obj.settings.shuffle = false;
			obj.settings.speaker = false;

			if(children.taskSettings.shuffle !== undefined) {
				obj.settings.shuffle = children.taskSettings.shuffle;
			}

			if(children.taskSettings.speaker !== undefined) {
				obj.settings.speaker =  children.taskSettings.speaker;
			}

			obj.content = new Object();
			obj.content.question = children.taskContent.question;

			obj.content.answers = [];
			for(var i = 0; i<children.taskContent.answers.length; i++) {
				var _obj = new Object();
				_obj.text = children.taskContent.answers[i].text;
				_obj.feedback = children.taskContent.answers[i].feedback;
				_obj.status = children.taskContent.answers[i].status;
				obj.content.answers.push(_obj);
			}
		} catch(err) {
			console.log("An error encountered while preparing the "+children.type+" page... Check the data_"+language+".json for missing parameters");
		}
	} else if(childrenType == "draganddrop-canvas" | childrenType == "dragndroppage") {
		try {
			obj.type = "draganddrop-canvas";
			obj.settings = new Object();
			obj.settings.numAttempts = children.taskSettings.numAttempts;

			obj.settings.speaker = false;

			if(children.taskSettings.speaker !== undefined) {
				obj.settings.speaker =  children.taskSettings.speaker;
			}

			obj.settings.showQuestion = true;

			if(children.taskSettings.showQuestion !== undefined) {
				obj.settings.showQuestion = children.taskSettings.showQuestion;
			}

			obj.settings.questionPosition = [630,20,330];
			obj.settings.buttonPosition = [16,16];


			if(children.taskSettings.buttonPosition !== undefined) {
				obj.settings.buttonPosition = children.taskSettings.buttonPosition;
			}

			if(children.taskSettings.questionPosition !== undefined) {
				obj.settings.questionPosition = children.taskSettings.questionPosition;
			}

			obj.content = new Object();
			obj.content.question = children.taskContent.question;
			obj.content.feedbackWrong = children.taskContent.feedbackWrong;
			obj.content.feedbackWrongRepeat = obj.content.feedbackWrong;

			if(children.taskContent.feedbackWrongRepeat !== undefined) {
				obj.content.feedbackWrongRepeat = children.taskContent.feedbackWrongRepeat;
			}
			obj.content.feedbackCorrect = children.taskContent.feedbackCorrect;

			obj.content.targets = [];
			obj.content.solutions = [];

			if(children.taskContent.targets !== undefined) {
				for(var i = 0; i<children.taskContent.targets.length; i++) {
					var _obj = new Object();
					_obj.id = children.taskContent.targets[i].id;
					_obj.solutions = children.taskContent.targets[i].solution.split(",");
					obj.content.targets.push(_obj);
				}
			} else {
				console.log("Targets are undefined...");
				var _tempTargets = [ { id: "t1", solution: "b1" }, { id: "t2", solution: "b2" }, { id: "t3", solution: "b3" } ];

				for(var i = 0; i<_tempTargets.length; i++) {
					var _obj = new Object();
					_obj.id = _tempTargets[i].id;
					_obj.solutions = _tempTargets[i].solution.split(",");
					obj.content.targets.push(_obj);
				}
			}

			if(children.taskContent.solutions !== undefined) {
				for(var i = 0; i<children.taskContent.solutions.length; i++) {
					var _obj = new Object();
					_obj.id = children.taskContent.solutions[i].id;
					obj.content.solutions.push(_obj);
				}
			} else {
				console.log("Solutions are undefined...");
				var _tempSolutions = [ { id: "b1" }, { id: "b2" }, { id: "b3" } ];

				for(var i = 0; i<_tempSolutions.length; i++) {
					var _obj = new Object();
					_obj.id = _tempSolutions[i].id;
					obj.content.solutions.push(_obj);
				}
			}


		} catch(err) {
			console.log("An error encountered while preparing the "+children.type+" page... Check the data_"+language+".json for missing parameters");
		}

	} else if(childrenType == "hotspot") {
		try {
			obj.type = childrenType;
			obj.mentor = new Object();
			obj.mentor.big = children.taskMentor.mentorBig;
			obj.mentor.question = children.taskMentor.mentorQuestion;
			obj.mentor.instructions = children.taskMentor.mentorInstructions;
			obj.mentor.default = children.taskMentor.mentorDefault;
			obj.mentor.final = children.taskMentor.mentorFinal;

			obj.hotspots = [];

			for(var i = 0; i<children.taskHotspots.length; i++) {
				var _obj = new Object();
				_obj.text = children.taskHotspots[i].text;
				_obj.score = [];
				var _scoreArr = children.taskHotspots[i].score.split(",");
				for(var j = 0; j<_scoreArr.length; j++) {
					_obj.score[j] = Number(_scoreArr[j]);
				}
				_obj.feedbackTitleCorrect = children.taskHotspots[i].feedbackTitleCorrect;
				_obj.feedbackTitleWrong = children.taskHotspots[i].feedbackTitleWrong;
				_obj.correctAnswer = children.taskHotspots[i].correctAnswer;
				_obj.position = [children.taskHotspots[i].position[0],children.taskHotspots[i].position[1]];
				_obj.feedbackCheckmark = children.taskHotspots[i].feedbackCheckmark;
				_obj.feedbackCross = children.taskHotspots[i].feedbackCross;

				obj.hotspots.push(_obj);
			}

		} catch(err) {
			console.log("An error encountered while preparing the "+children.type+" page... Check the data_"+language+".json for missing parameters");
			//console.log(err);
		}
	} else if(childrenType == "hotspot-invisible") {
		try {
			obj.type = childrenType;
			obj.mentor = new Object();
			obj.mentor.big = children.taskMentor.mentorBig;
			obj.mentor.small = children.taskMentor.mentorSmall;
			obj.feedbackCorrect = children.taskFeedback.feedbackCorrect;
			obj.feedbackPending = children.taskFeedback.feedbackPending;
			obj.hotspots = [];

			for(var i = 0; i<children.taskHotspots.length; i++) {
				var _obj = new Object();
				_obj.text = children.taskHotspots[i].text;
				_obj.size = [children.taskHotspots[i].size[0],children.taskHotspots[i].size[1]];
				_obj.position = [children.taskHotspots[i].position[0],children.taskHotspots[i].position[1]];
				obj.hotspots.push(_obj);
			}

		} catch(err) {
			console.log("An error encountered while preparing the "+children.type+" page... Check the data_"+language+".json for missing parameters");
			//console.log(err);
		}
	} else if(childrenType == "draganddrop-onetarget") {
		try {
			obj.type = childrenType;
			obj.mentor = new Object();
			obj.mentor.big = children.taskMentor.mentorBig;
			obj.mentor.small = children.taskMentor.mentorSmall;
			obj.settings = new Object();
			obj.settings.numAttempts = children.taskSettings.numAttempts;
			obj.settings.shuffle = children.taskSettings.shuffle;

			obj.settings.solutionStartX = children.taskSettings.solutionBox.startX;
			obj.settings.solutionStartY = children.taskSettings.solutionBox.startY;

			obj.settings.targetStartX = children.taskSettings.targetBox.startX;
			obj.settings.targetStartY = children.taskSettings.targetBox.startY;

			obj.content = new Object();
			obj.content.feedbackWrong = children.taskFeedback.feedbackWrong;
			obj.content.feedbackWrongRepeat = obj.content.feedbackWrong;

			if(children.taskContent.feedbackWrongRepeat !== undefined) {
				obj.content.feedbackWrongRepeat = children.taskContent.feedbackWrongRepeat;
			}
			obj.content.feedbackCorrect = children.taskFeedback.feedbackCorrect;

			obj.content.solutions = [];

			for(var i = 0; i<children.taskAnswers.length; i++) {
				var _obj = new Object();
				_obj.id = "b"+i;
				_obj.text = children.taskAnswers[i].text;
				_obj.correct = children.taskAnswers[i].correct;
				obj.content.solutions.push(_obj);
			}
		} catch(err) {
			console.log("An error encountered while preparing the "+children.type+" page... Check the data_"+language+".json for missing parameters");
			//console.log(err);
		}

	} else if(childrenType == "draganddrop-logicalorder") {
		try {
			obj.type = childrenType;
			obj.mentor = new Object();
			obj.mentor.big = children.taskMentor.mentorBig;
			obj.mentor.small = children.taskMentor.mentorSmall;

			obj.settings = new Object();
			obj.settings.shuffle = children.taskSettings.shuffle;

			obj.content = new Object();
			obj.content.feedbackWrong = children.taskFeedback.feedbackWrong;
			obj.content.feedbackWrongRepeat = obj.content.feedbackWrong;

			if(children.taskContent.feedbackWrongRepeat !== undefined) {
				obj.content.feedbackWrongRepeat = children.taskContent.feedbackWrongRepeat;
			}
			obj.content.feedbackCorrect = children.taskFeedback.feedbackCorrect;

			obj.content.elements = [];

			for(var i = 0; i<children.taskContent.elements.length; i++) {
				var _obj = new Object();
				_obj.order = children.taskContent.elements[i].order;
				_obj.question = children.taskContent.elements[i].question;
				_obj.answer = children.taskContent.elements[i].answer;
				obj.content.elements.push(_obj);
			}

		} catch(err) {
			console.log("An error encountered while preparing the "+children.type+" page... Check the data_"+language+".json for missing parameters");
			//console.log(err);
		}
	} else {
		// Do nothing
	}
}

// Fetch language string

function lang(obj) {
	if(obj != undefined) {
		if(language == "en") {
			try {
				return obj.en;
			} catch(err) {
				return lang(jsonLanguage.missingString);
			}

		} else if(language == "de") {
			try {
				return obj.de;
			} catch(err) {
				return lang(jsonLanguage.missingString);
			}
		} else if(language == "es") {
			try {
				return obj.es;
			} catch(err) {
				return lang(jsonLanguage.missingString);
			}
		} else {
			try {
				return obj.en;
			} catch(err) {
				return lang(jsonLanguage.missingString);
			}
		}
	} else {
		console.log("String is missing!");
		return lang(jsonLanguage.missingString);
	}
}


// Option checker

function isOption(str,option) {
	if(typeof(str) == "string") {
		var _str = str.toLowerCase();
		var _option = option.toLowerCase();
		if(_str.indexOf(_option) == -1) {
			return false;
		} else {
			return true;
		}
	} else {
		return false;
	}
}

function getOptionArray(str) {
	var _arr = [];

	_arr = str.split(",");

	return _arr
}

// Console Logs
function log(str) {
	if(consoleLogs) console.log(str);

	// For debugging on ipad
	if(jsPanelLogs) {
		if(logpanel == null) {
			logpanel = $.jsPanel({
				id: "jspanelLog",
			    container:   "body",
				contentOverflow: 'scroll',
			    position:    {
			        my: "center-top",
			        at: "center-top",
			        offsetY: 80
			    },
			    headerTitle: "Console Log",
			    theme:       "teal",
			    content:     str,
			    callback:    function () {
			        this.content.css("padding", "10px")
			    }
			});
		} else {
			logpanel.content.append("<br>"+str);
		}
	}
}

function countExcursionPages() {
	var numExcursionPages = 0;
	for(var i = 0; i<pages.length; i++) {
		if(isOption(pages[i].options,"excursion")) {
			numExcursionPages++;
		}
	}
	return numExcursionPages;
}

function openExcursion(id) {
	console.log("openExcursion: " + id);
	initPage(getFirstPageInChapter(id));
}


// #####################
// Player specific functions
// #####################

function updateProgressbar() {

	var _done = 0;

	for(var i = 0; i<pagesDone.length; i++) {
		_done++;
	}

	var recalcPages = [];
	for(var i = 0; i<pages.length; i++) {

		if(!isOption(pages[i].options,"ignoreInScore")) {
			recalcPages.push(pages[i]);
		}
	}

	percentageDone = Math.floor((_done/recalcPages.length)*100);

	$('#navbar-progress').attr('aria-valuenow',percentageDone);
	$('#navbar-progress').attr('style','min-width:2.4em; width: ' + percentageDone + '%;');
	$('#navbar-progress').html(percentageDone + '%');

	$('.progress-bar').css('background-color',currentDesign.completionBar.topColor);

}

function getCompletionPercentage() {
	var _done = 0;
	var _arr = [];

	for(var i = 0; i<pagesDone.length; i++) {
		_done++;
	}

	for(var i = 0; i<pages.length; i++) {
		if(!isOption(pages[i].options,"ignoreInScore")) {
			_arr.push(pages[i]);
		}
	}

	return Math.floor((_done/_arr.length)*100);


}

function getPagesDone() {
	var _done = 0;
	for(var i = 0; i<pages.length; i++) {
		if(pages[i].done && !isOption(pages[i].options,"ignoreInScore")) {
			_done++;
		}
	}
	return _done;
}

function isPageDone(_id) {

	var id = "";

	if(_id.indexOf("-") == -1) {
		for(var i = 0; i<pages.length; i++) {
			if(pages[i].path.indexOf(_id) != -1) {
				id = pages[i].id;
			}
		}
	} else {
		id = _id;
	}

	console.log("Checking if page " + id + " is completed...");

	for(var i = 0; i<pages.length; i++) {
		if(pages[i].id == id) {
			if(pages[i].done) {
				return true;
			} else {
				return false;
			}
		}
	}
	return false;
}

function getCurrentPage() {
	if(comingFromIntro) {
		return introPage;
	} else {
		return pages[currentPage];
	}
}

function updateStatus() {

	if(isOption(getCurrentPage().options,"excursion")) {
		// if excursion
		if($('#exit-excursion').css('visibility') == 'hidden') {
			$('#exit-excursion').css('visibility','visible');
		}

		if($('#navbar').css('visibility') == 'visible') {
			$('#navbar').css('visibility','hidden');
		}

	} else {
		// If no excursion

		if($('#exit-excursion').css('visibility') == 'visible') {
			$('#exit-excursion').css('visibility','hidden');
		}

		if($('#navbar').css('visibility') == 'hidden') {
			$('#navbar').css('visibility','visible');
		}

		updateProgressbar();
	}

	$('#page-nr').html(getCurrentPage().nr);

	updateBreadcrumb();
	updateNavigation();
	updateSpeakertext();
}

function countLengthOfStrings(arr) {
	var _count = 0;
	for(var i = 0; i<arr.length; i++) {
		_count+=arr[i].length;
	}

	return _count;

}

function shortenBreadcrumbTitles(arr) {
	return arr;
}

function shorten(str, n, useWordBoundary ){
    if (str.length <= n) { return str; }
    var subString = str.substr(0, n-1);
    return (useWordBoundary
       ? subString.substr(0, subString.lastIndexOf(' '))
       : subString) + "&hellip;";
};


function updateBreadcrumb() {

	$('#breadcrumb').html('');

	if(showWBTtitleInBreadcrumb) {
		var breadStr = '<li><a href="#" onclick="initPage(0)">'+wbttitle+'</a></li>';

	} else {
		var breadStr = '<li><a href="#" onclick="initPage(0)">'+alternativeWBTtitleInBreadcrumb+'</a></li>';
	}

	var chapList = [];


	for(var i = 0; i < chapters.length; i++) {

		if(chapters[i].children != undefined) {
			for(var j = 0; j < chapters[i].children.length; j++) {
				if(chapters[i].children[j].type.toLowerCase() != "chapter" && chapters[i].children[j].type.toLowerCase() != "subchapter") {
					if(chapters[i].children[j].id == getCurrentPage().id) {

						var breadcrumbArray = shortenBreadcrumbTitles([chapters[i].title,chapters[i].children[j].title]);

						if(showPageNrInBreadcrumb) {
							chapList[0] = '<li><a data-toggle="tooltip" data-placement="bottom" title="<p>'+chapters[i].nr + ' &middot; ' + chapters[i].title+'" href="#" onclick="initPage(\''+getFirstPageInChapter(chapters[i])+'\')">'+chapters[i].nr + " " + breadcrumbArray[0] + "</a></li>";
							chapList[1] = '<li><a data-toggle="tooltip" data-placement="bottom" title="<p>'+chapters[i].children[j].nr + ' &middot; ' + chapters[i].children[j].title+'" href="#" onclick="initPage(\''+chapters[i].children[j].id+'\')">'+chapters[i].children[j].nr + " " + breadcrumbArray[1] + "</a></li>";
						} else {
							chapList[0] = '<li><a data-toggle="tooltip" data-placement="bottom" title="<p>'+chapters[i].nr + ' &middot; ' + chapters[i].title+'" href="#" onclick="initPage(\''+getFirstPageInChapter(chapters[i])+'\')">'+ breadcrumbArray[0] + "</a></li>";
							chapList[1] = '<li><a data-toggle="tooltip" data-placement="bottom" title="<p>'+chapters[i].children[j].nr + ' &middot; ' + chapters[i].children[j].title+'" href="#" onclick="initPage(\''+chapters[i].children[j].id+'\')">'+ breadcrumbArray[1] + "</a></li>";
						}
					}
				}
				if(chapters[i].children[j].children != undefined) {
					for(var k = 0; k < chapters[i].children[j].children.length; k++) {
						if(chapters[i].children[j].children[k].type.toLowerCase() != "chapter" && chapters[i].children[j].children[k].type.toLowerCase() != "subchapter") {
							if(chapters[i].children[j].children[k].id == getCurrentPage().id) {

								var breadcrumbArray = shortenBreadcrumbTitles([chapters[i].title,chapters[i].children[j].title,chapters[i].children[j].children[k].title]);

								if(showPageNrInBreadcrumb) {
									chapList[0] = '<li><a data-toggle="tooltip" data-placement="bottom" title="<p>'+chapters[i].nr + ' &middot; ' + chapters[i].title+'" href="#" onclick="initPage(\''+getFirstPageInChapter(chapters[i])+'\')">'+chapters[i].nr + " " + breadcrumbArray[0] + "</a></li>";
									chapList[1] = '<li><a data-toggle="tooltip" data-placement="bottom" title="<p>'+chapters[i].children[j].nr + ' &middot; ' + chapters[i].children[j].title+'" href="#" onclick="initPage(\''+getFirstPageInChapter(chapters[i].children[j])+'\')">'+chapters[i].children[j].nr + " " + breadcrumbArray[1] + "</a></li>";
									chapList[2] = '<li><a data-toggle="tooltip" data-placement="bottom" title="<p>'+chapters[i].children[j].children[k].nr + ' &middot; ' + chapters[i].children[j].children[k].title+'" href="#" onclick="initPage(\''+chapters[i].children[j].children[k].id+'\')">'+chapters[i].children[j].children[k].nr + " " + breadcrumbArray[2] + "</a></li>";
								} else {
									chapList[0] = '<li><a data-toggle="tooltip" data-placement="bottom" title="<p>'+chapters[i].nr + ' &middot; ' + chapters[i].title+'" href="#" onclick="initPage(\''+getFirstPageInChapter(chapters[i])+'\')">'+ breadcrumbArray[0] + "</a></li>";
									chapList[1] = '<li><a data-toggle="tooltip" data-placement="bottom" title="<p>'+chapters[i].children[j].nr + ' &middot; ' + chapters[i].children[j].title+'" href="#" onclick="initPage(\''+getFirstPageInChapter(chapters[i].children[j])+'\')">'+ breadcrumbArray[1] + "</a></li>";
									chapList[2] = '<li><a data-toggle="tooltip" data-placement="bottom" title="<p>'+chapters[i].children[j].children[k].nr + ' &middot; ' + chapters[i].children[j].children[k].title+'" href="#" onclick="initPage(\''+chapters[i].children[j].children[k].id+'\')">'+breadcrumbArray[2] + "</a></li>";
								}
							}
						}
						if(chapters[i].children[j].children[k].children != undefined) {
							for(var l = 0; l < chapters[i].children[j].children[k].children.length; l++) {
								if(chapters[i].children[j].children[k].children[l].id == getCurrentPage().id) {

									var breadcrumbArray = shortenBreadcrumbTitles([chapters[i].title,chapters[i].children[j].title,chapters[i].children[j].children[k].title,chapters[i].children[j].children[k].children[l].title]);

									if(showPageNrInBreadcrumb) {
										chapList[0] = '<li><a data-toggle="tooltip" data-placement="bottom" title="<p>'+chapters[i].nr + ' &middot; ' + chapters[i].title+'" href="#" onclick="initPage(\''+getFirstPageInChapter(chapters[i])+'\')">'+chapters[i].nr + " " + breadcrumbArray[0] + "</a></li>";
										chapList[1] = '<li><a data-toggle="tooltip" data-placement="bottom" title="<p>'+chapters[i].children[j].nr + ' &middot; ' + chapters[i].children[j].title+'" href="#" onclick="initPage(\''+getFirstPageInChapter(chapters[i].children[j])+'\')">'+chapters[i].children[j].nr + " " + breadcrumbArray[1] + "</a></li>";
										chapList[2] = '<li><a data-toggle="tooltip" data-placement="bottom" title="<p>'+chapters[i].children[j].children[k].nr + ' &middot; ' + chapters[i].children[j].children[k].title+'" href="#" onclick="initPage(\''+getFirstPageInChapter(chapters[i].children[j].children[k])+'\')">'+chapters[i].children[j].children[k].nr + " " + breadcrumbArray[2] + "</a></li>";
										chapList[3] = '<li><a data-toggle="tooltip" data-placement="bottom" title="<p>'+chapters[i].children[j].children[k].children[l].nr + ' &middot; ' + chapters[i].children[j].children[k].children[l].title+'" href="#" onclick="initPage(\''+chapters[i].children[j].children[k].children[l].id+'\')">'+chapters[i].children[j].children[k].children[l].nr + " " + breadcrumbArray[3] + "</a></li>";
									} else {
										chapList[0] = '<li><a data-toggle="tooltip" data-placement="bottom" title="<p>'+chapters[i].nr + ' &middot; ' + chapters[i].title+'</p>" href="#" onclick="initPage(\''+getFirstPageInChapter(chapters[i])+'\')">'+ breadcrumbArray[0] + "</a></li>";
										chapList[1] = '<li><a data-toggle="tooltip" data-placement="bottom" title="<p>'+chapters[i].children[j].nr + ' &middot; ' + chapters[i].children[j].title+'</p>" href="#" onclick="initPage(\''+getFirstPageInChapter(chapters[i].children[j])+'\')">'+breadcrumbArray[1] + "</a></li>";
										chapList[2] = '<li><a data-toggle="tooltip" data-placement="bottom" title="<p>'+chapters[i].children[j].children[k].nr + ' &middot; ' + chapters[i].children[j].children[k].title+'</p>" href="#" onclick="initPage(\''+getFirstPageInChapter(chapters[i].children[j].children[k])+'\')">'+breadcrumbArray[2] + "</a></li>";
										chapList[3] = '<li><a data-toggle="tooltip" data-placement="bottom" title="<p>'+chapters[i].children[j].children[k].children[l].nr + ' &middot; ' + chapters[i].children[j].children[k].children[l].title+'</p>" href="#" onclick="initPage(\''+chapters[i].children[j].children[k].children[l].id+'\')">' + breadcrumbArray[3] + "</a></li>";
									}
								}
							}
						}
					}
				}
			}
		}
	}

	$('#breadcrumb').html(breadStr);

	for(var i = 0; i<chapList.length; i++) {
		$('#breadcrumb').append(chapList[i]);
	}
	$('#breadcrumb').css('visibility','hidden');

	if(shortenBreadcrumb) {
		shortenBreadcrumbText();
	}

	if(showBreadcrumbTooltips) {
		$('#breadcrumb [data-toggle="tooltip"]').tooltip({
			html:true
		});
	}

	$('#breadcrumb').css('visibility','visible');

}

function shortenBreadcrumbText() {
	var breadcrumbLimit = 600;
	var arrowWidth = 20;
	var totalBreadcrumbWidth = 0;

	$('#breadcrumb li a').each(function() {
		//console.log($(this).width());
		totalBreadcrumbWidth+= $(this).width() + arrowWidth;
	});

	//console.log("Breadcrumb Size: " + totalBreadcrumbWidth + " / " + breadcrumbLimit);

	if(totalBreadcrumbWidth > breadcrumbLimit) {
		$('#breadcrumb li a').each(function() {
			if($(this).html().length >= 40) {
				$(this).html(shorten($(this).html(),32,false));
			}
		});
	}

	// Search #2
	totalBreadcrumbWidth = 0;
	$('#breadcrumb li a').each(function() {
		totalBreadcrumbWidth+= $(this).width() + arrowWidth;
	});
	if(totalBreadcrumbWidth > breadcrumbLimit) {
		$('#breadcrumb li a').each(function() {
			if($(this).html().length >= 36) {
				$(this).html(shorten($(this).html(),32,false));
			};
		});
	};
	//console.log("Breadcrumb Size: " + totalBreadcrumbWidth + " / " + breadcrumbLimit);

	// Search #3
	totalBreadcrumbWidth = 0;
	$('#breadcrumb li a').each(function() {
		totalBreadcrumbWidth+= $(this).width() + arrowWidth;
	});
	if(totalBreadcrumbWidth > breadcrumbLimit) {
		$('#breadcrumb li a').each(function() {
			if($(this).html().length >= 33) {
				$(this).html(shorten($(this).html(),28,false));
			};
		});
	};
	//console.log("Breadcrumb Size: " + totalBreadcrumbWidth + " / " + breadcrumbLimit);

	// Search #4
	totalBreadcrumbWidth = 0;
	$('#breadcrumb li a').each(function() {
		totalBreadcrumbWidth+= $(this).width() + arrowWidth;
	});
	if(totalBreadcrumbWidth > breadcrumbLimit) {
		$('#breadcrumb li a').each(function() {
			if($(this).html().length >= 29) {
				$(this).html(shorten($(this).html(),25,false));
			};
		});
	};
	//console.log("Breadcrumb Size: " + totalBreadcrumbWidth + " / " + breadcrumbLimit);


	// Search #5
	totalBreadcrumbWidth = 0;
	$('#breadcrumb li a').each(function() {
		totalBreadcrumbWidth+= $(this).width() + arrowWidth;
	});
	if(totalBreadcrumbWidth > breadcrumbLimit) {
		$('#breadcrumb li a').each(function() {
			if($(this).html().length >= 26) {
				$(this).html(shorten($(this).html(),22,false));
			};
		});
	};
	//console.log("Breadcrumb Size: " + totalBreadcrumbWidth + " / " + breadcrumbLimit);

	// Search #6
	totalBreadcrumbWidth = 0;
	$('#breadcrumb li a').each(function() {
		totalBreadcrumbWidth+= $(this).width() + arrowWidth;
	});
	if(totalBreadcrumbWidth > breadcrumbLimit) {
		$('#breadcrumb li a').each(function() {
			if($(this).html().length >= 23) {
				$(this).html(shorten($(this).html(),16,false));
			};
		});
	};
	//console.log("Breadcrumb Size: " + totalBreadcrumbWidth + " / " + breadcrumbLimit);


}


function initSearch() {
	if(showSearchField) {
		$('.search-field .form-control').attr('placeholder',lang(jsonLanguage.searchPlaceholder));
		$('.search-field').fadeIn(600);

		$('.search-field').keypress(function(event){
		  if(event.keyCode == 13){
		    $('#search_btn').click();
		  }
		});

		$('#search_btn').on('click',function() {
			console.log("Initializing Search: " + searchOpen + ", " + $('#search_input').val().length);

			if(!searchOpen) {

				if($('#search_input').val().length > 2) {
					$('#search_input').removeClass('search-error');
					searchOpen = true;
					searchFor($('#search_input').val());
				} else {
					$('#search_input').addClass('search-error');
				}
			}
		});
	}
}

function searchFor(str) {

	var _results = '';
	var _str = str.toLowerCase();

	// Page Search
	var _pageStart = '<ul>';
	var _pageContent = '';
	var _pageEnd = '</ul>';
	var _pageStr = '';

	for(var i = 0; i<pages.length; i++) {

		if(pages[i].title.toLowerCase().indexOf(_str) !== -1 | pages[i].originalText.toLowerCase().indexOf(_str) !== -1 | pages[i].nr.indexOf(_str) !== -1) {
			if(pages[i].options.indexOf("excursion") != -1) {
				_pageContent+='<li><a onclick="hideAllModals();closeSearch();initPageFromMenu('+pages[i].i+')" href="#">[Excursion] ' +pages[i].title+'</a></li>';
			} else {
				_pageContent+='<li><a onclick="hideAllModals();closeSearch();initPageFromMenu('+pages[i].i+')" href="#">['+pages[i].nr + '] ' +pages[i].title+'</a></li>';
			}

		}
	}

	_pageStr = _pageStart + _pageContent + _pageEnd;

	if(_pageContent.length > 1) {
		_results+='<div class="panel panel-default"><div class="panel-heading"><h4 style="padding:0;margin:0;font-size:16px">'+lang(jsonLanguage.searchResultsPageTitle)+'</h4></div><div class="panel-body">'+_pageStr+'</div></div>';
	}

	// Glossary Search
	var _pageStart = '<ul>';
	var _pageContent = '';
	var _pageEnd = '</ul>';
	var _pageStr = '';

	if(jsonGlossary.length > 1) {
		for(var i = 0; i<jsonGlossary.length; i++) {
			console.log(jsonGlossary[i]);
			if(jsonGlossary[i].title.toLowerCase().indexOf(_str) !== -1 | jsonGlossary[i].content.toLowerCase().indexOf(_str) !== -1) {
				var _substr = shorten(jsonGlossary[i].content,200,true);

				_pageContent+='<li><a data-toggle="tooltip" data-placement="right" title="<p class=\'glossary-text\'>'+_substr+'</p>" onclick="hideAllModals();closeSearch();showGlossaryItem(\''+jsonGlossary[i].title+'\')" href="#">'+jsonGlossary[i].title+'</a></li>';
			}
		}

		_pageStr = _pageStart + _pageContent + _pageEnd;

		if(_pageContent.length > 1) {
			_results+='<div class="panel panel-default"><div class="panel-heading"><h4 style="padding:0;margin:0;font-size:16px">'+lang(jsonLanguage.searchResultsGlossaryTitle)+'</h4></div><div class="panel-body">'+_pageStr+'</div></div>';
		}
	}

	if(_results.length < 10) {
		bootbox.dialog({
			message: lang(jsonLanguage.searchNoResults),
			closeButton: true,
			size:"small",
			backdrop: true,
			onEscape: function() {
				closeSearch();
			}
		}).find('.modal-content').css({
			'margin-top': 180 + "px",
			'max-height': 100 + "px"
		});


	} else {
		var searchdialog = bootbox.dialog({
			title: lang(jsonLanguage.searchResultsTitle) + " '" + str + "'.",
			message: _results,
			closeButton: true,
			size:"large",
			backdrop: true,
			onEscape: function() {
				closeSearch();
			}
		}).find('.modal-content').css({
			'margin-top': 68 + "px"
		});

		searchdialog.init(function() {
			console.log("Init Search Dialogue");
			$(this).find('[data-toggle="tooltip"]').tooltip({
				html:true
			});
		});
	}
}

function hideAllModals() {
	bootbox.hideAll();
}

function closeSearch() {
	$('#search_input').val("");
	searchOpen = false;
}

function showGlossaryItem(title) {
	// title is title or ID, deprecated...

	var str = "";
	// Title String
	for(var i = 0; i<jsonGlossary.length; i++) {
		if(title.toLowerCase() === jsonGlossary[i].title.toLowerCase()) {
			str = jsonGlossary[i].content;
		}
	}
	// ID
	if(str.length <= 1) {
		for(var i = 0; i<jsonGlossary.length; i++) {
			if(jsonGlossary[i].id !== undefined) {
				if(title.toLowerCase() === jsonGlossary[i].id.toLowerCase()) {
					str = jsonGlossary[i].content;
				}
			}
		}
	}
	bootbox.dialog({
		title: title,
		message: str,
		closeButton: true,
		backdrop: true,
		onEscape: true
	}).find('.modal-content').css({
		'margin-top': 150 + "px"
	});
}


function updateSpeakertext() {
	if(speakertextIsOpen) {
		jsPanel.activePanels.getPanel("speaker-panel").close();
		openSpeakertext();
	}
}

function toggleNavigation(str,enable) {
	if(str == "previous" | str == "prev" | str == "back") {
		if(enable) {
			$('#btn-prev').prop('disabled', false);
		} else {
			$('#btn-prev').prop('disabled', true);
		}
	} else if(str == "next" | str == "forward") {
		if(enable) {
			$('#btn-next').prop('disabled', false);
		} else {
			$('#btn-next').prop('disabled', true);
		}
	}
}

function toggleButton(str,enable) {
	if(enable) {
		$(str).prop('disabled',false)
	} else {
		$(str).prop('disabled',true)
	}
}

function togglePlayPause(enable) {
	if(enable) {
		$('#btn-play').prop('disabled', false);
	} else {
		$('#btn-play').prop('disabled', true);
	}
}

function togglePageNavigation(boo) {
	if(boo) {
		togglePlayPause(true);
		toggleButton('#btn-repeat',true);
		toggleButton('#btn-mute',true);
	} else {
		togglePlayPause(false);
		toggleButton('#btn-repeat',false);
		toggleButton('#btn-mute',false);
	}
}

function updateNavigation() {

	// If Prev Button is disabled
	if($('#btn-prev').prop('disabled')) {
		if(currentPage > 0) {
			toggleNavigation("prev",true);
		}
	} else {
		if(currentPage == 0) {
			toggleNavigation("prev",false);
		}
	}

	// If Next Button is disabled
	if($('#btn-next').prop('disabled')) {

		if(isOption(pages[currentPage].options,"excursion")) {
			toggleNavigation("next",true);
		} else {
			if(currentPage < (pages.length-(countExcursionPages()+1))) {
				toggleNavigation("next",true);
			}
		}

	} else {
		if(isOption(pages[currentPage].options,"excursion")) {
			// Do nothing
		} else {
			if(currentPage == (pages.length-(countExcursionPages()+1))) {
				toggleNavigation("next",false);
			}
		}

	}

	// Options

	if(isOption(pages[currentPage].options,"disablePrevious")) {

		if(!cheatmode) {
			toggleNavigation("prev",false);
		} else {
			toggleNavigation("prev",true);
		}
	}

	if(isOption(pages[currentPage].options,"disableNext")) {
		if(!cheatmode) {
			toggleNavigation("next",false);
		} else {
			toggleNavigation("next",true);
		}

	}

	if(!getCurrentPage().done | !getCurrentPage().completed) {
		if(!cheatmode) {
			// Define more formats
			if(isTask(getCurrentPage().type)) {

				if(!forceTaskSequencing) {
					$('#btn-next').prop("disabled", true);
				}
			} else {
				if(!isOption(pages[currentPage].options,"excursion")) {
					if(!forceSequencing) {
						$('#btn-next').prop("disabled", true);
					}
				}

			}
		}
	}
}

function isTask(str) {

	if(str == "task-discussion" | str == "diskussionpage") return true;
	if(str == "task-choice" | str == "choicepage") return true;
	if(str == "task-choice-custom") return true;
	if(str == "draganddrop-canvas" | str == "dragndroppage") return true;
	if(str == "hotspot") return true;
	if(str == "hotspot-invisible") return true;
	if(str == "draganddrop-onetarget") return true;
	if(str == "draganddrop-logicalorder") return true;

	return false;
}


function initHTML(src) {
	cpvar = [];
	if(arguments[1] !== undefined) {
		cpvar.push(arguments[1]);
	}
	if(src.indexOf("intro") == -1) {
		switch(getCurrentPage().type.toLowerCase()) {
		case 'video':
			$('#playerFrame').attr('src','content/templates/video-poster.html');
			break;
		case 'poster':
		case 'posterpage':
			$('#playerFrame').attr('src','content/templates/video-poster.html');
			break;
		case 'standard':
		case 'objectpage':
		case 'standardpage':
			$('#playerFrame').attr('src','content/templates/video-standard.html');
			break;
		case 'task-choice':
		case 'choicepage':
			resetFrameSize();
			$('#playerFrame').attr('src','content/templates/choice-html5.html');
			hideLoadingAnimation();
			break;
		case 'task-choice-custom':
			resetFrameSize();
			$('#playerFrame').attr('src',contentPath+src);
			hideLoadingAnimation();
			break;
		case 'task-discussion':
		case 'diskussionpage':
			resetFrameSize();
			$('#playerFrame').attr('src','content/templates/discussion-html5.html');
			hideLoadingAnimation();
			break;
		case 'draganddrop-canvas':
		case 'dragndroppage':
			resetFrameSize();
			if(src.indexOf("html") < 0) {
				console.log("Drag & Drop path has wrong format. Adding /canvas.html to path...");
				src = src+"/canvas.html";
			}
			$('#playerFrame').attr('src',contentPath+src);
			hideLoadingAnimation();
			break;
		default:
			resetFrameSize(contentWidthWide);
			$('#playerFrame').attr('src',contentPath+src);
			break;
		}
	} else {
		$('#playerFrame').attr('src',contentPath+src);
	}


	$('#playerFrame').css('display','block');

}

function clearSCORM() {
	if(scormVersion === '1.2') {
		setSCORM("cmi.suspend_data", "");
		setSCORM("cmi.core.lesson_location", "");
	} else if(scormVersion === '2004') {
		setSCORM("cmi.suspend_data", "");
		setSCORM("cmi.location", "");
	} else {
		setSCORM("cmi.suspend_data", "");
		setSCORM("cmi.core.lesson_location", "");
	}

	console.log("SCORM variables cleared...");
}

function initPlayer() {

	$('#player-footer-buttons').fadeIn(1000);

	$('#btn-debug').on("click",function() {
		//clearSCORM();
	});

	// Get Language Strings
	$('#wbt-title').hide();
	$('#wbt-title h3').html(headerWbttitle);

	var titleHeight = $('#wbt-title').height();
	var titleWidth = $('#wbt-title').width();

	if(titleHeight <= 25) {
		// One line

		if(titleWidth > 390) {
			$('#wbt-title h3').css('font-size','16px');
			$('#wbt-title').css('top','30px');
		} else {
			$('#wbt-title').css('top','28px');
		}

	} else {
		// Multiple lines

		if(titleWidth > 390) {
			$('#wbt-title h3').css('font-size','16px');
			$('#wbt-title h3').css('line-height','22px');
			$('#wbt-title').css('top','17px');
		} else {
			$('#wbt-title h3').css('font-size','16px');
			$('#wbt-title h3').css('line-height','22px');
			$('#wbt-title').css('top','17px');
		}
	}


	$('#wbt-title').fadeIn(1000);
	$('#span-copyright').hide();

	var dt = designTemplate.toLowerCase();
	copyrightMessage = jsonMetadata.copyright;
	if(copyrightMessage.length < 2) {
		copyrightMessage = '<span style="color:red">COPYRIGHT MESSAGE MISSING</span>';
	}

	$('#span-copyright').html(copyrightMessage);

	$('#span-copyright').fadeIn(1000);
	$('#span-loading').html(lang(jsonLanguage.loading));
	$('#navbar p').html(lang(jsonLanguage.progress));
	$('.wbt-menu span').html(lang(jsonLanguage.menu));
	$('#span-previous').html(lang(jsonLanguage.buttons.btnPreviousLabel));
	$('#span-next').html(lang(jsonLanguage.buttons.btnNextLabel));
	$('#exit-excursion button').html(lang(jsonLanguage.buttons.btnLeaveExcursion));

	if(version < 11 && version != false) {
		$('#legacy-browser').fadeIn(1000);
		console.log("Old browser detected!");
	}
	// Redesign

	redesignPlayer();

	// Button Tooltips

	if($("#btn-mute").length) $("#btn-mute").attr("title",lang(jsonLanguage.buttonTooltips.btnSound));
	if($("#btn-speakertext").length) $("#btn-speakertext").attr("title",lang(jsonLanguage.buttonTooltips.btnSpeaker));
	if($("#btn-print").length) $("#btn-print").attr("title",lang(jsonLanguage.buttonTooltips.btnPrint));
	if($("#btn-glossary").length) $("#btn-glossary").attr("title",lang(jsonLanguage.buttonTooltips.btnGlossary));
	if($("#btn-info").length) $("#btn-info").attr("title",lang(jsonLanguage.buttonTooltips.btnImprint));
	if($("#btn-help").length) $("#btn-help").attr("title",lang(jsonLanguage.buttonTooltips.btnHelp));

	if(showScore) {
		initScoreCounter();
	}

	// Visibility

	$('#playerFrame').css('display','none');

	if(showIntro) {
		initIntro();
	} else {
		initWithoutIntro();
	}

}


function initWithoutIntro() {
	if(scormEnabled) {
		loadScormStatus();
	} else {
		initPage(0);
	}
}

function initIntro() {
	$('#page-nr').html(lang(jsonLanguage.intro));

	$('#navbar-progress').attr('aria-valuenow',0);
	$('#navbar-progress').attr('style','width: ' + 0 + '%;');
	$('#navbar-progress').html("");

	if($("#btn-mute").length) $('#btn-mute').prop('disabled', true);
	if($("#btn-speakertext").length) $('#btn-speakertext').prop('disabled', true);

	$('#breadcrumb').html(lang(jsonLanguage.introduction));
	updateSpeakertext();

	if(scormEnabled) {
		loadScormStatus();
	} else {
		initHTML("intro/video.html");
	}
}

function redesignPlayer() {
	var dt = designTemplate.toLowerCase();
	$('.navbar-brand').html('<img src="img/logo.png">');

	if(dt == "sag") {
		currentDesign = designTemplates.sag;
	} else if(dt == "sh") {
		currentDesign = designTemplates.sh;
	} else if(dt == "default") {
		currentDesign = designTemplates.default;
	} else if(dt == "d") {
		currentDesign = designTemplates.d;
	}

	// Progress bar

	$('.progress').css('background-color',currentDesign.completionBar.bgColor);
	$('.progress-bar').css('background-color',currentDesign.completionBar.topColor);

}


function nextPage() {
	if(currentPage+1 <= pages.length-1) {
		initPage(currentPage+1);
	}
}

function prevPage() {
	if(currentPage-1 >= 0) {
		initPage(currentPage-1);
	}
}

function loadFirst() {
	initPage(0);
}

function showLoadingAnimation() {
	$('#loadingAnimation').stop(true,false).fadeIn(500);
}

function hideLoadingAnimation() {
	$('#loadingAnimation').stop(true,false).fadeOut(500);
}

function cleanStage() {

	cpvar = [];
	$('#btn-next').removeClass("highlight");

	// Clear Canvas Audio if available
	if(canvasTimeline != null && canvasTimeline != undefined) {
		if(canvasTimeline.speakerAudio != undefined && canvasTimeline.speakerAudio != null) {
			canvasTimeline.speakerAudio.destroy();
		}
	}
	if(currentVideoPlayer !== null && currentVideoPlayer !== undefined) $(currentVideoPlayer).css('display','none');

	currentVideoPlayer = null;
	currentFrameBody = null;

	playPauseState = "";
	canvasTimeline = null;
	toggleMute(true);
	setPlayPause("play");
	togglePlayPause(true);

	// Reset Speakertext if text was changed
	for(var i = 0; i < pages.length; i++) {
		pages[i].text = pages[i].originalText;
	}

	clearQueue();

}


function getFirstPageInChapter(_chap) {

	//console.log("Getting first page in chapter...");
//	console.log(_chap);

	if(typeof(_chap) == "string") {
		var chap;
		for(var i = 0; i<chapters.length; i++) {
			if(chapters[i].id == _chap) {
				chap = chapters[i];
			}
			for(var j = 0; j<chapters[i].children.length; j++) {
				if(chapters[i].children[j].type.toLowerCase() == "chapter" | chapters[i].children[j].type.toLowerCase() == "subchapter" | chapters[i].children[j].type.toLowerCase() == "subsubchapter") {
					if(chapters[i].children[j].id == _chap) {
						chap = chapters[i].children[j];
					}
					for(var k = 0; k<chapters[i].children[j].children.length; k++) {
						if(chapters[i].children[j].children[k].type == "chapter" | chapters[i].children[j].children[k].type == "subchapter" | chapters[i].children[j].children[k].type == "subsubchapter") {
							if(chapters[i].children[j].children[k].id == _chap) {
								chap = chapters[i].children[j].children[k];
							}
						}
					}
				}
			}
		}


		for(var i = 0; i < chap.children.length; i++) {
			if(chap.children[i].type.toLowerCase() != "chapter" && chap.children[i].type.toLowerCase() != "subchapter" && chap.children[i].type.toLowerCase() != "subsubchapter") {
				return chap.children[i].id;
			} else {
				for(var j = 0; j < chap.children[i].children.length; j++) {
					if(chap.children[i].children[j].type.toLowerCase() != "chapter" && chap.children[i].children[j].type.toLowerCase() != "subchapter" && chap.children[i].children[j].type.toLowerCase() != "subsubchapter") {
						return chap.children[i].children[j].id;
					} else {
						for(var k = 0; k < chap.children[i].children[j].children.length; k++) {
							if(chap.children[i].children[j].children[k].type.toLowerCase() != "chapter" && chap.children[i].children[j].children[k].type.toLowerCase() != "subchapter" && chap.children[i].children[j].children[k].type.toLowerCase() != "subsubchapter") {
								return chap.children[i].children[j].children[k].id;
							}
						}
					}
				}
			}
		}
	} else if(typeof(_chap) == "object") {
		var chap = _chap;
		for(var i = 0; i < chap.children.length; i++) {
			//console.log("i: " + chap.children[i].type.toLowerCase());
			if(chap.children[i].type.toLowerCase() != "chapter" && chap.children[i].type.toLowerCase() != "subchapter" && chap.children[i].type.toLowerCase() != "subsubchapter") {
				//console.log("Returning i " + chap.children[i].id + " / " + chap.children[i].nr);
				return chap.children[i].id;
			} else {
				for(var j = 0; j < chap.children[i].children.length; j++) {
					//console.log("j: " + chap.children[i].children[j].type.toLowerCase());
					if(chap.children[i].children[j].type.toLowerCase() != "chapter" && chap.children[i].children[j].type.toLowerCase() != "subchapter" && chap.children[i].children[j].type.toLowerCase() != "subsubchapter") {
						//console.log("Returning j " + chap.children[i].children[j].id + " / " + chap.children[i].children[j].nr);
						return chap.children[i].children[j].id;
					} else {
						for(var k = 0; k < chap.children[i].children[j].children.length; k++) {
							//console.log("k: " + chap.children[i].children[j].children[k].type.toLowerCase());
							if(chap.children[i].children[j].children[k].type.toLowerCase() != "chapter" && chap.children[i].children[j].children[k].type.toLowerCase() != "subchapter" && chap.children[i].children[j].children[k].type.toLowerCase() != "subsubchapter") {
								//console.log("Returning k " + chap.children[i].children[j].children[k].id + " / " + chap.children[i].children[j].children[k].nr);
								return chap.children[i].children[j].children[k].id;
							}
						}
					}
				}
			}
		}
	}

	return 0;
}

function initPage(param) {

	var obj;
	var timeskip = 0;

	if(typeof(param) == "string") {

		// Must be ID
		if(param.length > 15) {
			console.log("initPage() with generated ID.");
			for(var i = 0; i < pages.length; i++) {
				if(pages[i].id == param) {
					obj = pages[i];
				}
			}
		} else {
			console.log("Must be a number String");
			for(var i = 0; i < pages.length; i++) {
				if(pages[i].id == param | pages[i].nr == param) {
					obj = pages[i];
				}
			}
		}
	} else if(typeof(param) == "number") {
		obj = pages[param];
	} else if(typeof(param) == "object") {
		obj = param;
	}

	if(obj == undefined | obj == null) {
		console.log("initPage failsafe... Loading first page");
		obj = pages[0]; // Failsafe
	}

	if($('#navbar').css('visibility') == 'hidden') {
		$('#navbar').css('visibility','visible');
	}


	if($('#score-div').css('display') == 'none' && showScore) {
		showScoreCounter();
	}

	if(comingFromIntro) {
		comingFromIntro = false;
		$('#btn-reload').prop('disabled', false);
		if($("#btn-mute").length) $('#btn-mute').prop('disabled', false);
		if($("#btn-speakertext").length) $('#btn-speakertext').prop('disabled', false);
	}

	if(isOption(obj.options,"excursion")) {
		if(currentPage > -1) {
			if(!isOption(pages[currentPage].options,"excursion")) {
				excursionDeparturePage = getCurrentPage().id;
				if(currentVideoPlayer != null) {
					excursionDeparturePageTime = currentVideoPlayer.currentTime;
				}
			}
		}
	} else {
		if(typeof(arguments[1]) === "undefined") {
			excursionDeparturePage = "";
			excursionDeparturePageTime = 0;
		} else {
			if(typeof(arguments[1]) === 'number') {
				timeskip = arguments[1];
			}
		}

	}

	//console.log("Excursion Departure Page: " + excursionDeparturePage);

	cleanStage();
	currentPage = obj.i;
	markPageAsDone(obj.i);
	updateStatus();
	currentLocation = obj.i;

	// TBD, woanders hinpacken damit es nicht so oft übertragen wird
	saveScormStatus();

	if(timeskip !== 0) {
		initHTML(obj.path,timeskip);
	} else {
		initHTML(obj.path);
	}


}


function initPageFromMenu(param) {

	var obj;

	if(typeof(param) == "string") {
		for(var i = 0; i < pages.length; i++) {
			if(pages[i].id == param) {
				obj = pages[i];
			}
		}
	} else if(typeof(param) == "number") {
		obj = pages[param];
	} else if(typeof(param) == "object") {
		obj = param;
	}

	if(forceSequencing) {
		initPage(param);
	} else {

		if(obj.done) {
			initPage(param);
		} else {
			showNotDoneMessage();
		}
	}
}

function openMenu() {
	menuOpen = true;
	$('.wbt-menu-container').show();
	$('#hi1').show();
}

function closeMenu() {
	menuOpen = false;
	$('.wbt-menu-container').hide();
	$('.wbt-menu').removeClass('wbt-menu-active');

	resetClassesInLevel(0);
	hideHierarchyLevel(0);

}

function initMenu() {
	$('.wbt-menu').fadeIn(800);
	$('.wbt-menu').hover(function() {
		if(!menuOpen) {
			$(this).addClass('wbt-menu-active');
		}
	}, function() {
		if(!menuOpen) {
			$(this).removeClass('wbt-menu-active');
		} else {

		}
	});

	// Menu Click
	$('.wbt-menu').on('click',function() {
		if(menuOpen) {
			closeMenu();
		} else {
			openMenu();
		}
	});

	// Menu Background Click
	$('.wbt-menu-container').on('click',function() {
		closeMenu();
	});

	// Step 1: Do DOM related stuff
	for(var i = 0; i < chapters.length; i++) {
		// Chapter
		if(chapters[i].options.indexOf("excursion") == -1) {
			var _domObj = '<div id="con-'+chapters[i].id+'" class="wbt-menu-content-shape"><ul class="special list-group"></ul></div>';
			chapters[i].domObj = 'con-'+chapters[i].id;
			$('#hi2').append(_domObj);
			for(var j = 0; j < chapters[i].children.length; j++) {
				if(chapters[i].children[j].hasOwnProperty("children")) {
					var _domObj = '<div id="con-'+chapters[i].children[j].id+'" class="wbt-menu-content-shape"><ul class="special list-group"></ul></div>';
					chapters[i].children[j].domObj = 'con-'+chapters[i].children[j].id;
					$('#hi3').append(_domObj);
					// Chapter
					for(var k = 0; k < chapters[i].children[j].children.length; k++) {
						if(chapters[i].children[j].children[k].hasOwnProperty("children")) {
							var _domObj = '<div id="con-'+chapters[i].children[j].children[k].id+'" class="wbt-menu-content-shape"><ul class="special list-group"></ul></div>';
							chapters[i].children[j].children[k].domObj = 'con-'+chapters[i].children[j].children[k].id;
							$('#hi4').append(_domObj);
							// Chapter
							for(var l = 0; l < chapters[i].children[j].children[k].children.length; l++) {
								// Page
							}
						} else {
							// Page
						}
					}
				} else {
					// Page
				}
			}
		} else {
			// If Excursions (TBD)
		}
	}

	// Step 2: Fill DOM
	for(var i = 0; i < chapters.length; i++) {
		if(chapters[i].options.indexOf("excursion") == -1) {
			// Chapter
			var con = $('#hi1 .list-group');
			var _id = "a-"+chapters[i].id;
			chapters[i].domId = _id;
			if(showPageNrInMenu) {
				var _content = chapters[i].nr + ". " + chapters[i].title;
			} else {
				var _content = chapters[i].title;
			}
			_content+='<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>';
			con.append('<a data-i="'+i+'" id="'+_id+'" href="#" class="list-group-item">'+_content+'</a>');

			for(var j = 0; j < chapters[i].children.length; j++) {
				var con = $('#con-'+chapters[i].id + ' .list-group');
				var _id = "a-"+chapters[i].children[j].id;
				chapters[i].children[j].domId = _id;
				if(showPageNrInMenu) {
					var _content = chapters[i].children[j].nr + ". " + chapters[i].children[j].title;
				} else {
					var _content = chapters[i].children[j].title;
				}

				if(chapters[i].children[j].hasOwnProperty("children")) {
					// Chapter
					_content+='<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>';
					con.append('<a data-i="'+i+'" data-j="'+j+'" id="'+_id+'" href="#" class="list-group-item">'+_content+'</a>');
					for(var k = 0; k < chapters[i].children[j].children.length; k++) {
						var con = $('#con-'+chapters[i].children[j].id + ' .list-group');
						var _id = "a-"+chapters[i].children[j].children[k].id;
						chapters[i].children[j].children[k].domId = _id;
						if(showPageNrInMenu) {
							var _content = chapters[i].children[j].children[k].nr + ". " + chapters[i].children[j].children[k].title;
						} else {
							var _content = chapters[i].children[j].children[k].title;
						}

						if(chapters[i].children[j].children[k].hasOwnProperty("children")) {
							// Chapter
							_content+='<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>';
							con.append('<a data-i="'+i+'" data-j="'+j+'" data-k="'+k+'" id="'+_id+'" href="#" class="list-group-item">'+_content+'</a>');
							for(var l = 0; l < chapters[i].children[j].children[k].children.length; l++) {
								// Page
								var con = $('#con-'+chapters[i].children[j].children[k].id + ' .list-group');
								var _id = "a-"+chapters[i].children[j].children[k].children[l].id;
								chapters[i].children[j].children[k].children[l].domId = _id;
								if(showPageNrInMenu) {
									var _content = chapters[i].children[j].children[k].children[l].nr + ". " + chapters[i].children[j].children[k].children[l].title;
								} else {
									var _content = chapters[i].children[j].children[k].children[l].title;
								}
								con.append('<a data-i="'+i+'" data-j="'+j+'" data-k="'+k+'" data-l="'+l+'" id="'+_id+'" href="#" class="list-group-item">'+_content+'</a>');
							}
						} else {
							// Page
							con.append('<a data-i="'+i+'" data-j="'+j+'" data-k="'+k+'" id="'+_id+'" href="#" class="list-group-item">'+_content+'</a>');
						}
					}
				} else {
					// Page
					con.append('<a data-i="'+i+'" data-j="'+j+'" id="'+_id+'" href="#" class="list-group-item">'+_content+'</a>');
				}
			}
		}
	}

	// Step 3: Interaction

	for(var i = 0; i < chapters.length; i++) {
		// Chapter
		if(chapters[i].options.indexOf("excursion") == -1) {
			$('#'+chapters[i].domId).hover(function() {
				hideHierarchyLevel(1);
				hideHierarchyLevel(2);
				hideHierarchyLevel(3);
				resetClassesInLevel(1);
				//$(this).addClass('wbt-menu-entry-active');
				var num = Number($(this).data('i'));
				$('#'+chapters[num].domObj).show();
			}, function() {
				// Do nothing (yet)
			});

			$('#'+chapters[i].domId).on('click',function() {
				var num = Number($(this).data('i'));
				initPageFromMenu(getFirstPageInChapter(chapters[num]));
			});

			for(var j = 0; j < chapters[i].children.length; j++) {
				if(chapters[i].children[j].hasOwnProperty("children")) {
					$('#'+chapters[i].children[j].domId).hover(function() {
						hideHierarchyLevel(2);
						hideHierarchyLevel(3);
						resetClassesInLevel(2);
						var num = Number($(this).data('i'));
						var num2 = Number($(this).data('j'));
						$('#'+chapters[num].children[num2].domObj).show();
						$('#'+chapters[num].domId).addClass('wbt-menu-entry-active');
					}, function() {
						// Do nothing (yet)
					});

					$('#'+chapters[i].children[j].domId).on('click',function() {
						var num = Number($(this).data('i'));
						var num2 = Number($(this).data('j'));
						initPageFromMenu(getFirstPageInChapter(chapters[num].children[num2]));
					});

					// Chapter
					for(var k = 0; k < chapters[i].children[j].children.length; k++) {
						if(chapters[i].children[j].children[k].hasOwnProperty("children")) {
							$('#'+chapters[i].children[j].children[k].domId).hover(function() {
								hideHierarchyLevel(3);
								resetClassesInLevel(3);
								var num = Number($(this).data('i'));
								var num2 = Number($(this).data('j'));
								var num3 = Number($(this).data('k'));
								$('#'+chapters[num].children[num2].children[num3].domObj).show();
								$('#'+chapters[num].children[num2].domId).addClass('wbt-menu-entry-active');
							}, function() {
								// Do nothing (yet)
							});

							$('#'+chapters[i].children[j].children[k].domId).on('click',function() {
								var num = Number($(this).data('i'));
								var num2 = Number($(this).data('j'));
								var num3 = Number($(this).data('k'));
								initPageFromMenu(getFirstPageInChapter(chapters[num].children[num2].children[num3]));
							});
							// Chapter
							for(var l = 0; l < chapters[i].children[j].children[k].children.length; l++) {
								// Page
								$('#'+chapters[i].children[j].children[k].children[l].domId).hover(function() {
									var num = Number($(this).data('i'));
									var num2 = Number($(this).data('j'));
									var num3 = Number($(this).data('k'));
									$('#'+chapters[num].children[num2].children[num3].domId).addClass('wbt-menu-entry-active');
								}, function() {
									// Do nothing (yet)
								});

								$('#'+chapters[i].children[j].children[k].children[l].domId).on('click',function() {
									var num = Number($(this).data('i'));
									var num2 = Number($(this).data('j'));
									var num3 = Number($(this).data('k'));
									var num4 = Number($(this).data('l'));
									initPageFromMenu(chapters[num].children[num2].children[num3].children[num4]);
								});
							}
						} else {

							$('#'+chapters[i].children[j].children[k].domId).hover(function() {
								hideHierarchyLevel(3);
								resetClassesInLevel(3);
								var num = Number($(this).data('i'));
								var num2 = Number($(this).data('j'));
								$('#'+chapters[num].children[num2].domId).addClass('wbt-menu-entry-active');
							}, function() {
								// Do nothing (yet)
							});
							$('#'+chapters[i].children[j].children[k].domId).on('click',function() {
								var num = Number($(this).data('i'));
								var num2 = Number($(this).data('j'));
								var num3 = Number($(this).data('k'));
								initPageFromMenu(chapters[num].children[num2].children[num3]);
							});
						}
					}
				} else {
					$('#'+chapters[i].children[j].domId).hover(function() {
						hideHierarchyLevel(2);
						hideHierarchyLevel(3);
						resetClassesInLevel(2);
						var num = Number($(this).data('i'));
						$('#'+chapters[num].domId).addClass('wbt-menu-entry-active');
					}, function() {
						// Do nothing (yet)
					});
					$('#'+chapters[i].children[j].domId).on('click',function() {
						var num = Number($(this).data('i'));
						var num2 = Number($(this).data('j'));
						initPageFromMenu(chapters[num].children[num2]);
					});
				}
			}
		}
	}
}

function resetClassesInLevel(num) {
	if(num === 0) {
		for(var i = 0; i < chapters.length; i++) {
			if(chapters[i].options.indexOf("excursion") == -1) {
				$('#'+chapters[i].domId).removeClass('wbt-menu-entry-active');
				for(var j = 0; j < chapters[i].children.length; j++) {
					$('#'+chapters[i].children[j].domId).removeClass('wbt-menu-entry-active');
					if(chapters[i].children[j].hasOwnProperty("children")) {
						for(var k = 0; k < chapters[i].children[j].children.length; k++) {
							$('#'+chapters[i].children[j].children[k].domId).removeClass('wbt-menu-entry-active');
						}
					}
				}
			}
		}
	}

	if(num === 1) {
		for(var i = 0; i < chapters.length; i++) {
			if(chapters[i].options.indexOf("excursion") == -1) {
				$('#'+chapters[i].domId).removeClass('wbt-menu-entry-active');
			}
		}
	}

	if(num === 2) {
		for(var i = 0; i < chapters.length; i++) {
			if(chapters[i].options.indexOf("excursion") == -1) {
				for(var j = 0; j < chapters[i].children.length; j++) {
					$('#'+chapters[i].children[j].domId).removeClass('wbt-menu-entry-active');
				}
			}
		}
	}

	if(num === 3) {
		for(var i = 0; i < chapters.length; i++) {
			if(chapters[i].options.indexOf("excursion") == -1) {
				for(var j = 0; j < chapters[i].children.length; j++) {
					if(chapters[i].children[j].hasOwnProperty("children")) {
						for(var k = 0; k < chapters[i].children[j].children.length; k++) {
							$('#'+chapters[i].children[j].children[k].domId).removeClass('wbt-menu-entry-active');
						}
					}
				}
			}
		}
	}
}

function hideHierarchyLevel(num) {
	if(num === 0) {
		for(var i = 0; i < chapters.length; i++) {
			if(chapters[i].options.indexOf("excursion") == -1) {
				$('#'+chapters[i].domObj).hide();
				for(var j = 0; j < chapters[i].children.length; j++) {
					if(chapters[i].children[j].hasOwnProperty("children")) {
						$('#'+chapters[i].children[j].domObj).hide();
						for(var k = 0; k < chapters[i].children[j].children.length; k++) {
							if(chapters[i].children[j].children[k].hasOwnProperty("children")) {
								$('#'+chapters[i].children[j].children[k].domObj).hide();
							}
						}
					}
				}
			}
		}
	}

	if(num === 1) {
		for(var i = 0; i < chapters.length; i++) {
			if(chapters[i].options.indexOf("excursion") == -1) {
				$('#'+chapters[i].domObj).hide();
			}
		}
	}

	if(num === 2) {
		for(var i = 0; i < chapters.length; i++) {
			if(chapters[i].options.indexOf("excursion") == -1) {
				for(var j = 0; j < chapters[i].children.length; j++) {
					if(chapters[i].children[j].hasOwnProperty("children")) {
						$('#'+chapters[i].children[j].domObj).hide();
					}
				}
			}
		}
	}

	if(num === 3) {
		for(var i = 0; i < chapters.length; i++) {
			if(chapters[i].options.indexOf("excursion") == -1) {
				for(var j = 0; j < chapters[i].children.length; j++) {
					if(chapters[i].children[j].hasOwnProperty("children")) {
						for(var k = 0; k < chapters[i].children[j].children.length; k++) {
							if(chapters[i].children[j].children[k].hasOwnProperty("children")) {
								$('#'+chapters[i].children[j].children[k].domObj).hide();
							}
						}
					}
				}
			}
		}
	}
}

// #####################
// SCORM
// #####################

function getSCORM(val) {
	if(scormEnabled) {
		if(scormVersion === '1.2') {
			return SCOGetValue(val);
		} else if(scormVersion === '2004') {
			var _val = ScormProcessGetValue(val, true);
			if(_val === undefined | _val === "undefined") {
				_val = '';
			}
			return _val;
		} else {
			return SCOGetValue(val);
		}

	} else {
		return '';
	}
}

function setSCORM(what,val) {
	if(scormEnabled) {
		if(scormVersion === '1.2') {
			SCOSetValue(what,val);
			SCOCommit();
		} else if(scormVersion === '2004') {
			ScormProcessSetValue(what,val);
		} else {
			SCOSetValue(what,val);
			SCOCommit();
		}
	}
}


function loadScormStatus() {

	pagesDone = [];

	var suspendDataStr = '';
	var lessonStatusStr = '';
	var currentLocationStr = '';
	var _currentLocation = 0;

	suspendDataStr = getSCORM("cmi.suspend_data");


	if(scormVersion === '1.2') {
		lessonStatusStr = getSCORM('cmi.core.lesson_status');
	} else if(scormVersion === '2004') {
		lessonStatusStr = getSCORM('cmi.completion_status');

	    if (lessonStatusStr == "unknown"){
	        setSCORM("cmi.completion_status", "incomplete");
	    }
	} else {
		lessonStatusStr = getSCORM('cmi.core.lesson_status');
	}

	if(scormVersion === '1.2') {
		currentLocationStr = getSCORM("cmi.core.lesson_location");
	} else if(scormVersion === '2004') {
		currentLocationStr = getSCORM("cmi.location");
	} else {
		currentLocationStr = getSCORM("cmi.core.lesson_location");
	}

	if(suspendDataStr === undefined | suspendDataStr === null | suspendDataStr === NaN) {
		console.log("cmi.suspend_data is undefined");
	} else {
		if(suspendDataStr.indexOf("pages") > -1) {
			try {
				suspendData = JSON.parse(suspendDataStr);
			} catch(err) {
				console.log("Error:" + err);
				suspendData = {
					pages:[],
					points:[],
					data:[]
				}
			}

			for(var i = 0; i<suspendData.pages.length; i++) {
				for(var j = 0; j<pages.length; j++) {
					if(pages[j].i == parseInt(suspendData.pages[i])) {
						pagesDone.push(pages[j]);
					}
				}
			}

			for(var i = 0; i<pagesDone.length; i++) {
				pagesDone[i].done = true;
				pagesDone[i].completed = true;
			}

		} else {
			console.log("cmi.suspend_data String length is not valid");
		}
	}

	// SCORM Debugging

	console.log("Loading SCORM status...");
	console.log("cmi.suspend_data: " + suspendDataStr);
	console.log("Parsed suspend_data: ");
	console.log(suspendData);
	console.log("cmi.core.lesson_status: " + lessonStatusStr);
	console.log("suspend_data pages: " + suspendData.pages + " ("+suspendData.pages.length+")");
	console.log("Current Location: " + currentLocationStr);

	// End of SCORM Debugging

	updateProgressbar();

	if(lessonStatusStr === "completed" | lessonStatusStr === "passed") {
		isCompleted = true;
	} else {
		if(getCompletionPercentage() >= 100) {
			if(scormVersion === '1.2') {
				setSCORM("cmi.core.lesson_status","completed");
			} else if(scormVersion === '2004') {
				setSCORM("cmi.completion_status","completed");
			} else {
				setSCORM("cmi.core.lesson_status","completed");
			}

			isCompleted = true;
		}
	}

	if(currentLocationStr !== "" && currentLocationStr.length > 0) {
		_currentLocation = parseInt(currentLocationStr);
		showContinueLastSessionMessage(_currentLocation);
	} else {

		if(showIntro) {
			initHTML("intro/video.html");
		} else {
			initPage(0);
		}
	}
}


function saveScormStatus() {
	if(scormEnabled) {

		suspendData.pages = [];

		for(var i = 0;i<pagesDone.length; i++) {
			suspendData.pages.push(pagesDone[i].i);
		}

		var suspendDataStr = JSON.stringify(suspendData);

		console.log("Saving SCORM status...");
		console.log("suspendDataStr: " + suspendDataStr);

		setSCORM("cmi.suspend_data", suspendDataStr);

		if(scormVersion === '1.2') {
			setSCORM("cmi.core.lesson_location", currentLocation);
		} else if(scormVersion === '2004') {
			setSCORM("cmi.location", currentLocation);
		} else {
			setSCORM("cmi.core.lesson_location", currentLocation);
		}

		if(!isCompleted) {
			checkCompletionConditions();
		}
	}
}

function scormOut() {

	checkCompletionConditions();

	if(scormVersion === '1.2') {
		SCOFinish();
	} else if(scormVersion === '2004') {
	    ScormProcessSetValue("cmi.exit", "suspend");
	    ScormProcessTerminate();
	} else {
	    ScormProcessSetValue("cmi.exit", "suspend");
	    ScormProcessTerminate();
	}

}

function checkCompletionConditions() {

	if(scormVersion === '1.2') {
		var lessonStatus = getSCORM('cmi.core.lesson_status')
	} else if(scormVersion === '2004') {
		var lessonStatus = getSCORM('cmi.completion_status')
	} else {
		var lessonStatus = getSCORM('cmi.core.lesson_status')
	}

	switch(completionCondition) {
		case 'score-or-testScore':
			var _percentageGot = Math.floor(((mandatoryQuestions.length/100)*mandatoryQuestionsDone.length)*100);
			console.log(_percentageGot + "% of mandatory questions done");
			if(_percentageGot >= completionRequiredTestScore | score > completionRequiredScore) {
				if(lessonStatus !== "completed" && lessonStatus !== "passed") {
					if(scormVersion === '1.2') {
						setSCORM("cmi.core.lesson_status","completed");
					} else if(scormVersion === '2004') {
						setSCORM("cmi.completion_status","completed");
					} else {
						setSCORM("cmi.core.lesson_status","completed");
					}
					isCompleted = true;
				}
			}
			break;
		default:
			if(getCompletionPercentage() >= 100) {
				if(lessonStatus !== "completed" && lessonStatus !== "passed") {
					console.log("Setting lesson status to complete...");
					if(scormVersion === '1.2') {
						setSCORM("cmi.core.lesson_status","completed");
					} else if(scormVersion === '2004') {
						setSCORM("cmi.completion_status","completed");
					} else {
						setSCORM("cmi.core.lesson_status","completed");
					}
					isCompleted = true;
				}
			}
			break;
	}

}


// #####################
// / END SCORM
// #####################


function getTestPercentage() {
	var _percentageGot = Math.floor(((mandatoryQuestions.length/100)*mandatoryQuestionsDone.length)*100);
	if(typeof(_percentageGot) == "number") {
		return _percentageGot;
	} else {
		return 0;
	}
}


function markPageAsCompleted(nr) {
	pages[nr].completed = true;
}

// SCORM completion & Menu mark
function markPageAsDone(nr) {

	if(isOption(pages[nr].options,"ignoreInScore")) {
		pages[nr].done = false;
	} else {
		pages[nr].done = true;
	}

	var alrDone = false;
	for(var i = 0; i<pagesDone.length; i++) {
		if(pages[nr] == pagesDone[i]) {
			alrDone = true;
		}
	}
	if(!alrDone) {
		if(!isOption(pages[nr].options,"ignoreInScore")) {
			pagesDone.push(pages[nr]);
		}

	}

	// ############################
	// ####### Mark Chapter 2.0
	// ############################

	var numObjectsDone = 0; // Chapters
	var _numObjectsDone = 0; // Sub-Chapters or pages
	var __numObjectsDone = 0; // Sub-Sub-Chapters or pages
	var ___numObjectsDone = 0; // Pages

	// ####### Part 1: Set 'done' status for all PAGES

	// 1. hierarchy level - only chapters - Chapter
	for(var i = 0; i < chapters.length; i++) {

		// 2. hierarchy level - chapters & pages - Sub-Chapter
		if(typeof chapters[i].children !== 'undefined') {
			_numObjectsDone = 0;
			for(var j = 0; j < chapters[i].children.length; j++) {
				if(chapters[i].children[j].done) _numObjectsDone++;

				// 3. hierarchy level - chapters & pages - Sub-Sub-Chapter
				if(typeof chapters[i].children[j].children !== 'undefined') {
					__numObjectsDone = 0;
					for(var k = 0; k < chapters[i].children[j].children.length; k++) {
						if(chapters[i].children[j].children[k].done) __numObjectsDone++;

						// 4. hierarchy level - only page
						if(typeof chapters[i].children[j].children[k].children !== 'undefined') {
							___numObjectsDone = 0;
							for(var l = 0; l < chapters[i].children[j].children[k].children.length; l++) {
								if(chapters[i].children[j].children[k].children[l].done) ___numObjectsDone++;
							}
							//console.log(chapters[i].children[j].children[k].nr + ": " + ___numObjectsDone + " / " + chapters[i].children[j].children[k].children.length);
							if(___numObjectsDone == chapters[i].children[j].children[k].children.length) {
								chapters[i].children[j].children[k].done = true;
							}
						}
					}
					//console.log(chapters[i].children[j].nr + ": " + __numObjectsDone + " / " + chapters[i].children[j].children.length);
					if(__numObjectsDone == chapters[i].children[j].children.length) {
						chapters[i].children[j].done = true;
					}
				}
			}
			//console.log(chapters[i].nr + ": " + _numObjectsDone + " / " + chapters[i].children.length);
			if(_numObjectsDone == chapters[i].children.length) {
				chapters[i].done = true;
			}
		}
	}

	// ####### Part 2: Change css classes for completed chapters

	// 1. hierarchy level - only chapters - Chapter
	for(var i = 0; i < chapters.length; i++) {
		//console.log(chapters[i].type + ": " + chapters[i].nr + " ("+chapters[i].done+")");
		if(chapters[i].done) {
			$('#a-'+chapters[i].id).addClass('visited');
		}
		// 2. hierarchy level - chapters & pages - Sub-Chapter
		if(typeof chapters[i].children !== 'undefined') {
			for(var j = 0; j < chapters[i].children.length; j++) {
				//console.log("   " + chapters[i].children[j].type + ": " + chapters[i].children[j].nr + " ("+chapters[i].children[j].done+")");
				if((chapters[i].children[j].type.toLowerCase() == 'chapter' | chapters[i].children[j].type.toLowerCase() == 'subchapter') && chapters[i].children[j].done) $('#a-'+chapters[i].children[j].id).addClass('visited');

				// 3. hierarchy level - chapters & pages - Sub-Sub-Chapter
				if(typeof chapters[i].children[j].children !== 'undefined') {
					for(var k = 0; k < chapters[i].children[j].children.length; k++) {
						//console.log("      " + chapters[i].children[j].children[k].type + ": " + chapters[i].children[j].children[k].nr + " ("+chapters[i].children[j].children[k].done+")");
						if((chapters[i].children[j].children[k].type.toLowerCase() == 'chapter' | chapters[i].children[j].children[k].type.toLowerCase() == 'subsubchapter') && chapters[i].children[j].children[k].done) $('#a-'+chapters[i].children[j].children[k].id).addClass('visited');
						// 4. hierarchy level - only page
						if(typeof chapters[i].children[j].children[k].children !== 'undefined') {
							for(var l = 0; l < chapters[i].children[j].children[k].children.length; l++) {
								//console.log("         " + chapters[i].children[j].children[k].children[l].type + ": " + chapters[i].children[j].children[k].children[l].nr + " ("+chapters[i].children[j].children[k].children[l].done+")");
							}
						}
					}
				}
			}
		}
	}

	// ####### Part 3: Change css classes for completed pages

	// Remove 'current' class from all pages, add 'visited' class to completed pages and add 'current' class to current page

	for(var i = 0; i < pagesDone.length; i++) {
		$('#a-'+pagesDone[i].id).addClass('visited');
	}

	for(var i = 0; i < pages.length; i++) {
		$('#a-'+pages[i].id).removeClass('current');
	}

	$('#a-'+pages[currentPage].id).removeClass('visited');
	$('#a-'+pages[currentPage].id).addClass('current');


	// Remove 'current' class from all chapters

	for(var i = 0; i < chapters.length; i++) {
		$('#a-'+chapters[i].id).removeClass('current');
		// 2. hierarchy level - chapters & pages - Sub-Chapter
		if(typeof chapters[i].children !== 'undefined') {
			for(var j = 0; j < chapters[i].children.length; j++) {
				if(chapters[i].children[j].type.toLowerCase() == 'chapter' | chapters[i].children[j].type.toLowerCase() == 'subchapter') $('#a-'+chapters[i].children[j].id).removeClass('current');
				// 3. hierarchy level - chapters & pages - Sub-Sub-Chapter
				if(typeof chapters[i].children[j].children !== 'undefined') {
					for(var k = 0; k < chapters[i].children[j].children.length; k++) {
						if(chapters[i].children[j].children[k].type.toLowerCase() == 'chapter' | chapters[i].children[j].children[k].type.toLowerCase() == 'subsubchapter') $('#a-'+chapters[i].children[j].children[k].id).removeClass('current');
					}
				}
			}
		}
	}

	// Add 'current' and remove 'visited' class to chapters in which the current page is in

	for(var i = 0; i < chapters.length; i++) {
		// 2. hierarchy level - chapters & pages - Sub-Chapter
		if(typeof chapters[i].children !== 'undefined') {
			for(var j = 0; j < chapters[i].children.length; j++) {
				if(chapters[i].children[j].type.toLowerCase() == 'chapter' | chapters[i].children[j].type.toLowerCase() == 'subchapter') {
					// 3. hierarchy level - chapters & pages - Sub-Sub-Chapter
					if(typeof chapters[i].children[j].children !== 'undefined') {
						for(var k = 0; k < chapters[i].children[j].children.length; k++) {
							if(chapters[i].children[j].children[k].type.toLowerCase() == 'chapter' | chapters[i].children[j].children[k].type.toLowerCase() == 'subsubchapter') {
								if(typeof chapters[i].children[j].children[k].children !== 'undefined') {
									for(var l = 0; l < chapters[i].children[j].children[k].children.length; l++) {
										if(chapters[i].children[j].children[k].children[l].id == pages[currentPage].id) {
											$('#a-'+chapters[i].id).addClass('current');
											$('#a-'+chapters[i].children[j].id).addClass('current');
											$('#a-'+chapters[i].children[j].children[k].id).addClass('current');

											$('#a-'+chapters[i].id).removeClass('visited');
											$('#a-'+chapters[i].children[j].id).removeClass('visited');
											$('#a-'+chapters[i].children[j].children[k].id).removeClass('visited');
										}
									}
								}
							} else {
								if(chapters[i].children[j].children[k].id == pages[currentPage].id) {
									$('#a-'+chapters[i].id).addClass('current');
									$('#a-'+chapters[i].children[j].id).addClass('current');

									$('#a-'+chapters[i].id).removeClass('visited');
									$('#a-'+chapters[i].children[j].id).removeClass('visited');
								}
							}
						}
					}
				} else {
					if(chapters[i].children[j].id == pages[currentPage].id) {
						$('#a-'+chapters[i].id).removeClass('visited');
						$('#a-'+chapters[i].id).addClass('current');
					}
				}
			}
		}
	}
}

// Init of Buttons and Controls
function initControls() {

	// Play / Pause Button
	$('#btn-play').click(function() {
		if(getPlayPauseState() == "play") {
			// If video exists - is defined in preload.js (initVideo())

			// HTML Audio
			if(pageAudio.length > 0) {
				// with para?
				resumeAudio();
			}

			if(currentVideoPlayer != null) {
				//console.log(currentVideoPlayer.currentTime + ", " + currentVideoPlayer.duration);
				if(currentVideoPlayer.currentTime >= currentVideoPlayer.duration) {
					if(getCurrentPage().type == "video" | getCurrentPage().type == "poster" | getCurrentPage().type == "standard" | getCurrentPage().type == "standardpage" | getCurrentPage().type == "posterpage" | getCurrentPage().type == "objectpage") {
						if(currentVideoPlayer.readyState > 2 && (currentVideoPlayer.paused | currentVideoPlayer.ended)) {
							playVideo();
						}
					} else {
						initPage(getCurrentPage());
					}

				} else {
					//console.log("Playing video! " + currentVideoPlayer.currentTime + " / " + currentVideoPlayer.duration);
					playVideo();
				}

			// If no video exists
			} else {
				if(canvasTimeline != null) {
					setPlayPause("pause");
					if(canvasTimeline.currentFrame+1 >= canvasTimeline.totalFrames) {
						canvasTimeline.reload();
					} else {
						canvasTimeline.play();
					}

					if(canvasTimeline.speakerAudio != undefined) {
						canvasTimeline.speakerAudio.paused = false;
					}
				} else {
					// Only audio
					setPlayPause("pause");
				}
			}

		// If playing
		} else {

			// HTML Audio
			if(pageAudio.length > 0) {
				pauseAudio();
			}

			// If video exists
			if(currentVideoPlayer != null) {
				var isPlaying = currentVideoPlayer.currentTime > 0 && !currentVideoPlayer.paused && !currentVideoPlayer.ended && currentVideoPlayer.readyState > 2;

				//console.log("Trying to pause video... " + isPlaying);

				if (isPlaying) {
					//console.log("Pausing video #1");
					currentVideoPlayer.pause();
				} else {
					// Do nothing
				}
			// If no video exists
			} else {
				if(canvasTimeline != null) {
					setPlayPause("play");
					canvasTimeline.stop();

					if(canvasTimeline.speakerAudio != undefined) {
						canvasTimeline.speakerAudio.paused = true;
					}
				} else {
					setPlayPause("play");
				}
			}
		}
	});

	// Reload Button
	$('#btn-reload').click(function() {
		if(currentVideoPlayer !== null) {
			if(getCurrentPage().type === "video" | getCurrentPage().type === "poster" | getCurrentPage().type === "standard" | getCurrentPage().type == "standardpage" | getCurrentPage().type == "posterpage" | getCurrentPage().type == "objectpage") {
				document.getElementById('playerFrame').contentWindow.cleanupAutoplay();
			    currentVideoPlayer.currentTime = 0;
			    currentVideoPlayer.play();
			} else if(getCurrentPage().type === undefined){
				try {
					document.getElementById('playerFrame').contentWindow.cleanupAutoplay();
				    currentVideoPlayer.currentTime = 0;
				    currentVideoPlayer.play();
				} catch(err) {
					console.log(err);
				}
			} else {
				initPage(getCurrentPage());
			}

		// If no video exists
		} else {
			initPage(getCurrentPage());
		}
	});


	// Mute Button
	$('#btn-mute').click(function() {
		// HTML Audio

		if(isMuted()) {
			unmuteSpeakerAudio();

		} else {
			muteSpeakerAudio();
		}

		// If video exists
		if(currentVideoPlayer != null) {
			if(currentVideoPlayer.volume > 0) {
				currentVideoPlayer.volume = 0;
			} else {
				currentVideoPlayer.volume = 1;
			}
		// If no video exists
		} else {
			if(canvasTimeline != null) {
				if(isMuted()) {
					if(canvasTimeline.speakerAudio != undefined) {
						canvasTimeline.speakerAudio.volume = 1;
					}
					setMute(false);
				} else {
					if(canvasTimeline.speakerAudio != undefined) {
						canvasTimeline.speakerAudio.volume = 0;
					}
					setMute(true);
				}
			} else {
				console.log("No canvas timeline");

				if(isMuted()) {
					unmuteSpeakerAudio();
					setMute(false);
				} else {
					muteSpeakerAudio();
					setMute(true);
				}

			}
		}
	});

	// Speakertext Button
	$('#btn-speakertext').click(function() {
		if(speakertextIsOpen) {
			jsPanel.activePanels.getPanel("speaker-panel").close();
		} else {
			openSpeakertext();
		}
	});

	// Info Button
	$('#btn-info').click(function() {
		openImprint();
	});

	// Glossary Button

	$('#btn-glossary').click(function() {
		openGlossary();
	});

	// Help Button
	$('#btn-help').click(function() {
		openHelp();
	});

	// Print Button
	$('#btn-print').click(function() {
		printPage();
	});

	// Previous Button
	$('#btn-prev').click(function() {
		if(getCurrentPage().customPrevious != undefined) {
			if(getCurrentPage().customPrevious) {
				getCurrentPage().customPreviousFunction();
			} else {
				prevPage();
			}
		} else {
			prevPage();
		}
	});

	// Next Button
	$('#btn-next').click(function() {
		if(getCurrentPage().customNext != undefined) {
			if(getCurrentPage().customNext) {
				getCurrentPage().customNextFunction();
			} else {
				nextPage();
			}
		} else {
			nextPage();
		}
	});

	// Close Excursion

	$('#exit-excursion button').click(function() {
		initPage(excursionDeparturePage,true);
	});

	// Focus hack
	$(".btn").mouseup(function(){
	    $(this).blur();
	})

}

function playVideo() {

	var arg = undefined;

	if(arguments[0] !== undefined) {
		arg = arguments[0];
	}

	var vidStatus = ['Unknown video','META Initialization','HAVE_CURRENT_DATA','HAVE_FUTURE_DATA','HAVE_ENOUGH_DATA'];

	if(currentVideoPlayer != null) {
		if(currentVideoPlayer.readyState > 2 && (currentVideoPlayer.paused | currentVideoPlayer.ended)) {
			if(isIE11) {

				if(arg !== undefined) {
					currentVideoPlayer.currentTime = arg;
					currentVideoPlayer.play();
				} else {
					currentVideoPlayer.play();
				}

			} else {

				if(arg !== undefined) {
					currentVideoPlayer.currentTime = arg;
				}
				var promise = currentVideoPlayer.play();

				if (promise !== undefined) {

					promise.then(function(value) {
						//console.log("Autoplay enabled... Starting video.");
						document.getElementById('playerFrame').contentWindow.cleanupAutoplay();
					}, function(reason) {
						console.log("Autoplay blocked... Showing Play button.");

						document.getElementById('playerFrame').contentWindow.showAutoplayScreen();
					});
				} else {
					console.log("Autoplay blocked... Showing Play button.");

					document.getElementById('playerFrame').contentWindow.showAutoplayScreen();
				}
			}

		} else {
			console.log("Video error: " + vidStatus[currentVideoPlayer.readyState]);
		}

	}
}


// #####################
// Bootboxes
// #####################

function showNotDoneMessage() {
	bootbox.alert({
		title: lang(jsonLanguage.notdone.title),
	    message: lang(jsonLanguage.notdone.content),
		buttons: {
			ok: {
				label: lang(jsonLanguage.buttons.btnConfirm),
				className: 'btn-primary'
			}
		},
		backdrop: true
	}).find('.modal-content').css({
		'margin-top':'170px'
	});
}

function showContinueLastSessionMessage(cl) {
	bootbox.confirm({
		title: lang(jsonLanguage.lastSession.title),
		size: "small",
		message: lang(jsonLanguage.lastSession.content),
		buttons: {
			confirm: {
				label: lang(jsonLanguage.buttons.btnYes),
				className: 'btn-primary'
			},
			cancel: {
				label: lang(jsonLanguage.buttons.btnCancel),
				className: 'btn-default'
			}
		},
		callback: function(result){
			if(result) {
				currentLocation = cl;
				initPage(currentLocation);
			} else {
				if(showIntro) {
					initHTML("intro/video.html");
				} else {
					initPage(0);
				}
			}
		}
	}).find('.modal-content').css({
		'margin-top':'200px'
	});
}

function showFeedbackMessage(title,buttonTitle,str,correct) {

	var classDef = 'btn-success';
	if(!correct) classDef = 'btn-danger';

	bootbox.alert({
		title: title,
		size: "small",
		message: str,
		buttons: {
			ok: {
				label: buttonTitle,
				className: classDef
			}
		},
		callback: function(result){
			if(correct) {
				highlightNext();
				// getCurrentPage().done
				// nextPage();
			}
		}
	}).find('.modal-content').css({
		'margin-top':'200px'
	});
}

function openImprint() {

	var imprintMessage = '';

	if(jsonMetadata.companyTitle.length > 1) {
		imprintMessage+='<b>'+lang(jsonLanguage.imprint.companyTitle)+'</b><br>'+jsonMetadata.companyTitle+'<br><br>';
	}
	if(jsonMetadata.companyDepartment.length > 1) {
		imprintMessage+='<b>'+lang(jsonLanguage.imprint.companyDepartment)+'</b><br>'+jsonMetadata.companyDepartment+'<br><br>';
	}
	if(jsonMetadata.supervisor.length > 1) {
		imprintMessage+='<b>'+lang(jsonLanguage.imprint.supervisor)+'</b><br>'+jsonMetadata.supervisor+'<br><br>';
	}
	if(jsonMetadata.storyboardAuthor.length > 1) {
		imprintMessage+='<b>'+lang(jsonLanguage.imprint.storyboardAuthor)+'</b><br>'+jsonMetadata.storyboardAuthor+'<br><br>';
	}
	if(jsonMetadata.contentOwner.length > 1) {
		imprintMessage+='<b>'+lang(jsonLanguage.imprint.contentOwner)+'</b><br>'+jsonMetadata.contentOwner+'<br><br>';
	}
	if(jsonMetadata.publishDate.length > 1) {
		imprintMessage+='<b>'+lang(jsonLanguage.imprint.publishDate)+'</b><br>'+jsonMetadata.publishDate+'<br><br>';
	}

	imprintMessage+='<b>'+lang(jsonLanguage.copyright)+'</b><br>'+copyrightMessage+'<br><br>';

	if(jsonMetadata.customImprint.length > 1) {
		imprintMessage = jsonMetadata.customImprint;
	}

	bootbox.alert({
		title: lang(jsonLanguage.imprint.headline),
		message: imprintMessage,
		buttons: {
			ok: {
				label: lang(jsonLanguage.imprint.btnClose),
				className: 'btn-primary'
			}
		},
		backdrop: true
	});
}

function openHelp() {

	var menuStatic = '<div style="margin:0 0 10px 0; padding:15px 0 0 14px; background-color:#f5f5f5; width:400px; height: 60px; border-radius:8px"><button type="button" style="margin-left:15px" class="btn btn-default btn-sm smoothing" data-toggle="tooltip" data-placement="top" title=""> <span class="glyphicon glyphicon-repeat" aria-hidden="true"></span> </button> <button type="button" class="btn btn-default btn-sm" data-toggle="tooltip" data-placement="top" title=""> <span class="glyphicon glyphicon-play" aria-hidden="true"></span> </button> <button type="button" class="btn btn-default btn-sm" data-toggle="tooltip" data-placement="top" title="" disabled> <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span> <span id="span-previous">'+lang(jsonLanguage.buttons.btnPreviousLabel)+'</span> </button> <div id="page-nr">Intro</div> <button type="button" class="btn btn-default btn-sm" data-toggle="tooltip" data-placement="top" title=""> <span id="span-next">'+lang(jsonLanguage.buttons.btnNextLabel)+'</span> <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span> </button></div>';
	var menuDynamic = '<div style="margin:0 0 10px 0; padding:15px 0 0 14px; background-color:#f5f5f5; width:400px; height: 60px; border-radius:8px"><button type="button" style="margin-left:15px" class="btn btn-default btn-sm smoothing" data-toggle="tooltip" data-placement="top" title=""> <span class="glyphicon glyphicon-repeat" aria-hidden="true"></span> </button> <button type="button" class="btn btn-default btn-sm" data-toggle="tooltip" data-placement="top" title=""> <span class="glyphicon glyphicon-play" aria-hidden="true"></span> </button> <button type="button" class="btn btn-default btn-sm" data-toggle="tooltip" data-placement="top" title="" disabled> <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span> <span id="span-previous">'+lang(jsonLanguage.buttons.btnPreviousLabel)+'</span> </button> <div id="page-nr">Intro</div> <button type="button" class="btn btn-default btn-sm highlight" data-toggle="tooltip" data-placement="top" title=""> <span id="span-next">'+lang(jsonLanguage.buttons.btnNextLabel)+'</span> <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span> </button></div>';

	// <img src="img/'+language+'/navi-static.png" alt="'+lang(jsonLanguage.help.navigationHeadline)+'" class="img-rounded">

	var helpStr1 = '<div>';

	var helpStr2 = '<ul class="nav nav-tabs" data-tabs="tabs"><li role="presentation" class="active"><a href="#h-navigation" data-toggle="tab">'+lang(jsonLanguage.help.navigationHeadline)+'</a></li><li role="presentation"><a href="#h-menu" data-toggle="tab">'+lang(jsonLanguage.help.menuHeadline)+'</a> </li> <li role="presentation"> <a href="#h-functions" data-toggle="tab">'+lang(jsonLanguage.help.functionsHeadline)+'</a> </li> <li role="presentation"> <a href="#h-misc" data-toggle="tab">'+lang(jsonLanguage.help.miscHeadline)+'</a> </li> </ul>';
	var helpStr3 = '<div id="my-tab-content" class="tab-content">';

	var helpStr4 = '<div class="tab-pane active" id="h-navigation"> <div class="container help-div">'+menuStatic+'<p> '+ lang(jsonLanguage.help.navigationContent1) +' </p>'+menuDynamic+'<p> '+lang(jsonLanguage.help.navigationContent2)+'</p> </div> </div>';
	var helpStr5 = '<div class="tab-pane" id="h-menu"> <div class="container help-div"> <img src="img/'+language+'/menu.jpg" alt="'+lang(jsonLanguage.help.menuHeadline)+'" class="img-rounded"> <p> '+lang(jsonLanguage.help.menuContent)+' </p> </div> </div>';
	var helpStr6 = '<div class="tab-pane" id="h-functions"><div class="container help-div">';
	var helpStr7 = '';

	if(jsonSettings.activeButtons.btnMute) helpStr7 		+= '<div class="help-div-tline"> <div class="help-div-tl"><button class="btn btn-default btn-sm" data-toggle="tooltip" data-placement="top" title="'+lang(jsonLanguage.buttonTooltips.btnSound)+'"><span class="glyphicon glyphicon-volume-up" aria-hidden="true"></span></button></div> <div class="help-div-tr"> <span>'+lang(jsonLanguage.help.functionsAudio)+'</span></div></div>';
	if(jsonSettings.activeButtons.btnSpeakertext) helpStr7 	+= '<div class="help-div-tline"> <div class="help-div-tl"><button class="btn btn-default btn-sm" data-toggle="tooltip" data-placement="top" title="'+lang(jsonLanguage.buttonTooltips.btnSpeaker)+'"><span class="glyphicon glyphicon-comment" aria-hidden="true"></span></button></div> <div class="help-div-tr"> <span>'+lang(jsonLanguage.help.functionsSpeakertext)+'</span></div></div>';
	if(jsonSettings.activeButtons.btnPrint)helpStr7 		+= '<div class="help-div-tline"> <div class="help-div-tl"><button class="btn btn-default btn-sm" data-toggle="tooltip" data-placement="top" title="'+lang(jsonLanguage.buttonTooltips.btnPrint)+'"><span class="glyphicon glyphicon-print" aria-hidden="true"></span></button></div> <div class="help-div-tr"> <span>'+lang(jsonLanguage.help.functionsPrint)+'</span></div></div>';
	if(jsonSettings.activeButtons.btnGlossary) helpStr7 	+= '<div class="help-div-tline"> <div class="help-div-tl"><button class="btn btn-default btn-sm" data-toggle="tooltip" data-placement="top" title="'+lang(jsonLanguage.buttonTooltips.btnGlossary)+'"><span class="glyphicon glyphicon-book" aria-hidden="true"></span></button></div> <div class="help-div-tr"> <span>'+lang(jsonLanguage.help.functionsGlossary)+'</span></div></div>';
	if(jsonSettings.activeButtons.btnInfo) helpStr7 		+= '<div class="help-div-tline"> <div class="help-div-tl"><button class="btn btn-default btn-sm" data-toggle="tooltip" data-placement="top" title="'+lang(jsonLanguage.buttonTooltips.btnImprint)+'"><span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span></button></div> <div class="help-div-tr"> <span>'+lang(jsonLanguage.help.functionsImprint)+'</span></div></div>';
	if(jsonSettings.activeButtons.btnHelp) helpStr7 		+= '<div class="help-div-tline"> <div class="help-div-tl"><button class="btn btn-default btn-sm" data-toggle="tooltip" data-placement="top" title="'+lang(jsonLanguage.buttonTooltips.btnHelp)+'"><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span></button></div> <div class="help-div-tr"> <span>'+lang(jsonLanguage.help.functionsHelp)+'</span></div></div>';

	var helpStr8 = '</div></div>';

	var helpStr9 = '<div class="tab-pane" id="h-misc"><div class="container help-div">';

	$('.progress').css('background-color',currentDesign.completionBar.bgColor);
	$('.progress-bar').css('background-color',currentDesign.completionBar.topColor);

	var bc1 = 'background-color: ' + currentDesign.completionBar.bgColor + ';';
	var bc2 = 'background-color: ' + currentDesign.completionBar.topColor + ';';

	var helpStr10 = '<div class="progress" style="'+bc1+' width:360px"> <div class="progress-bar" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="'+bc2+' width: 20%;"> 20% </div> </div> '+lang(jsonLanguage.help.miscContent);

	var helpStr11 = '</div></div>';

	var helpStrEnd1 = '</div>'; // closes helpStr3
	var helpStrEnd2 = '</div>'; // closes helpStr1

	bootbox.alert({
		title: lang(jsonLanguage.help.headline),
	    message: helpStr1+helpStr2+helpStr3+helpStr4+helpStr5+helpStr6+helpStr7+helpStr8+helpStr9+helpStr10+helpStr11+helpStrEnd1+helpStrEnd2,
		buttons: {
			ok: {
				label: lang(jsonLanguage.help.btnClose),
				className: 'btn-primary'
			}
		},
	    backdrop: true
	});
}

function openGlossaryEntry(str) {
	var title = "Unknown entry";
	var content = "";
	var _gap = 130;
	var _entryfound = false;

	for(var i = 0; i<jsonGlossary.length; i++) {
		if(str.toLowerCase() == jsonGlossary[i].title.toLowerCase()) {
			title = jsonGlossary[i].title;
			content = jsonGlossary[i].content;
			_entryfound = true;
		}
	}

	if(!_entryfound) {
		for(var i = 0; i<jsonGlossary.length; i++) {
			if(str.toLowerCase() == jsonGlossary[i].id.toLowerCase()) {
				title = jsonGlossary[i].title;
				content = jsonGlossary[i].content;
				_entryfound = true;
			}
		}
	}

	if(arguments[1] !== undefined) {
		if(typeof(arguments[1]) == "number") {
			_gap = arguments[1];
		}
	}

	bootbox.dialog({
		title: title,
		message: content,
		closeButton: true,
		backdrop: true,
		onEscape: true
	}).find('.modal-content').css({
		'margin-top': _gap + "px"
	});

}

function openGlossary() {
	glossarySigns = [];
	var glossaryStr = '<div id="div-glossary"> <ul class="nav nav-tabs" data-tabs="tabs"> <li id="gl-li-special" role="presentation" class="active"> <a href="#gl-special" data-toggle="tab">#</a> </li> <li id="gl-li-numbers" role="presentation"> <a href="#gl-numbers" data-toggle="tab">0-9</a> </li> <li id="gl-li-a" role="presentation"> <a href="#gl-a" data-toggle="tab">A</a> </li> <li id="gl-li-b" role="presentation"> <a href="#gl-b" data-toggle="tab">B</a> </li> <li id="gl-li-c" role="presentation"> <a href="#gl-c" data-toggle="tab">C</a> </li> <li id="gl-li-d" role="presentation"> <a href="#gl-d" data-toggle="tab">D</a> </li> <li id="gl-li-e" role="presentation"> <a href="#gl-e" data-toggle="tab">E</a> </li> <li id="gl-li-f" role="presentation"> <a href="#gl-f" data-toggle="tab">F</a> </li> <li id="gl-li-g" role="presentation"> <a href="#gl-g" data-toggle="tab">G</a> </li> <li id="gl-li-h" role="presentation"> <a href="#gl-h" data-toggle="tab">H</a> </li> <li id="gl-li-i" role="presentation"> <a href="#gl-i" data-toggle="tab">I</a> </li> <li id="gl-li-j" role="presentation"> <a href="#gl-j" data-toggle="tab">J</a> </li> <li id="gl-li-k" role="presentation"> <a href="#gl-k" data-toggle="tab">K</a> </li> <li id="gl-li-l" role="presentation"> <a href="#gl-l" data-toggle="tab">L</a> </li> <li id="gl-li-m" role="presentation"> <a href="#gl-m" data-toggle="tab">M</a> </li> <li id="gl-li-n" role="presentation"> <a href="#gl-n" data-toggle="tab">N</a> </li> <li id="gl-li-o" role="presentation"> <a href="#gl-o" data-toggle="tab">O</a> </li> <li id="gl-li-p" role="presentation"> <a href="#gl-p" data-toggle="tab">P</a> </li> <li id="gl-li-q" role="presentation"> <a href="#gl-q" data-toggle="tab">Q</a> </li> <li id="gl-li-r" role="presentation"> <a href="#gl-r" data-toggle="tab">R</a> </li> <li id="gl-li-s" role="presentation"> <a href="#gl-s" data-toggle="tab">S</a> </li> <li id="gl-li-t" role="presentation"> <a href="#gl-t" data-toggle="tab">T</a> </li> <li id="gl-li-u" role="presentation"> <a href="#gl-u" data-toggle="tab">U</a> </li> <li id="gl-li-v" role="presentation"> <a href="#gl-v" data-toggle="tab">V</a> </li> <li id="gl-li-w" role="presentation"> <a href="#gl-w" data-toggle="tab">W</a> </li> <li id="gl-li-x" role="presentation"> <a href="#gl-x" data-toggle="tab">X</a> </li> <li id="gl-li-y" role="presentation"> <a href="#gl-y" data-toggle="tab">Y</a> </li> <li id="gl-li-z" role="presentation"> <a href="#gl-z" data-toggle="tab">Z</a> </li> </ul> <div id="my-tab-content" class="tab-content"> <div class="tab-pane active" id="gl-special"></div> <div class="tab-pane" id="gl-numbers"></div> <div class="tab-pane" id="gl-a"></div> <div class="tab-pane" id="gl-b"></div> <div class="tab-pane" id="gl-c"></div> <div class="tab-pane" id="gl-d"></div> <div class="tab-pane" id="gl-e"></div> <div class="tab-pane" id="gl-f"></div> <div class="tab-pane" id="gl-g"></div> <div class="tab-pane" id="gl-h"></div> <div class="tab-pane" id="gl-i"></div> <div class="tab-pane" id="gl-j"></div> <div class="tab-pane" id="gl-k"></div> <div class="tab-pane" id="gl-l"></div> <div class="tab-pane" id="gl-m"></div> <div class="tab-pane" id="gl-n"></div> <div class="tab-pane" id="gl-o"></div> <div class="tab-pane" id="gl-p"></div> <div class="tab-pane" id="gl-q"></div> <div class="tab-pane" id="gl-r"></div> <div class="tab-pane" id="gl-s"></div> <div class="tab-pane" id="gl-t"></div> <div class="tab-pane" id="gl-u"></div> <div class="tab-pane" id="gl-v"></div> <div class="tab-pane" id="gl-w"></div> <div class="tab-pane" id="gl-x"></div> <div class="tab-pane" id="gl-y"></div> <div class="tab-pane" id="gl-z"></div> </div> </div>';

	bootbox.alert({
		title: lang(jsonLanguage.glossary.headline),
	    message: glossaryStr,
		size: 'large',
		buttons: {
			ok: {
				label: lang(jsonLanguage.glossary.btnClose),
				className: 'btn-primary'
			}
		},
	    backdrop: true
	});

	for(var i = 0; i<jsonGlossary.length; i++) {
		addGlossaryItem(jsonGlossary[i]);
	}

	var allGlossarySigns = ["special","numbers","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];

	for(var i = 0; i<allGlossarySigns.length; i++) {
		var hasChar = false;
		var isChar = allGlossarySigns[i];
		for(var j = 0; j<glossarySigns.length; j++) {
			if(allGlossarySigns[i] == glossarySigns[j]) {
				hasChar = true;
			}
		}

		if(!hasChar) {
			try {
				$('#gl-li-'+isChar+" a").removeAttr("data-toggle");
				$('#gl-li-'+isChar).addClass("disabled");
			} catch(err) {
				console.log(err.message);
			}
		}
	}
}

function addGlossaryItem(obj) {
	var _char = obj.title.toLowerCase().charAt(0);

	var _div1 = document.createElement("div");
	_div1.className = "panel panel-default";
	var _div2 = document.createElement("div");
	_div2.className = "panel-heading";
	var _div3 = document.createElement("div");
	_div3.className = "panel-body";

	_div2.innerHTML = obj.title;
	_div3.innerHTML = obj.content;

	_div1.appendChild(_div2);
	_div1.appendChild(_div3);

	// Check if its a - z
	if(/^[a-zA-Z]+$/.test(_char)) {
		glossarySigns.indexOf(_char) === -1 ? glossarySigns.push(_char) : emptyFunction();
	} else {
		// If its a number ...
		if(/^\d+$/.test(_char)) {
			_char = "numbers";
			glossarySigns.indexOf(_char) === -1 ? glossarySigns.push(_char) : emptyFunction();
		} else {
			// ... or a special sign
			_char = "special";
			glossarySigns.indexOf(_char) === -1 ? glossarySigns.push(_char) : emptyFunction();
		}
	}

	try {
		document.getElementById("gl-"+_char).appendChild(_div1);
	} catch(err) {
		console.log(err.message);
	}
}


function emptyFunction() {
	// Do nothing
}

// #####################
// Preload JS
// #####################

function parameterTest(bool) {
	if (bool !== undefined) {
		return true;
	} else {
		return false;
	}
}

function getCurrentPath() {
	var cpath = getCurrentPage().path;
	if(cpath.indexOf('/') != -1) {
		cpath = cpath.slice(0,cpath.indexOf('/'));
	}
	return cpath;
}

// Audio

function loadAudioFiles(autostart,_arr) {

	var arr = [];

	for(var i = 0; i<_arr.length; i++) {
		arr[i] = _arr[i].path;
	}

	var queue = new createjs.LoadQueue(true);
	queue.installPlugin(createjs.Sound);

	queue.on("fileload", handleFileLoad, this); // When one file is loaded
	//queue.on("progress", handleProgress, this); // Total progress
	queue.on("complete", handleComplete, this); // When all files are loaded
	queue.on("error", handleError, this); // Error handling

	//console.log("loadAudioFiles... set audioLoaded to false");

	audioLoaded = false;
	audioAutostart = false;

	if(autostart) {
		audioAutostart = true;
	}

	var _manifest = [];
	var cpath = getCurrentPage().path;

	if(cpath.indexOf('/') != -1) {
		cpath = cpath.slice(0,cpath.indexOf('/'));
	}

	if(parameterTest(arguments[2])) {
		cpath = contentPath+cpath+arguments[2];
	} else {
		cpath = contentPath+cpath+"/";
	}

	for(var i = 0; i < _arr.length; i++) {
		var file = {
			id:_arr[i].id,
			src:cpath + _arr[i].path
		}
		_manifest.push(file);
	}

	queue.loadManifest(_manifest);

}


function handleFileLoad(event) {
	var obj = new Object();
	obj.item = event.item;
	obj.id = event.item.id;
	var _audio = createjs.Sound.createInstance(obj.id);
	obj.audio = _audio;
	pageAudio.push(obj);
}

function handleComplete(event) {
	console.log("All audio files loaded.");
	audioLoaded = true;
	if(audioAutostart) {
		playAudio(0);
	}
}

function handleError(error) {
	console.log(error);
}


function clearQueue() {
	pageImages = [];

	if(pageAudio.length > 0) {
		for(var i = 0; i < pageAudio.length; i++) {
			createjs.Sound.removeSound(pageAudio[i].id);
		}
	}

	try {
		createjs.Sound.removeAllSounds();
	} catch(err) {
		console.log("Cannot remove all sounds...");
	}

	pageAudio = [];
	audioAutostart = false;
}

// Optional arguments: nr:Number
function playAudio() {

	if(pageAudio.length > 0) {
		if(isMuted()) {
			muteSpeakerAudio();
		} else {
			unmuteSpeakerAudio();
		}

		if(arguments.length > 0) {
			if(typeof(arguments[0]) == "number") {
				try {
					pageAudio[arguments[0]].audio.play({offset:0,delay:0});
				} catch(err) {
					console.log("playAudio ERROR (in playAudio function)");
				}
			} else if(typeof(arguments[0]) == "string") {
				for(var i = 0; i<pageAudio.length; i++) {
					if(pageAudio[i].id == arguments[0]) {
						pageAudio[i].audio.play({offset:0,delay:0});
					}
				}
			}
		} else {
			try {
				pageAudio[0].audio.play({offset:0,delay:0});
			} catch(err) {
				console.log("playAudio ERROR (in playAudio function)");
			}
		}
	}
}

function resumeAudio() {
  	//console.log("Resuming audio");

	if(arguments.length > 0) {
		try {
			if(typeof(arguments[0]) == "string") {
				for(var i = 0; i<pageAudio.length; i++) {
					if(pageAudio[i].id == arguments[0]) {
						if(pageAudio[i].audio.playState == "playFinished" | pageAudio[i].audio.position == 0) {
							// Do nothing
						} else {
							pageAudio[i].audio.play();
							break;
						}
					}
				}
			}
		} catch(err) {
			console.log("Resume audio error");
		}
	} else {
		try {
			for(var i = 0; i<pageAudio.length; i++) {
				if(pageAudio[i].audio.playState !== null) {
					if(pageAudio[i].audio.playState == "playFinished" | pageAudio[i].audio.position == 0) {
						// Do nothing
					} else {
						pageAudio[i].audio.play();
						break;
					}
				}
			}
		} catch(err) {
			console.log("Resume audio error");
		}
	}
}

function pauseAudio() {
	//console.log("Pausing audio");
	if(arguments.length > 0) {
		if(typeof(arguments[0]) == "number") {
			try {
				if(pageAudio[arguments[0]].audio.playState == "playFinished" | pageAudio[arguments[0]].audio.position == 0) {
					// Do nothing
				} else {
					pageAudio[arguments[0]].audio.paused = true;
				}
			} catch(error) {
				console.log(error);
			}
		} else if(typeof(arguments[0]) == "string") {
			for(var i = 0; i<pageAudio.length; i++) {
				if(pageAudio[i].id == arguments[0]) {
					pageAudio[i].audio.paused = true;
				}
			}
		}
	} else {
		try {
			for(var i = 0; i<pageAudio.length; i++) {
				if(pageAudio[i].audio.playState == "playFinished" | pageAudio[i].audio.position == 0) {
					// Do nothing
				} else {
					pageAudio[i].audio.paused = true;
				}
			}
		} catch(error) {
			console.log("pauseAudio ERROR");
		}
	}
}

function stopAudio() {

	if(arguments.length > 0) {

		if(typeof(arguments[0]) == "number") {
			try {
				if(pageAudio[arguments[0]].audio.playState == "playFinished" | pageAudio[arguments[0]].audio.position == 0) {
					// Do nothing
				} else {
					pageAudio[arguments[0]].audio.stop();
				}
			} catch(error) {
				console.log(error);
			}
		} else if(typeof(arguments[0]) === 'string') {
			for(var i = 0; i<pageAudio.length; i++) {
				if(pageAudio[i].id === arguments[0]) {
					if(pageAudio[i].audio.playState == "playFinished" | pageAudio[i].audio.position == 0) {
						// Do nothing
					} else {
						pageAudio[i].audio.stop();
					}
				}
			}
		}
	} else {
		try {
			console.log(pageAudio);
			for(var i = 0; i<pageAudio.length; i++) {
				console.log(pageAudio[i].audio.playState);
				if(pageAudio[i].audio.playState == "playFinished" | pageAudio[i].audio.position == 0) {
					// Do nothing
				} else {

					pageAudio[0].audio.stop();
				}
			}
		} catch(error) {
			console.log("pauseAudio ERROR");
		}
	}
}

function muteSpeakerAudio() {
	if(pageAudio.length > 0) {
		for(var i = 0; i<pageAudio.length; i++) {
			try {
				pageAudio[i].audio.volume = 0;
			} catch(error) {
				console.log("muteSpeakerAudio ERROR");
			}
		}
	}
}

function unmuteSpeakerAudio() {

	if(pageAudio.length > 0) {
		for(var i = 0; i<pageAudio.length; i++) {
			try {
				pageAudio[i].audio.volume = 1;
			} catch(error) {
				console.log("unmuteSpeakerAudio ERROR");
			}
		}
	}
}

function getAudioById(id) {
	for(var i = 0; i<pageAudio.length; i++) {
		if(pageAudio[i].id === id) {
			return pageAudio[i];
		}
	}
	return null;
}


// #####################
// Functions
// #####################


function highlightNext() {
	if(currentPage == (pages.length-1)) {
		if(!comingFromIntro) {
			getCurrentPage().done = true;
			getCurrentPage().completed = true;
		}
	} else {
		toggleNavigation('next',true);
		if(!comingFromIntro) {
			getCurrentPage().done = true;
			getCurrentPage().completed = true;
		}
		$('#btn-next').addClass("highlight");
	}
}

function setPlayPause(str) {
	if(str == "play") {
		playPauseState = "play";
		if($('#btn-play').find('span').hasClass('glyphicon-pause')) {
			$('#btn-play').find('span').removeClass('glyphicon-pause');
			$('#btn-play').find('span').addClass('glyphicon-play');
		}
	} else {
		playPauseState = "pause";
		if($('#btn-play').find('span').hasClass('glyphicon-play')) {
			$('#btn-play').find('span').removeClass('glyphicon-play');
			$('#btn-play').find('span').addClass('glyphicon-pause');
		}
	}
}

function getPlayPauseState() {
	if($('#btn-play').find('span').hasClass('glyphicon-play')) {
		return "play";
	} else {
		return "pause";
	}
	return "play";
}


function toggleMute(boo) {
	if(boo) {
		if($("#btn-mute").length) $('#btn-mute').prop('disabled',false);
	} else {
		if($("#btn-mute").length) $('#btn-mute').prop('disabled',true);
	}
}


function isMuted() {
	if($("#btn-mute").length) {
		if($('#btn-mute').find('span').hasClass('glyphicon-volume-up')) {
			return false;
		} else {
			return true;
		}
		return false;
	} else {
		return false;
	}
}

function setMute(mute) {
	if($("#btn-mute").length) {
		if(mute) {
			if($('#btn-mute').find('span').hasClass('glyphicon-volume-up')) {
				$('#btn-mute').find('span').removeClass('glyphicon-volume-up');
				$('#btn-mute').find('span').addClass('glyphicon-volume-off');
			}
		} else {
			if($('#btn-mute').find('span').hasClass('glyphicon-volume-off')) {
				$('#btn-mute').find('span').removeClass('glyphicon-volume-off');
				$('#btn-mute').find('span').addClass('glyphicon-volume-up');
			}
		}
	}
}


function changeSpeakertext(str) {
	pages[currentPage].text = str;
	if(jspanel != undefined) {
		jspanel.content.empty();
		jspanel.content.append(str);
	}
}


// Opens the floating speakertext panel
function openSpeakertext() {
	var _txt = pages[currentPage].text;
	speakertextIsOpen = true;

	if(jspanel == undefined) {
		createJSPanel(_txt);
	} else {
		createJSPanel(_txt);
		if(parseInt(jspY) < -5) {
			jspY = '10px';
		}
		if(parseInt(jspX) < -5) {
			jspX = '10px';
		}
		jspanel.resize(jspW,jspH).reposition('left-top ' + jspX + " " + jspY);
	}
}

function saveJSPanelPositionAndSize() {
	if($('#speaker-panel').length > 0) {
		jspX = $('#speaker-panel').css("left");
		jspY = $('#speaker-panel').css("top");
		jspW = $('#speaker-panel').css("width");
		jspH = $('#speaker-panel').css("height");

		//console.log("Saving... " + jspX + ", " + jspY + ", " + jspW + ", " + jspH);
	} else {
		console.log("Not saving");
	}
}


function createJSPanel(_txt) {

	if(_txt.length < 1) {
		_txt = '<i>'+lang(jsonLanguage.speakertext.notext)+'</i>';
	}

	jspanel = $.jsPanel({
		id: "speaker-panel",
	    container:   $("#spokentext"),
		contentOverflow: 'auto',
	    position:    {
	        of: '.progress',
			offsetX: -30,
			offsetY: 286,
			fixed: 'true',
			autoposition: false
	    },
	    headerTitle: lang(jsonLanguage.speakertext.headline),
		headerControls: { controls: 'closeonly' },
	    theme:       "#ffb900",
		contentSize: {width: 300, height: 350},
	    content:     _txt,
	    callback:    function () {
	        this.content.css("padding", "10px");
			initPopovers();
	    },
		onclosed: function(){
			speakertextIsOpen = false;

		},
		onbeforeclose: function() {
			saveJSPanelPositionAndSize();
		}
	});
}

function initPopovers() {

	$('[data-type="glossary"]').each(function() {
		$(this).attr("data-trigger","focus");
		$(this).addClass("glossary-link");
	});

	$('[data-toggle="popover"]').popover({
		html:true,
		template:'<div class="popover" style="max-width:480px" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content" style="font-size:13px"></div></div>',
		placement:'auto'
	});

	$('[data-type="glossary"]').each(function() {
		for(var i = 0; i<jsonGlossary.length; i++) {
			try {
				if(jsonGlossary[i].title.toLowerCase() == $(this).attr("data-original-title").toLowerCase()) {
					$(this).attr("data-content",jsonGlossary[i].content);
				}
			} catch(err) {
				console.log(err);
			}
		}
	});
}

function printPage() {
	window.print();
}

/* Added @ 20.01.2020 */

function openSpeakertextVideo(url,title,options) {
	console.log("Open Speakertext Video: " + title + ", " + url);

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

	//var _path = window.parent.contentPath + window.parent.getCurrentPath() + "/" + url;
	var _path = url;
	var _videotag = '<div class="bootbox-video"><video style="display:block; margin:0 auto; background-color:white; max-height:450px; max-width:100%" autoplay="autoplay" preload="auto"'+loop+controls+'src="'+_path+'"></video></div>';
	var _title;

	if(title.length > 1) {
		_title = title;
	} else {
		_title = false;
	}

	bootbox.dialog({
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
