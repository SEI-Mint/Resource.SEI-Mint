(function(){
/***************************************************************************************************
 ===================================================================================================
	Declarations and Definitions
 ===================================================================================================
 **************************************************************************************************/
    var URL     = "https://raw.githubusercontent.com/SEI-Mint/Resource.SEI-Mint/main/";

    var URN     = {
        "Custom" : "JS/Custom.js",
        "Menu"   : "JS/Menu.js"
    };

    var Include = {};
    var Disable = {};

/***************************************************************************************************
 ===================================================================================================
    Function [ Disable ]
 ===================================================================================================
 **************************************************************************************************/
    Disable.DeveloperTools = {};
    Disable.DeveloperTools.Event = function(e)
    {
        let Target = e || window.event;
        if(Target) {
            switch(Target.type) {
                case "keydown":
                    var Code = Target.which || Target.keyCode;
                    switch(Code){
                        case 123:
                            Target.preventDefault();
                            Target.stopPropagation();
                            break;
                        case 67:
                        case 73:
                            if(Target.shiftKey && Target.ctrlKey){
                                Target.preventDefault();
                                Target.stopPropagation();

                                alert("不要偷看我拉 >///<");
                            }
                            break;
                        default:
                            break;
                    }
                    break;
                case "contextmenu":
                    Target.preventDefault();
                    Target.stopPropagation();
                    break;
            }
        }
    };
    Disable.DeveloperTools.Init = function() {
        let Self = Disable.DeveloperTools;
        let Func = function(Action, Index, List) {
            document.body.addEventListener(Action, Self.Event);
        };
        ["contextmenu", "keydown"].forEach(Func);
    };
    Disable.DeveloperTools.Init();

/***************************************************************************************************
 ===================================================================================================
    Function [ Include ]
 ===================================================================================================
 **************************************************************************************************/
    Include.Response = function(e)
    {
        var Target = e.target || e.srcElement || e.currentTarget;
        if(Target.readyState == 4){
            let Element_Script = document.createElement("script");
            Element_Script.innerText = Target.responseText;
            document.body.append(Element_Script);
        }
    };

    Include.Request  = function(Item) {
        if ( typeof URN[Item] != "undefined" ) {
            let URI  = URL + URN[Item];
            let HTTP = new XMLHttpRequest();
            let Func = function(Action, Index, List) {
                HTTP.addEventListener(Action, Include.Response);
            };
            HTTP.open("GET", URI, true);
            ["progress", "load", "error", "abort"].forEach(Func);
            HTTP.send();
        }
    };

    Include.Request("Menu");
})();
