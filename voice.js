/**
 * @author Group 2
 */

//defining a custom grammar is not possible yet
//document.body.innerHTML += '<div id="gVContainer" class="popup" ><input id="googleVoice" type="text" x-webkit-grammar="grammar.grxml" onwebkitspeechchange="onChange(this.value)" x-webkit-speech /></div>';

//this is the div for googleVoice
var gvContainer = document.createElement('div');
gvContainer.id = "gvContainer";
gvContainer.setAttribute('class', 'popup');
var googleVoice = document.createElement('input');
googleVoice.id = "googleVoice";
googleVoice.type = "text";
googleVoice.onwebkitspeechchange = function() {
    onChange();
};
googleVoice.onwebkitspeecherror = function() {
    speekOutput('Sorry there was an unexpected error', 'error');
    alert('error');
};
googleVoice.setAttribute('x-webkit-speech', 'x-webkit-speech');
var closeButton = document.createElement('button');
closeButton.id = 'closeButton';
var buttonText = document.createTextNode('Close');
closeButton.appendChild(buttonText);
closeButton.onclick = function() {
    makeInvisible();
    clickCounter = 0;
};
gvContainer.appendChild(closeButton);
gvContainer.appendChild(googleVoice);
document.body.appendChild(gvContainer);

//this appends the Spoken Interaction Functionaloty to all img elements in the page
var images = document.getElementsByTagName('img');
for(var i = 0; i < images.length; i++) {
    images[i].addEventListener("click", makeVisible, false);
};

//this should lock the screen during spoken output
var lockScreen = document.createElement('div');
lockScreen.id = 'lockScreen';
document.body.appendChild(lockScreen);

//this is the Spoken Output element
var spokenOutput = document.createElement('audio');
document.body.appendChild(spokenOutput);
spokenOutput.setAttribute('id', 'spokenOutput');

//this stores the clicked element and the previous clicked element for the dialogue management
var prevClickedElement;
var clickedElement;
var clickCounter = 0;

function makeVisible() {
    googleVoice.value = '';
    gvContainer.style.visibility = 'visible';
}

function makeInvisible() {
    gvContainer.style.visibility = 'hidden';
    googleVoice.value = '';
}

function onChange() {
    //this function processes what the user said with js-chartparser
    if(typeof(prevClickedElement) !== 'undefined'){
        prevClickedElement = clickedElement;
        clickedElement = event.target;
    }else{
        prevClickedElement = event.target;
    }
    
    var val = event.target.value;
    alert("you said:" + val);
    makeInvisible();
    val.toLowerCase();
    results = runParser(val.split(/\s+/));
    dialogueManager(results, val);
}

function dialogueManager(results, val) {
    //this function imitates a dialogue manager and handles diverse errors or unparseable user input
    if(parseInt(results[0]) == 0) {
        
        if(clickedElement == prevClickedElement && clickCounter >= 3){
            alert('This was wrong too many times');
        } else {
        clickCounter += 1;
        clickedElement = prevClickedElement;
        speekOutput(val, 'unparseable');
        makeVisible();
        }
        
    }

    if(parseInt(results[0]) >= 1) {
        n = parseInt(results[0])
        for(var i = 0; i < n; i++) {
            alert("result "+i+": "+results[i]);
        };
        clickCounter = 0;
    }
}

function speekOutput(customMessage, status) {
    //this function manages the spoken Output "I'm sorry I don't understand what ... is supposed to mean. Please rephrase your command"
    var url = "http://mary.dfki.de:59125/";
    //not dfki dependent
    //var url = 'http://134.96.189.12:59125/'; //dfki dependent

    //generate an output string for the MaryTTS
    var str = '';
    var messageArray = customMessage.split(/\s+/);
    for(var i = 0; i < messageArray.length; i++) {
        if(i == messageArray.length - 1) {
            str += messageArray[i];
        } else {
            str += messageArray[i] + "+";
        }
    };
 
    var output = "";

    if(status == 'unparseable') {
        output += "I'm%20sorry%2C%20I%20could%20not%20understand%20what%20%22" + str + "%22%20is%20supposed%20to%20mean.%20Please%20rephrase%20your%20command.";
    }
    if(status == 'error') {
        output += str;
    }
    
    var maryString = "process?INPUT_TYPE=TEXT&OUTPUT_TYPE=AUDIO&INPUT_TEXT=" + output + "&OUTPUT_TEXT=&effect_Volume_selected=&effect_Volume_parameters=amount%3A2.0%3B&effect_Volume_default=Default&effect_Volume_help=Help&effect_TractScaler_selected=&effect_TractScaler_parameters=amount%3A1.5%3B&effect_TractScaler_default=Default&effect_TractScaler_help=Help&effect_F0Scale_selected=&effect_F0Scale_parameters=f0Scale%3A2.0%3B&effect_F0Scale_default=Default&effect_F0Scale_help=Help&effect_F0Add_selected=&effect_F0Add_parameters=f0Add%3A50.0%3B&effect_F0Add_default=Default&effect_F0Add_help=Help&effect_Rate_selected=&effect_Rate_parameters=durScale%3A1.5%3B&effect_Rate_default=Default&effect_Rate_help=Help&effect_Robot_selected=&effect_Robot_parameters=amount%3A100.0%3B&effect_Robot_default=Default&effect_Robot_help=Help&effect_Whisper_selected=&effect_Whisper_parameters=amount%3A100.0%3B&effect_Whisper_default=Default&effect_Whisper_help=Help&effect_Stadium_selected=&effect_Stadium_parameters=amount%3A100.0&effect_Stadium_default=Default&effect_Stadium_help=Help&effect_Chorus_selected=&effect_Chorus_parameters=delay1%3A466%3Bamp1%3A0.54%3Bdelay2%3A600%3Bamp2%3A-0.10%3Bdelay3%3A250%3Bamp3%3A0.30&effect_Chorus_default=Default&effect_Chorus_help=Help&effect_FIRFilter_selected=&effect_FIRFilter_parameters=type%3A3%3Bfc1%3A500.0%3Bfc2%3A2000.0&effect_FIRFilter_default=Default&effect_FIRFilter_help=Help&effect_JetPilot_selected=&effect_JetPilot_parameters=&effect_JetPilot_default=Default&effect_JetPilot_help=Help&HELP_TEXT=&exampleTexts=I'm%20Spike.&VOICE_SELECTIONS=dfki-spike%20en_GB%20male%20unitselection%20general&AUDIO_OUT=WAVE_FILE&LOCALE=en_GB&VOICE=dfki-spike&AUDIO=WAVE_FILE";

    $.ajax({
        url : url + maryString,
        type : "GET",
        dataType : 'jsonp audio/x-wav',
        statusCode : {
            404 : function() {
                alert("I am sorry, I did not understand you! Please rephrase your command!");
            },
            200 : function() {
                spokenOutput.setAttribute('src', url + maryString);
                spokenOutput.play();
            }
        },
        cache : false,
    });
}

function lockScreen() {
    alert('screen will be locked');
    lockScreen.style.visibility = 'visible';
}
