(function(){
    var Disable = {};
    
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

})();
