(function (window, document, proto) {
    if (!proto) return;

    proto.format = function (...args) {
        let ret = "";
        let fmt = this;
        // %[flags][width][.precision][length]specifier
        const FORMAT_REGEX = /%([\-+0 #]*)(\d+)?(?:\.(\d+))?([scdiuoxXfFeEgGp%])/g;
        const specifier = {
            string: "s",
            char: "c",

            int: "d",
            intAlt: "i",
            uint: "u",
            octal: "o",
            hex: "x",
            HEX: "X",

            float: "f",
            exp: "e",
            EXP: "E",
            general: "g",
            GENERAL: "G",

            pointer: "p",
            percent: "%"
        };
        const specifiers = {
            s: "string",
            c: "char",

            d: "int",
            i: "int",
            u: "uint",

            o: "octal",
            x: "hex",
            X: "HEX",

            f: "float",
            e: "exp",
            E: "EXP",
            g: "general",
            G: "GENERAL",

            p: "pointer",
            "%": "percent"
        };

        const tokens = [];
        let lastIndex = 0;

        for (const m of fmt.matchAll(FORMAT_REGEX)) {
            if (m.index > lastIndex) {
                tokens.push({
                    type: "text",
                    value: fmt.slice(lastIndex, m.index)
                });
            }

            tokens.push({
                type: "format",
                raw: m[0],
                flags: m[1] || "",
                width: m[2] ? Number(m[2]) : null,
                precision: m[3] ? Number(m[3]) : null,
                specifier: m[4]
            });

            lastIndex = m.index + m[0].length;
        }

        if (lastIndex < fmt.length) {
            tokens.push({
                type: "text",
                value: fmt.slice(lastIndex)
            });
        }

        const applyWidth = function (str, {
            width,
            flags
        }) {
            if (!width || str.length >= width) return str;

            const padChar = flags.includes("0") && !flags.includes("-") ? "0" : " ";
            const padLen = width - str.length;
            const pad = padChar.repeat(padLen);

            return flags.includes("-") ? str + pad : pad + str;
        }

        const renderers = {
            s(value, opt) {
                let str = String(value);
                if (opt.precision != null) {
                    str = str.slice(0, opt.precision);
                }
                return applyWidth(str, opt);
            },

            c(value, opt) {
                const str = String(value)[0] ?? "";
                return applyWidth(str, opt);
            },

            d(value, opt) {
                let num = Math.trunc(Number(value));
                let str = String(num);

                if (opt.precision != null) {
                    str = str.padStart(opt.precision, "0");
                }

                return applyWidth(str, opt);
            },

            f(value, opt) {
                const prec = opt.precision ?? 6;
                let str = Number(value).toFixed(prec);
                return applyWidth(str, opt);
            },

            "%"() {
                return "%";
            }
        };

        let argIndex = 0;
        ret = tokens.map(t => {
            if (t.type === "text") return t.value;

            if (t.specifier === "%") return "%";

            const value = args[argIndex++];
            const renderer = renderers[t.specifier];

            if (!renderer) {
                throw new Error(`Unsupported specifier: %${t.specifier}`);
            }

            return renderer(value, t);
        }).join("");

        return ret;
    }
})(window, document, String.prototype);
