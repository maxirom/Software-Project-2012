/**
 * @author Pia
 */

//defining a custom grammar is not possible yet
//document.body.innerHTML += '<div id="gVContainer" class="popup" ><input id="googleVoice" type="text" x-webkit-grammar="grammar.grxml" onwebkitspeechchange="onChange(this.value)" x-webkit-speech /></div>';

var gvContainer = document.createElement('div');
gvContainer.id = "gvContainer";
gvContainer.setAttribute('class', 'popup');
var googleVoice = document.createElement('input');
googleVoice.id = "googleVoice";
googleVoice.type = "text";
googleVoice.onwebkitspeechchange = function() {
    onChange();
};
googleVoice.setAttribute('x-webkit-speech', 'x-webkit-speech');
var closeButton = document.createElement('button');
closeButton.id = 'closeButton';
var buttonText = document.createTextNode('Close');
closeButton.appendChild(buttonText);
closeButton.onclick = function() {
    makeInvisible();
};
gvContainer.appendChild(closeButton);
gvContainer.appendChild(googleVoice);
document.body.appendChild(gvContainer);

var images = document.getElementsByTagName('img');
for(var i = 0; i < images.length; i++) {
    images[i].addEventListener("click", makeVisible, false);
};

var lockScreen = document.createElement('div');
lockScreen.id = 'lockScreen';
document.body.appendChild(lockScreen);

function makeVisible() {
    gvContainer.style.visibility = 'visible';
}

function makeInvisible() {
    gvContainer.style.visibility = 'hidden';
    gvContainer.value = '';
}

function onChange() {
    //process what user said with js-chartparser
    var val = event.target.value;
    alert("values = " + val);
    val.toLowerCase();
    results = runParser(val.split(/\s+/));
    dialogueManager(results, val);
    makeInvisible();
}

function dialogueManager(results, val) {
    //process the results of the js-chartparser as an array
    if(parseInt(results[0]) == 0) {
        //generate an output string for the MaryTTS
        var str = '';
        var valArray = val.split(/\s+/);
        for(var i = 0; i < valArray.length; i++) {
            if(i == valArray.length - 1) {
                str += valArray[i];
            } else {
                str += valArray[i] + "+";
            }
        };
        negativeOutput(str);
        makeVisible();
    }

    if(parseInt(results[0]) >= 1) {
        n = parseInt(results[0])
        for(var i = 0; i < n; i++) {
            alert(results[i + 1])
        };
    }
}

function negativeOutput(userInput) {
    
    
    //var url = "http://mary.dfki.de:59125/"; //not dfki dependent
    var url = 'http://134.96.189.12:59125/';
    //dfki dependent
    var output = "I'm%20sorry%2C%20I%20could%20not%20understand%20what%20%22" + userInput + "%22%20is%20supposed%20to%20mean.%20Please%20rephrase%20your%20command."
    var maryString = "process?INPUT_TYPE=TEXT&OUTPUT_TYPE=AUDIO&INPUT_TEXT=" + output + "&OUTPUT_TEXT=&effect_Volume_selected=&effect_Volume_parameters=amount%3A2.0%3B&effect_Volume_default=Default&effect_Volume_help=Help&effect_TractScaler_selected=&effect_TractScaler_parameters=amount%3A1.5%3B&effect_TractScaler_default=Default&effect_TractScaler_help=Help&effect_F0Scale_selected=&effect_F0Scale_parameters=f0Scale%3A2.0%3B&effect_F0Scale_default=Default&effect_F0Scale_help=Help&effect_F0Add_selected=&effect_F0Add_parameters=f0Add%3A50.0%3B&effect_F0Add_default=Default&effect_F0Add_help=Help&effect_Rate_selected=&effect_Rate_parameters=durScale%3A1.5%3B&effect_Rate_default=Default&effect_Rate_help=Help&effect_Robot_selected=&effect_Robot_parameters=amount%3A100.0%3B&effect_Robot_default=Default&effect_Robot_help=Help&effect_Whisper_selected=&effect_Whisper_parameters=amount%3A100.0%3B&effect_Whisper_default=Default&effect_Whisper_help=Help&effect_Stadium_selected=&effect_Stadium_parameters=amount%3A100.0&effect_Stadium_default=Default&effect_Stadium_help=Help&effect_Chorus_selected=&effect_Chorus_parameters=delay1%3A466%3Bamp1%3A0.54%3Bdelay2%3A600%3Bamp2%3A-0.10%3Bdelay3%3A250%3Bamp3%3A0.30&effect_Chorus_default=Default&effect_Chorus_help=Help&effect_FIRFilter_selected=&effect_FIRFilter_parameters=type%3A3%3Bfc1%3A500.0%3Bfc2%3A2000.0&effect_FIRFilter_default=Default&effect_FIRFilter_help=Help&effect_JetPilot_selected=&effect_JetPilot_parameters=&effect_JetPilot_default=Default&effect_JetPilot_help=Help&HELP_TEXT=&exampleTexts=I'm%20Spike.&VOICE_SELECTIONS=dfki-spike%20en_GB%20male%20unitselection%20general&AUDIO_OUT=WAVE_FILE&LOCALE=en_GB&VOICE=dfki-spike&AUDIO=WAVE_FILE";

    var testAudio = document.createElement('audio');
    var testSource = document.createElement('source');
    testAudio.appendChild(testSource);
    testAudio.id = "testAudio";
    testAudio.autoplay = "autoplay";
    testSource.src = url + maryString;
    testAudio.addEventListener('loadstart', lockScreen, false);
    testAudio.addEventListener('ended', destroyAudio, false);
    document.body.appendChild(testAudio);
    //document.body.removeChild(testAudio);
    /**
     $.ajax({
     url : url + maryString,
     type : "GET",
     dataType : 'jsonp audio/x-wav',
     statusCode : {
     404 : function() {
     alert("page not found");
     },
     200 : function() {
     alert("success");
     }
     },
     cache : false,
     error : function() {
     resultValue = false;
     },
     success : function(data) {
     console.log('success:', data);
     //--> balblal
     resultValue = data;
     },
     complete : function(textStatus) {
     alert("status of completion: " + textStatus)
     }
     });
     **/
    /**
     $.get(url+maryString, function(data) {
     $('.result').html(data);
     alert('Load was performed.');
     }, 'jsonp audio/x-wav');
     **/
}

function destroyAudio() {
    lockScreen.style.visibility = 'hidden';
    var audioElements = $('audio');
    for(var i = 0; i < audioElements.length; i++) {
        audioElements[i].parentElement.removeChild(audioElements[i]);
    };

    function lockScreen() {
        alert('screen will be locked');
        lockScreen.style.visibility = 'visible';
    }

}
