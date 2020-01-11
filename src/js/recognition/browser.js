$.memoire.recognition = {};
$.memoire.recognition.init = function(testing,prefixResult,params) {



    var SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
    var SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;
    var SpeechRecognitionEvent = window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;



    var recognition = new SpeechRecognition();
    var callbackResult = null
//recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;


recognition.onresult = function(event) {
  callbackResult(event.results[0][0].transcript);
}

recognition.onspeechend = function() {
  recognition.stop();
}

recognition.onnomatch = function(event) {
  console.log("I didn't recognise that color.");
}

recognition.onerror = function(event) {
  console.log('Error occurred in recognition: ' + event.error);
}


$.memoire.recognition.start = function(callbackResultT)
{

  callbackResult = callbackResultT;
  recognition.start();
}

$.memoire.recognition.stop = function()
{

}

$.memoire.recognition.onReady = function(event)
{
  event();
}

$.memoire.recognition.onEnd = function(event)
{
}

$.memoire.recognition.restart = function(mode)
{
}

    return this;
};
