

//var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
//var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
//var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;


(function( $ ) {
    $.memoire = {};
    $.fn.memoire = function() {
        elements = this;
        $.getScript("/dist/js/inputManager/basic.js").done(function() {
		            $.getScript("/dist/js/recognition/sphinx.js").done(function() {
		                $.getScript("/dist/js/warning/inginious.js").done(function() {
		                    $.memoire.recognition.init("3/3","test04-",0);
		                    elements.each((i,x) => $.memoire.inputManager.init(i,x))
				});
            });
        });



        return this;
    };
}( jQuery ));
