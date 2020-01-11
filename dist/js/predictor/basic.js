$.memoire.predictor = {};
$.memoire.predictor.init = function(elements) {
    // All the specific symbol
    var wordMapping = {
        "interrogation": "?",
        "two point":":",
        "2 point":":",
        "point": ".",
        "comma": ",",
        "smaller than": "<",
        "bigger than": ">",
        "smaller or equal than": "<=",
        "bigger or equal than": ">=",
        "left shift": "<<",
        "right shift": ">>",
        "binary and": "&",
        "binary or": "|",
        "binary not": "~",
        "binary xor": "^",
        "equals":"=",
        "minus":"-",
        "plus":"+",
        "multiply":"*",
        "divide": "/",
        "slash": "/",
        "backslash":"\\",
        "define":"def",
        "parenthesis":"()"
    };

    // Reserved python keywords
    /*var keywords = [
        "False",
        "class",
        "finally",
        "is",
        "return",
        "None",
        "continue",
        "for",
        "lambda",
        "try",
        "True",
        "def",
        "from",
        "nonlocal",
        "while",
        "and",
        "del",
        "global",
        "not",
        "with",
        "as",
        "elif",
        "if",
        "or",
        "yield",
        "assert",
        "else",
        "import",
        "pass",
        "break",
        "except",
        "in",
        "raise"
    ];
            */

             /*
   elements.each(function() {
       this.possibleWords = findNewKeywords($(this).val());

        var debugDiv = $("#"+$(this).data("debug"));
        var debugButton = $("#"+$(this).data("button"));
        var debugText = $("#"+$(this).data("input-text"));
        var textArea = $(this);

        debugButton.on("click",function(){
            var value = debugText.val();
            console.log(possibleWords);

            var candidate = null;
            if(isNaN(value))candidate = findClosestMatch(value,possibleWords);

            if(candidate == null)textArea.val(textArea.val()+value+" ");
            else if(wordMapping[candidate] != undefined)textArea.val(textArea.val()+wordMapping[candidate]+" ");
            else textArea.val(textArea.val()+candidate+" ");

        });

        $(this).on("input",function(){
            possibleWords = findNewKeywords($(this).val());
            debugDiv.html(Array.from(possibleWords).join('<br/>'));


        });


    });*/




    $.memoire.predictor.inputText = function(text)
    {
        elements.each(function()
        {
            if($(this).is(":focus"))
            {
                var words = [text]//.split(" ");

                var possibleWords = findNewKeywords($(this).val());
                var textArea = $(this);

                for(i = 0;i<words.length;i++)
                {
                    value = words[i];
                    console.log(value);

                    var candidate = null;
                    if(isNaN(value))candidate = findClosestMatch(value,possibleWords);

                    if(candidate == null)textArea.val(textArea.val()+value+" ");
                    else if(wordMapping[candidate] != undefined)textArea.val(textArea.val()+wordMapping[candidate]+" ");
                    else textArea.val(textArea.val()+candidate+" ");
                }
            }
        })
    }

    // Check if there is no new keywords to add in the existing set.
    function findNewKeywords(text)
    {
        existing = new Set(keywords.concat(Object.keys(wordMapping)));
        text.replace(/[^a-z0-9]/gmi, " ").replace(/\s+/g, " ");
        words = text.split(/[ ]+/);
        for(var i = 0;i<words.length;i++)
        {
            if( ! existing.has(words[i]) && words[i] != " " && words[i] != '')
            {
                existing.add(words[i]);
            }
        }
        return existing;
    }


    // Find the closest match of the word in the existing array. if no word is matching, return null
    function findClosestMatch(word, existing)
    {
        var results = [];

        existing.forEach(function(key){
            results.push([key, getEditDistance(word,key)]);
        });

        results.sort(function(a,b) {
            return a[1]>b[1]? 1:a[1]<b[1]?-1:0;
        });

        console.log(results);
        if(results[0][1]>3)return null;
        return results[0][0];
    }


    // Calculate the levenshtein distance
    function getEditDistance(a, b){
        if(a.length == 0) return b.length;
        if(b.length == 0) return a.length;

        var matrix = [];

        var i;
        for(i = 0; i <= b.length; i++){
            matrix[i] = [i];
        }

        var j;
        for(j = 0; j <= a.length; j++){
            matrix[0][j] = j;
        }

        for(i = 1; i <= b.length; i++){
            for(j = 1; j <= a.length; j++){
                if(b.charAt(i-1) == a.charAt(j-1)){
                    matrix[i][j] = matrix[i-1][j-1];
                } else {
                    matrix[i][j] = Math.min(matrix[i-1][j-1] + 1,
                                    Math.min(matrix[i][j-1] + 1,
                                    matrix[i-1][j] + 1));
                }
            }
        }
        return matrix[b.length][a.length];
    }


    return this;
};
