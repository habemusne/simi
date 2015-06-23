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
    jsPsych.text = (function() {

        var plugin = {};

        plugin.create = function(params) {

            params = jsPsych.pluginAPI.enforceArray(params, ['text','cont_key']);

            var trials = new Array(params.text.length);
            for (var i = 0; i < trials.length; i++) {
                trials[i] = {};
                trials[i].text = params.text[i]; // text of all trials
                //trials[i].cont_key = params.cont_key || []; // keycode to press to advance screen, default is all keys.
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

                display_element.html(''); // clear the display

                save_data(info.key, info.rt);

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


            // add Continue button
            display_element.append($('<button>', {
                'id': 'jspsych-survey-text-next',
                'class': 'jspsych-survey-text'
            }));
            $("#jspsych-survey-text-next").html('Continue');
            $("#jspsych-survey-text-next").click(function() {
                // measure response time
                var endTime = (new Date()).getTime();
                var response_time = endTime - startTime;
                jsPsych.data.write({
                    "rt": response_time
                //"responses": JSON.stringify(question_data)
                });
                display_element.html('');
                //save_data(info.rt);
                // next trial
                jsPsych.finishTrial(); 
            });
            var startTime = (new Date()).getTime();





            function save_data(key, rt) {
                jsPsych.data.write({
                    "rt": rt,
                    "key_press": key
                });
                
            }
            
        };

        return plugin;
    })();
})(jQuery);
