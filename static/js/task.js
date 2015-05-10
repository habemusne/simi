/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

var SOA = 1000;
var TIMEOUT_ALERT = 3000;
var DURATION_ALERT = 3000;
var DURATION_BREAK = 60000;
var DELAY_QUERY = 500;

var NUM_FOR_DOUBLET = 3;
var NUM_FOR_TRIPLET = 4;

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

var mycondition = condition;  // these two variables are passed by the psiturk server process
var mycounterbalance = counterbalance;  // they tell you which condition you have been assigned to
// they are not used in the stroop code but may be useful to you

// All pages to be loaded
var pages = [
	"instructions/instruct-1.html",
	"instructions/instruct-2.html",
	"instructions/instruct-3.html",
	"instructions/instruct-ready.html",
	"exp1stage.html",
	"expbreak.html",
	"exp2stage.html",
	"postquestionnaire.html",
	"thanks.html"
];

psiTurk.preloadPages(pages);

var instructionPages = [ // add as a list as many pages as you like
	"instructions/instruct-1.html",
	"instructions/instruct-2.html",
	"instructions/instruct-3.html",
	"instructions/instruct-ready.html"
];

var DoubletExp = function(stims, callbackfunc) {
	var progress = 1;

	var wordon, // time word is presented
	    listening = false;
	var istimedout = false;

	// Stimuli for a basic Stroop experiment
	var numsets = stims.length;

	var timeoutvar;
	var next = function() {
		if (stims.length===0) {
			setTimeout(function(){
				finish()
			}, 1000);
			//finish();
		}
		else {
			$('#blank').show();
			$('#blank').delay(SOA).hide(0);
			stim = stims.shift();
			show_image(stim[0], stim[1]);
			wordon = new Date().getTime();
			progress = progress + 1;
			timeoutvar = setTimeout(function(){
				alertFunc(stim);
			}, SOA + TIMEOUT_ALERT + DELAY_QUERY);
			listening = true;
		}
	};

	var response_handler = function(e) {
		if (!listening) return;

		// var keyCode = e.keyCode,
		// 	response;
		var clickCode = e.target.id;
		

		switch (clickCode) {
			case 'b1': response="1"; break;
			case 'b2': response="2"; break;
			case 'b3': response="3"; break;
			case 'b4': response="4"; break;
			case 'b5': response="5"; break;
			case 'b6': response="6"; break;
			case 'b7': response="7"; break;
			default: response = ""; break;
		}
		if (response.length>0) {
			clearTimeout(timeoutvar);
			if (istimedout == true){
				istimedout = false;
			} else{
				document.getElementById('pleasant-audio').play();
			}
			listening = false;
			var rt = new Date().getTime() - wordon;

			psiTurk.recordTrialData({'phase':"Doublet",
                                     'leftimg':stim[0],
                                     'rightimg':stim[1],
                                     'response':response,
                                     'reacttime':rt}
                                   );
			remove_image();
			next();
		}
	};

	var alertFunc = function(stim){
		document.getElementById('alert-audio').play();
		$('#alert-text').show();
		stims.push(stim);
		progress = progress - 1;
		istimedout = true;
		$('#blank').show();
		d3.select("#blank").append("h3").attr("id", "slowalert-1").style("color", "red").style("text-align", "center").html("Timeout!!");
		d3.select("#blank").append("h3").attr("id", "slowalert-2").style("color", "red").style("text-align", "center").html("Respond faster!");
		$('#blank').delay(DURATION_ALERT).hide(0);
	}

	var finish = function() {
	    $("body").unbind("keydown", response_handler); // Unbind keys
	    //currentview = new ExperimentBreak(DURATION_BREAK);
	    callbackfunc();
	};

	var show_image = function(imgAlink, imgBlink) {
		d3.select("#imgcontainer")
			.append("img")
			.attr("src", imgAlink)
			.attr("id", "leftimg")
			.attr("class", "leftimg");			
		d3.select("#imgcontainer")
			.append("img")
			.attr("src", imgBlink)
			.attr("id", "rightimg")
			.attr("class", "rightimg");
		$('#query').delay(SOA + DELAY_QUERY).show();
		$('#progress').html("Progress: (" + progress + " /" + numsets + ")");
	}

	var remove_image = function() {
		d3.select("#imgcontainer").select("#leftimg").remove();
		d3.select("#imgcontainer").select("#rightimg").remove();
		$("#query").hide();
		$("#alert-text").hide();
		d3.select("#slowalert-1").remove();
		d3.select("#slowalert-2").remove();
	}

	
	// Load the exp1stage.html snippet into the body of the page
	psiTurk.showPage('exp1stage.html');

	// Register the response handler that is defined above to handle any
	// key down events.
	//$("body").focus().keydown(response_handler);
	$("#b1").click(response_handler);
	$("#b2").click(response_handler);
	$("#b3").click(response_handler);
	$("#b4").click(response_handler);
	$("#b5").click(response_handler);
	$("#b6").click(response_handler);
	$("#b7").click(response_handler);

	// Start the test
	next();
};

