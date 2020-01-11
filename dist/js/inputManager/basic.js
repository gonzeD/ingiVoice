$.memoire.inputManager = {};
$.memoire.inputManager.init = function(id,input) {



    var mapping = [
        ["twoPoint",':'],
        ["openParenthesis","("],
        ["closeParenthesis",")"],
        ["comma",","],
        ["addTab","\t"],
        ["endLine","endL \n"]

    ];

	var keywordsReplacing = ["function","variable","class"];
	var keywordsEndingReplacing = ["end","ending","endLine","endText","finished","finish"];
    var node = document.createElement("button");
    node.classList.add("memoireBtn");

    var isRecording = false;
	var flagEnding = 0;
	var recognitionType = 0;
	var replacingIndex = 0;
	var lines = [[]];

	function toCamelCase(string){
		return string.replace(/\s+(.)/g, function (match, group) {
			return group.toUpperCase()
		})
	}

	function parseLine(words)
	{
		//mapping.forEach((a) => {words = words.replace(a[0],a[1])});
		var array = words.split(" ");

		for(var i = 0;i<array.length;i++)
		{
			var w = array[i];
			if(w == "removeTab")
			{
				if(i >0 && array[i-1] == "\t")
				{
					array.splice(i-1,2);
					i-=2;
				}
			}
			else if(w == "endLine")
			{
				flagEnding = 1;
			}
			else if(w == "endText")
			{
				flagEnding = 2;
			}
		}
		return array;
	}


	function selectFirstKeyword(element, wordIndex)
	{

	}


	function replaceFirst(array, word,changeIt)
	{
		var finalArray = JSON.parse(JSON.stringify(array));
		var start = 0;
		var length = word.length
		for(var i = 0;i<array.length;i++)
		{
			for(var j = 0;j<array[i].length;j++)
			{
				var w = finalArray[i][j]
				if(keywordsReplacing.indexOf(w) > -1)
				{
					if(changeIt)finalArray[i][j] = word;
					else length = finalArray[i][j].length;
					return {arrays : finalArray,start : start,end : start+length};
				}
				start += w.length+1;
			}

		}
		return {arrays : finalArray};
	}

    $.memoire.recognition.onReady(() =>
    {
        //node.innerHTML = "start";
        node.classList.add("memoireBtn-ready");
        node.onclick = () => {
            if(isRecording)
            {
                $.memoire.recognition.stop();
            }
            else
            {
                $.memoire.warning.check( () => $.memoire.recognition.start((x) => {

					if(recognitionType == 0)
					{
	                    node.classList.add("memoireBtn-recording");
	                    isRecording = true;
						flagEnding = 0;
	                    lines[lines.length-1] = parseLine(x);
						if(flagEnding == 1)
						{
							//lines.push([]);
							//$.memoire.recognition.restart("structuring");
						}
						if(flagEnding == 2)
						{
							lines.push([]);
							$.memoire.recognition.restart("naming");
							recognitionType = 1;

						}
						input.innerHTML = lines.map(x => x.join(" ")).join("\n");
					}
					else
					{
						//input.innerHTML = lines.join("\n");
						var newVariable = toCamelCase(x);
						var temp;
						var array = x.split(" ");
						var last = array[array.length-1];
						console.log(newVariable);
						var resultReplace = replaceFirst(lines,newVariable,newVariable != "")
						console.log(last);
						if(keywordsEndingReplacing.indexOf(last)>-1)
						{
							lines = resultReplace.arrays;
							temp = lines;


							$.memoire.recognition.restart("naming");
						}
						else
						{
							temp = resultReplace.arrays;
						}


						if(resultReplace.start == undefined)
							$.memoire.recognition.stop();

						input.innerHTML = temp.map(x => x.join(" ")).join("\n");
						input.focus();
						input.setSelectionRange(resultReplace.start,resultReplace.end);
					}
                }),()=>console.log("refused"))
            }
        }



        $.memoire.recognition.onEnd(() => {
            console.log("killing");
            node.classList.remove("memoireBtn-recording");
            isRecording = false;
        })

    })


    $(input).after(node);

};
