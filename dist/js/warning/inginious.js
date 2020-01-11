$.memoire.warning = {};
$.memoire.warning.check = function(callbackAccept,callbackRefuse)
{
    //https://www.w3schools.com/js/js_cookies.asp
    
    function setCookie(cname, cvalue) {
        var d = new Date();
        d.setTime(d.getTime() + (365*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
    
    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }   
        return "";
    }
    
    
    function checkCookie() {
        return getCookie("memoire") != "";
    }
    
    function closePanel()
    {
        node.remove();
    }

    if(checkCookie())
    {
        callbackAccept();
    }
    else
    {
        var node = document.createElement("div");
        node.classList.add("memoireWarning-container");
        
        var panel = document.createElement("div");
        panel.classList.add("memoireWarning-panel")
        
        panel.insertAdjacentHTML("afterbegin","<h1>Reconnaissance vocale de code python</h1>"+
            "Bonjour a toi ! Dans le cadre de mon mémoire, je dévelope un plugin de reconnaissance vocale permettant a terme de coder en python avec la voix."+
            "Le boutton que tu viens de cliquer permet de lancer cette reconnaissance vocale, mais avant de pouvoir la tester, voici une petite explication/avertissement.<br/>"+
            "<h2>Fonctionnement</h2>"+
            "La reconnaissance vocale s'effectue en deux temps : la reconnaissance de la structure du code, et puis la reconnaissance des noms de variables/fonctions.<br/>"+
            "Pour la reconnaissance de la structure du code, il suffit de dicter son code, avec tous les noms de variable/fonction remplacé par \"fonction\" ou \"variable\". Une fois que la structure est finie, un second passage s'effectue, avec chaque nom de fonction/variable qui sera remplacé avec une reconnaissance de texte générique."+
            "<h2>Mot-clés</h2>"+
            "Certains mot-clés permettent d'ajouter des caractères spéciaux ou d'effectuer des actions particulières<br/>"+
            "\"add tab\" et \"remove tab\" permettent d'ajouter/enlever une indentation en début de ligne<br/>"+
            "\"end line\" et \"end text\" permettent respectivement de terminer la ligne (et donc faire un retour a la ligne) et de terminer la reconnaissance de la structure du code<br>"+
            "\"colun\" permet d'ajouter le caractère : et multiply, divide, plus, minus, equal permettent d'ajouter les caractères correspondants"+
            "<h2>Behind the scene</h2>"+
            "La reconnaissance vocale s'effectue en local directement dans le navigateur en utilisant pocketsphinx.js, ce qui fait que la qualité de la reconnaissance est moindre qu'en utilisant un puissant serveur externe<br/>"

        );
        
        var classes = ["memoireWarning-btnOk","memoireWarning-btnAlmostOk","memoireWarning-btnNo"];
        var textes = [
            "Ok, pas de soucis pour utiliser anonymement mes données vocales",
            "Ok, mais je ne veux pas que mes données soient utilisées (je remplirai le google form... peut-etre)",
            "Je ne veux pas utiliser la reconnaissance vocale et ne pas avoir de cookies"
        ];
        var callbacks = [
            () => {setCookie("memoire","ok");closePanel();callbackAccept();},
            () => {setCookie("memoire","nope");closePanel();callbackAccept();},
            () => {closePanel();callbackRefuse();}
        ]
        
        for(var i = 0;i<3;i++)
        {
            var btn = document.createElement("button");
            btn.classList.add("memoireWarning-btn");
            btn.classList.add(classes[i]);
            btn.innerHTML = textes[i];
            btn.onclick = callbacks[i];
            panel.appendChild(btn);
        }
        
        node.appendChild(panel);        
        document.body.appendChild(node);
    }
}