var TripletExp = function(stims, phase, callbackfunc) {

	var progress = 1;

	var wordon, // time word is presented
	    listening = false;
	var istimedout = false;

	// Stimuli for a basic Stroop experiment
	var numsets = stims.length;

	var timeoutvar1;
	var timeoutvar2;
	var timeoutvar3;
	var next = function() {
		if (stims.length===0) {
			setTimeout(function(){
				finish()
			}, 1000);
		}
		else {
			$('#blank').show();
			$('#blank').delay(SOA).hide(0);
			stim = stims.shift();
			show_image(stim[0], stim[1], stim[2]);
			wordon = new Date().getTime();
			progress = progress + 1;
			timeoutvar1 = setTimeout(function(){
				alertFunc(stim);
			}, SOA + TIMEOUT_ALERT);
			timeoutvar2 = setTimeout(function(){
				$("#leftimg").click(response_handler);
				$("#rightimg").click(response_handler);
				$("#leftbutton").click(response_handler);
				$("#rightbutton").click(response_handler);				
			}, SOA + DELAY_QUERY);
			listening = true;
		}
	};

	var response_handler = function(e) {
		if (!listening) return;

		// var keyCode = e.keyCode,
		// 	response;
		var clickCode = e.target.id;
		

		switch (clickCode) {
			case 'leftimg': response="L"; break;
			case 'leftbutton': response="L"; break;
			case 'rightimg': response="R"; break;
			case 'rightbutton': response="R"; break;
			default: response = ""; break;
		}
		if (response.length>0) {
			clearTimeout(timeoutvar1);
			clearTimeout(timeoutvar2);
			if (istimedout == true){
				istimedout = false;
			} else{
				document.getElementById('pleasant-audio').play();
			}
			listening = false;
			var rt = new Date().getTime() - wordon;

			psiTurk.recordTrialData({'phase':phase,
				                     'topimg': stim[0],
                                     'leftimg':stim[1],
                                     'rightimg':stim[2],
                                     'response':response,
                                     'reacttime':rt}
                                   );
			remove_image();
			next();
		}
	};

	var alertFunc = function(stim){
		document.getElementById('alert-audio').play();
		$('#alert-text').show();
		stims.push(stim);
		progress = progress - 1;
		istimedout = true;
		$('#blank').show();
		d3.select("#blank").append("h3").attr("id", "slowalert-1").style("color", "red").style("text-align", "center").html("Timeout!!");
		d3.select("#blank").append("h3").attr("id", "slowalert-2").style("color", "red").style("text-align", "center").html("Respond faster!");
		$('#blank').delay(DURATION_ALERT).hide(0);
	}

	var finish = function() {
	    $("body").unbind("keydown", response_handler); // Unbind keys
	    callbackfunc();
	};

	var show_image = function(topimglink, leftimglink, rightimglink) {
		d3.select("#topcontainer")
			.append("img")
			.attr("src", topimglink)
			.attr("id", "topimg");
		d3.select("#bottomcontainer")
			.append("div")
			.attr("id", "imgcont");
		d3.select("#bottomcontainer")
			.append("div")
			.attr("id", "buttoncont");
		d3.select("#imgcont")
			.append("img")
			.attr("src", leftimglink)
			.attr("id", "leftimg")
			.attr("class", "leftimg");
		d3.select("#imgcont")
			.append("img")
			.attr("src", rightimglink)
			.attr("id", "rightimg")
			.attr("class", "rightimg");
		d3.select("#buttoncont")
			.append("button")
			.attr("id", "leftbutton")
			.attr("class", "leftbutton btn btn-primary btn-lg");
		d3.select("#buttoncont")
			.append("button")
			.attr("id", "rightbutton")
			.attr("class", "rightbutton btn btn-primary btn-lg");
		$("#leftbutton").html("Left");
		$("#rightbutton").html("Right");

		$('#progress').html("Progress: (" + progress + " /" + numsets + ")");
	}

	var remove_image = function() {
		d3.select("#topcontainer").select("#topimg").remove();
		d3.select("#bottomcontainer").select("#imgcont").remove();
		d3.select("#bottomcontainer").select("#buttoncont").remove();
		$("#alert-text").hide();
		d3.select("#slowalert-1").remove();
		d3.select("#slowalert-2").remove();
	}

	
	// Load the exp2stage.html snippet into the body of the page
	psiTurk.showPage('exp2stage.html');

	// Register the response handler that is defined above to handle any
	// key down events.
	//$("body").focus().keydown(response_handler);

	// Start the test
	next();
};

