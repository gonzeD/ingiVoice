$.memoire.recognition = {};
$.memoire.recognition.init = function(testing,prefixResult,params)
{

	var recognizer, recorder, callbackManager, audioContext;
	var isRecorderReady = isRecognizerReady = false;
	var callbackResult;
	var eventsOnReady = [];
	var eventsOnEnd = [];
	var audio = null;

	$.memoire.recognition.start = function(callbackResultT)
	{
		stopRecording();
		killAll();
		callbackResult = callbackResultT;
		startRecording();
	}


	function saveTextAsFile(textToWrite,fileName)
	{
	    var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
	    var fileNameToSaveAs = fileName;
      var downloadLink = document.createElement("a");
	    downloadLink.download = fileNameToSaveAs;
	    downloadLink.innerHTML = "Download File";
	    if (window.webkitURL != null)
	    {
	        // Chrome allows the link to be clicked
	        // without actually adding it to the DOM.
	        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
	    }
	    else
	    {
	        // Firefox requires the link to be added to the DOM
	        // before it can be clicked.
	        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
	        downloadLink.onclick = destroyClickedElement;
	        downloadLink.style.display = "none";
	        document.body.appendChild(downloadLink);
	    }

	    downloadLink.click();
	}


	$.memoire.recognition.stop = function()
	{
		console.log("stopping");
		stopRecording();
		killAll();

		if(testing !==null)
		{
			var inputEnd = $("textarea").val();
			console.log(inputEnd)
			saveTextAsFile(inputEnd,prefixResult+testing+".txt");
		}
	}

	$.memoire.recognition.onReady = function(event)
	{
		if(isRecognizerReady)event();
		else eventsOnReady.push(event);
	}

	$.memoire.recognition.onEnd = function(event)
	{
		eventsOnEnd.push(event);
	}

	$.memoire.recognition.restart = function(mode)
	{
		var temp = callbackResult;
		callbackResult = null;
		stopRecording();
		callbackResult = temp;
		if(mode == "structuring")
		{
			initRecognizerMode("structuring");
		}
		else if(mode == "naming")
		{
			initRecognizerMode("naming");
		}
		startRecording();
	}

	function killAll()
	{
		eventsOnEnd.forEach(x => x());
		callbackResult = null;
	}

	function updateStatus(mes)
	{
		console.log(mes);
	}

	function postRecognizerJob(message, callback)
	{
		var msg = message || {};
		if (callbackManager) msg.callbackId = callbackManager.add(callback);
		if (recognizer) recognizer.postMessage(msg);
	};



	function spawnWorker(workerURL, onReady)
	{
		recognizer = new Worker(workerURL);
		recognizer.onmessage = function(event)
		{
			onReady(recognizer);
		};
		recognizer.postMessage({'pocketsphinx.wasm': 'pocketsphinx.wasm', 'pocketsphinx.js': 'pocketsphinx.js'});
	};


	function updateHyp(hyp)
	{
		if(callbackResult)
			callbackResult(hyp);
	};


	function startUserMedia(stream)
	{
		var input = audioContext.createMediaStreamSource(stream);
		window.firefox_audio_hack = input; // Firefox hack https://support.mozilla.org/en-US/questions/984179
		var audioRecorderConfig = {errorCallback: function(x) {console.log("Error from recorder: ",x);},worker:"/dist/js/pocketSphinx/audioRecorderWorker.js"};
		recorder = new AudioRecorder(input, audioRecorderConfig);
		if (recognizer) recorder.consumers = [recognizer];
		isRecorderReady = true;
	};


	function startRecording()
	{
		console.log("ok");
		if(testing !== null)
			audio.play();
		if (recorder && recorder.start(0))console.log("mmm")
	};

	function stopRecording()
	{
		recorder && recorder.stop();
	};



	function recognizerReady()
	{
		if(isRecognizerReady == true)return;
		isRecognizerReady = true;

		console.log("recognizer ready");
		eventsOnReady.forEach(x=>x())
	};


	function initRecognizer()
	{
		initRecognizerMode("structuring");
	};


	function initRecognizerMode(mode)
	{
		console.log(mode);
		var p =  [["-jsgf","/noOrder.jsgf"],["-dict","/base.dict"]

	];
		//,["-beam","0.000001"],["-lpbeam","0.000001"],["-lponlybeam","0.000001"],["-pbeam","0.000001"],["-wbeam","0.000001"],["-kws_threshold","1e-20"],["-ds","1"],["-agc","emax"],["-topn","8"],["-maxhmmpf","300000"],
//	["-agcthresh","1e10"],["-kws_delay","100"]];
		/*if(params == 0)p =  [["-jsgf","/simplified.jsgf"],["-dict","/base.dict"]];
		else
		{
			var m = params;
			var kwsThresh = "1e-"+(m%10);
			m %=10;
			var agc = ['max', 'emax', 'noise', 'none']
			agc = agc[m%4];
			m%=4;
			var agcThresh = m%10
			m%=10;
			if(m%2 == 1)agcThresh = "1e"+agcThresh;


			var beam = (m%100)/100.0;
			m%=100;

			var lpbeam = (m%100)/100.0;
			m%=100;
			var lponlybeam = (m%100)/100.0;
			m%=100;
			var pbeam = (m%100)/100.0;
			m%=100;
			var wbeam = (m%100)/100.0;
			m%=100;


			var ds = m%10
			m%=10;
			var kws_delay = m%10
			m%=10;
			var plWindow = m%10
			m%=10;
			var topn = m%10
			m%=10;
			var maxhmmpf = m%10
			m%=10;
			var maxwpf = m%10
			m%=10;



			p =  [["-jsgf","/noOrder.jsgf"],["-dict","/base.dict"],["-agc",agc],["-agcThresh",agcThresh],["-beam",beam],
["-ds",ds],["-kws_delay",kwsDelay],["-kws_threshold",kwsThreash],["-lpbeam",lpbeam],["-lponlybeam",lponlybeam],["-pbeam",pbeam],["-pl_window",plWindow],["-wbeam",wbeam],["-topn",topn],["-maxwpf",maxwpf],["-maxhmmpf",maxhmmpf],
		];

	}*/
		if(mode == "structuring")
			postRecognizerJob({command: 'initialize',data :p},
			function()
			{
				if (recorder) recorder.consumers = [recognizer];
			});
		else
			postRecognizerJob({command: 'initialize',data : [["-jsgf","/2kWords.jsgf"],["-dict","/2kWords.dict"],["-kws_threshold","1e-3"],["-remove_noise","yes"]]},
			function() {
				if (recorder) recorder.consumers = [recognizer];
			});
	}


	function start()
	{
		updateStatus("Initializing web audio and speech recognizer, waiting for approval to access the microphone");
		callbackManager = new CallbackManager();
		spawnWorker("/dist/js/pocketSphinx/recognizer.js", function(worker)
		{
			// This is the onmessage function, once the worker is fully loaded
			worker.onmessage = function(e)
			{
				console.log(e);
				// This is the case when we have a callback id to be called
				if (e.data.hasOwnProperty('id'))
				{
					var clb = callbackManager.get(e.data['id']);
					var data = {};
					if ( e.data.hasOwnProperty('data')) data = e.data.data;
					if(clb) clb(data);
				}
				// This is a case when the recognizer has a new hypothesis
				if (e.data.hasOwnProperty('hyp') && !e.data.hasOwnProperty("final"))
					updateHyp(e.data.hyp);
					// This is the case when we have an error
				if (e.data.hasOwnProperty('status') && (e.data.status == "error"))
					console.log("error",e.data.command,e.data.code);
				if (e.data.hasOwnProperty('status') && (e.data.status == "done") && e.data.hasOwnProperty('command') && (e.data.command == "initialize"))
					recognizerReady();
			};

			postRecognizerJob({command: 'lazyLoad',
				data: {folders: [["/", "am"]], files: [
				["/","noOrder.jsgf","../../../grammar/noOrder.jsgf"],
				["/","simplified.jsgf","../../../grammar/simplified.jsgf"],
				["/","base.jsgf","../../../grammar/base.jsgf"],
				["/","base.dict","../../../dict/base.dict"],
				["/","2kWords.dict","../../../dict/2kWords.dict"],
				["/","2kWords.jsgf","../../../grammar/2kWords.jsgf"],
				["/am", "means", "../../../am/means"],
				["/am", "variances", "../../../am/variances"],
				["/am", "transition_matrices", "../../../am/transition_matrices"],
				["/am", "sendump", "../../../am/sendump"],
				["/am", "mdef", "../../../am/mdef"],
				["/am", "feat.params", "../../../am/feat.params"],
				["/am", "mixture_weights", "../../../am/mixture_weights"],
				["/am", "noisedict", "../../../am/noisedict"]
				]}
			}, initRecognizer);
		});

		// The following is to initialize Web Audio
		try
		{
			window.AudioContext = window.AudioContext || window.webkitAudioContext;
			window.URL = window.URL || window.webkitURL;
			audioContext = new AudioContext();
		}
		catch (e)
		{
			updateStatus("Error initializing Web Audio browser");
		}

		if(testing !==null)
		{
			audio = new Audio("/tests/"+testing+".mp3");


			audio.oncanplay  = () =>
			{
				const stream = audio.captureStream();
				startUserMedia(stream);
			}
		}
		else if (navigator.mediaDevices.getUserMedia)
		{
		   navigator.mediaDevices.getUserMedia({audio: true}).then(startUserMedia).catch(function(e) {
			   console.log(e);
			   updateStatus("No live audio input in this browser");
		   });
		}
		else updateStatus("No web audio support in this browser");
	};
	start();
}
