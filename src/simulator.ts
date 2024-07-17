
// JavaScript code to simulate typing in the composer of the chatbot
// @ts-nocheck
declare global {
    interface Window { nluxSimulator: any; }
};
window.nluxSimulator = (() => {
    let _prompt: string | null = null;
    let _simulatorEnabled: boolean = false;

    let _promptInput: HTMLTextAreaElement | null = null;
    let _setInputValue: ((value: string) => void) | null = null;

    var _nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        "value"
    ).set;

    return {
        get simulatorEnabled() {
            return _simulatorEnabled;
        },
        enableSimulator: () => {
            _simulatorEnabled = true;
        },
        disableSimulator: () => {
            _simulatorEnabled = false;
            _setInputValue = null;
        },
        get prompt() {
            return _prompt;
        },
        setPrompt(prompt: string) {
            _prompt = prompt;
            nluxSimulator.checkForPromptSimulation();
        },
        onPromptInputDetected: (promptInput: HTMLTextAreaElement) => {
            _promptInput = promptInput;
            _setInputValue = (value /* string */) => {
                if (_nativeTextAreaValueSetter) {
                    _nativeTextAreaValueSetter.call(_promptInput, value);
                }

                _promptInput.dispatchEvent(new Event("input", { bubbles: true }));
            };

            nluxSimulator.checkForPromptSimulation();
        },
        checkForPromptSimulation: () => {
            if (!_prompt || !_promptInput || !_simulatorEnabled) {
                return;
            }

            let promptToType = nluxSimulator.prompt;
            if (!promptToType) {
                return;
            }

            _promptInput.addEventListener("focus", () => {
                nluxSimulator.disableSimulator();
            });

            _promptInput.addEventListener("keydown", () => {
                nluxSimulator.disableSimulator();
            });

            const typeNextChar = () => {
                if (!nluxSimulator.simulatorEnabled) {
                    return;
                }

                if (promptToType.length === 0) {
                    nluxSimulator.simulatorEnabled && nluxSimulator.submitOnDoneTyping();
                    return;
                }

                if (_setInputValue) {
                    _setInputValue(_promptInput.value + promptToType[0]);
                }

                promptToType = promptToType.slice(1);
                const interval = Math.floor(Math.random() * 60) + 20;
                setTimeout(typeNextChar, interval);
            };

            typeNextChar();
        },
        setTranscriptValue: (value: string) => {
            nluxSimulator.onPromptInputDetected(nluxSimulator.getTextfield());
            _promptInput.addEventListener("change", () => {
                nluxSimulator.disableSimulator();
            });
            _setInputValue(value);
            setTimeout(() => nluxSimulator.submitOnDoneTyping(), 0);

        },
        getTextfield: () => (
            document.querySelector(
                ".nlux-AiChat-root .nlux-comp-composer > textarea"
            ) as HTMLTextAreaElement | null
        ),
        submitOnDoneTyping: () => {
            const submitButton = document.querySelector(
                ".nlux-AiChat-root .nlux-comp-composer > button"
            );

            if (submitButton) {
                submitButton.dispatchEvent(new Event("click", { bubbles: true }));
            }

            nluxSimulator.disableSimulator();
        }
    };
})();

const checkInputInterval = setInterval(() => {
    const nluxAiChatPromptInput = nluxSimulator.getTextfield();

    if (nluxAiChatPromptInput) {
        clearInterval(checkInputInterval);
        if (typeof nluxSimulator.onPromptInputDetected === "function") {
            setTimeout(() => {
                nluxSimulator.onPromptInputDetected(nluxAiChatPromptInput);
            }, 1000);
        }
    }
}, 200);


setTimeout(() => {
    nluxSimulator?.enableSimulator();
    nluxSimulator?.setPrompt("How an AI assistant can enhance my website's user experience?");
}, 1000);

export { };