var BasicInfo = function() {

	record_responses = function() {

		psiTurk.recordTrialData({'phase':'subjectdata', 'status':'submit'});

		$('select').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);		
		});
		$('input').each( function(i, val){
			psiTurk.recordUnstructuredData(this.id, this.value);
		});

	};

	psiTurk.showPage('subjectdata.html');
	psiTurk.recordTrialData({'phase':'subjectdata', 'status':'begin'});
	
	// $("#next").click(function () {
	//     record_responses();
	// });

};

var ExperimentBreak = function(callbackfunc, interval){
	psiTurk.showPage('expbreak.html');
	var finish = function(){
		//currentview = new Experiment2();
		callbackfunc();
	};
	var cont = function(){
		timeoutvar = setTimeout(function(){
			finish();
		}, interval);
		$("#continue").click(function(){
			finish();
		});
	};
	cont();
};

/****************
* Questionnaire *
****************/

var AfterExp = function() {

	var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	record_responses = function() {

		psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'submit'});

		$('textarea').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});
		$('input').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});
		$('select').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);		
		});

	};

	prompt_resubmit = function() {
		replaceBody(error_message);
		$("#resubmit").click(resubmit);
	};

	resubmit = function() {
		replaceBody("<h1>Trying to resubmit...</h1>");
		reprompt = setTimeout(prompt_resubmit, 10000);
		
		psiTurk.saveData({
			success: function() {
			    clearInterval(reprompt); 
                psiTurk.computeBonus('compute_bonus', function(){finish()}); 
			}, 
			error: prompt_resubmit
		});
	};

	// Load the questionnaire snippet 
	psiTurk.showPage('postquestionnaire.html');
	psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'begin'});
	
	$("#next").click(function () {
	    record_responses();
	    psiTurk.saveData({
            success: function(){
                psiTurk.computeBonus('compute_bonus', function() { 
                	psiTurk.completeHIT(); // when finished saving compute bonus, the quit
                }); 
            }, 
            error: prompt_resubmit
        });
        psiTurk.showPage('thanks.html')
	});
};

var currentview;

var prepareStims = function(arg, numimgs){
	var Flinklist = [];
	imgFolderPath = '/static/images/EclipseFace/';
	var stims = [];
	for (i = 1; i < numimgs; ++i){
		Flinklist.push(imgFolderPath + 'F' + i + '.png')
	}

	if (arg == 'triplet'){
		for (i = 0; i < Flinklist.length; ++i){
			for (j = 0; j < Flinklist.length; ++j){
				if (j == i) continue;
				for (k = 0; k < Flinklist.length; ++k){
					if (k == j || k == i) continue;
					stims.push([Flinklist[i], Flinklist[j], Flinklist[k]]);
				}
			}
		}
	} else if (arg == 'doublet'){
		for (i = 0; i < Flinklist.length; ++i){
			for (j = 0; j < Flinklist.length; ++j){
				stims.push([Flinklist[i], Flinklist[j]])
			}
		}
	}
	stims = _.shuffle(stims);
	return stims;
};

// Task object to keep track of the current phase

/*******************
 * Run Task
 ******************/
$(window).load( function(){
    psiTurk.doInstructions(
    	instructionPages, // a list of pages you want to display in sequence
    	function() {

			stims_doublet = prepareStims('doublet', NUM_FOR_DOUBLET);
			stims_triplet = prepareStims('triplet', NUM_FOR_TRIPLET);
			stims_triplet_1 = stims_triplet.slice(0, stims_triplet.length / 2);
			stims_triplet_2 = stims_triplet.slice(stims_triplet.length / 2);
			var continueToTriplet2 = function(){
				phase = 'Triplet2';
				currentview = new TripletExp(stims_triplet_2, phase, function(){
					currentview = new AfterExp();
				});
			};

			var continueToDoublet = function(){
				currentview = new DoubletExp(stims_doublet, function(){
					currentview = new ExperimentBreak(continueToTriplet2, DURATION_BREAK);
				});
			};

			var continueToTriplet1 = function(){
				phase = 'Triplet1';
			    currentview = new TripletExp(stims_triplet_1, phase, function(){
			    	currentview = new ExperimentBreak(continueToDoublet, DURATION_BREAK);
			    });
			};
	   		
    		continueToTriplet1();
    	} // what you want to do when you are done with instructions
    );
});
