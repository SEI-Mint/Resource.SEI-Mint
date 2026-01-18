(function (window, document, proto) {
    if (!proto) return;

    proto.DeveloperTools = {
        action: {
            contextmenu: function (e) {
                if (!e) return;
                e.preventDefault();
                e.stopPropagation();
            },
            keydown: function (e) {
                if (!e) return;
                const keycode = e.which ?? e.keyCode ?? 0;
                switch (keycode) {
                    case 67:
                    case 73:
                        if (e?.shiftKey === true && e?.ctrlKey === true) {
                            e.preventDefault();
                            e.stopPropagation();
                            alert(_("DeveloperTools Disabled"));
                        }
                        break;
                    case 123:
                        e.preventDefault();
                        e.stopPropagation();
                        break;
                    default:
                        break;
                }

            }
        },
        event: function (e) {
            const self = proto.DeveloperTools;
            const action = e?.type ?? "unknown";
            if (action in self.action) {
                self.action[action](e);
            }
        },
        disable: function (e) {
            const self = proto.DeveloperTools;
            for (let action in self.action) {
                document.body.addEventListener(action, proto.DeveloperTools.event);
            }
        },
    }

    if (M) {
        M.DeveloperTools.disable();
        M.require('js.expansion.import');
    }
})(window, document, M?.constructor?.prototype);
