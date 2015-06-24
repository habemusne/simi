/* jspsych-text.js
 * Josh de Leeuw
 *
 * This plugin displays text (including HTML formatted strings) during the experiment.
 * Use it to show instructions, provide performance feedback, etc...
 *
 * documentation: docs.jspsych.org
 *
 *
 */

(function($) {
    jsPsych.survey_new = (function() {

        var plugin = {};

        plugin.create = function(params) {

            params = jsPsych.pluginAPI.enforceArray(params, ['text','data']);//,'cont_key']);

            var trials = new Array(params.text.length);
            for (var i = 0; i < trials.length; i++) {
                trials[i] = {};
                trials[i].text = params.text[i]; // text of all trials
                //trials[i].cont_key = params.cont_key || []; // keycode to press to advance screen, default is all keys.
                trials[i].preamble= (typeof params.preamble == 'undefined' ? "" : params.preamble[j]),
                trials[i].questions = params.questions[i]
            }
            return trials;
        };

        plugin.trial = function(display_element, trial) {

            // if any trial variables are functions
            // this evaluates the function and replaces
            // it with the output of the function
            trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

            // set the HTML of the display target to replaced_text.
            display_element.html(trial.text);

            var after_response = function(info) {


                save_data(info.key, info.rt);
                display_element.html(''); // clear the display
                jsPsych.finishTrial();

            };

            var mouse_listener = function(e) {

                var rt = (new Date()).getTime() - start_time;

                display_element.unbind('click', mouse_listener);

                after_response({key: 'mouse', rt: rt});

            };

            // check if key is 'mouse'
            if (trial.cont_key == 'mouse') {
                display_element.click(mouse_listener);
                var start_time = (new Date()).getTime();
            } else {
                //jsPsych.pluginAPI.getKeyboardResponse(after_response, trial.cont_key);
            }
            function save_data(key, rt) {
                question_data = [];
                select_elements = $('.qstn-select');
                for (i = 0; i < select_elements.length; ++i){
                    question_data.push(select_elements[i].value);
                }
                jsPsych.data.write({
                    "rt": rt,
                    "key_press": key,
                    "responses": JSON.stringify(question_data)
                });
            }



            // show preamble text
            display_element.append($('<div>', {
              "id": 'jspsych-survey-likert-preamble',
              "class": 'jspsych-survey-likert-preamble'
            }));

            $('#jspsych-survey-likert-preamble').html(trial.preamble);

            // add questions
            for (var i = 0; i < trial.questions.length; i++) {
              // create div
              display_element.append($('<div>', {
                "id": 'jspsych-survey-text-' + i,
                "class": 'jspsych-survey-text-question'
              }));

              // add question text
              $("#jspsych-survey-text-" + i).append('<p class="jspsych-survey-text">' + trial.questions[i]+ '</p>' );

              // add text box
              $("#jspsych-survey-text-" + i).append('<input type="text" name="#jspsych-survey-text-response-' + i + '"></input>');
              //i = i +1;
              //$("#jspsych-survey-text-" + i).append('<p class="jspsych-survey-text">' + trial.questions[i] + '</p>');
            }
            
            // add submit button
            display_element.append($('<button>', {
              'id': 'jspsych-survey-text-next',
              'class': 'jspsych-survey-text'
            }));
            $("#jspsych-survey-text-next").html('Submit Answers');
            $("#jspsych-survey-text-next").click(function() {
              // measure response time
              var endTime = (new Date()).getTime();
              var response_time = endTime - startTime;

              // create object to hold responses
              var question_data = {};
              $("div.jspsych-survey-text-question").each(function(index) {
                var id = "Q" + index;
                var val = $(this).children('input').val();
                var obje = {};
                obje[id] = val;
                $.extend(question_data, obje);
              });

              // save data
              jsPsych.data.write({
                "rt": response_time,
                "responses": JSON.stringify(question_data)
              });

              display_element.html('');

              // next trial
              jsPsych.finishTrial();
            });
            var startTime = (new Date()).getTime();
          };
        return plugin;
    })();
})(jQuery);
