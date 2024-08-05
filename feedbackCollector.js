import { computePosition, flip, shift } from "@floating-ui/dom";
import { createFocusTrap } from "focus-trap";

// Form HTML and CSS as string literals
const formHTML = `<button id="feedbackfin__close" class="feedbackfin__icon-button" type="reset" aria-label="Close"><svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button><form id="feedbackfin__form"><h1 id="feedbackfin__title">Send feedback</h1><div id="feedbackfin__radio-group" role="radiogroup" aria-label="Feedback type"><input class="feedbackfin__radio" type="radio" id="feedbackfin__radio--issue" name="feedbackType" value="issue" required><label for="feedbackfin__radio--issue" class="feedbackfin__button feedbackfin__radio-label"><span class="feedbackfin__radio-icon">&#x2757;</span>Issue</label><input class="feedbackfin__radio" type="radio" id="feedbackfin__radio--idea" name="feedbackType" value="idea" required><label for="feedbackfin__radio--idea" class="feedbackfin__button feedbackfin__radio-label"><span class="feedbackfin__radio-icon">&#x1F4A1;</span>Idea</label><input class="feedbackfin__radio" type="radio" id="feedbackfin__radio--other" name="feedbackType" value="other" required><label for="feedbackfin__radio--other" class="feedbackfin__button feedbackfin__radio-label"><span class="feedbackfin__radio-icon">&#x1F4AD;</span>Other</label></div><div id="feedbackfin__step2"><textarea id="feedbackfin__message" name="message" type="text" placeholder="I think…" required rows="2" aria-label="Message"></textarea><button id="feedbackfin__submit" class="feedbackfin__button" type="submit">Send</button></div></form><div id="feedbackfin__success"><svg viewBox="0 0 18 18" width="3em" height="3em" role="presentation"><polyline stroke-width="2" stroke-linecap="round" stroke-linejoin="round" points="2.705 8.29 7 12.585 15.295 4.29" fill="none" id="feedbackfin__check"/></svg>Thanks for your feedback!</div><div id="feedbackfin__branding"><a href="https://www.rowy.io/feedbackfin" target="_blank" rel="noopener">Powered by Rowy</a></div>`;

const formCSS = `/* Include your CSS here */`;

export class FeedbackCollector {
    constructor() {
        this.isEnabled = true;
        this.init();
    }

    init() {
        this.injectStyles();
        this.tagElements();
        this.createToggleButton();
        this.createContainer();
    }

    injectStyles() {
        const styleElement = document.createElement("style");
        styleElement.id = "feedbackfin__css";
        styleElement.innerHTML = formCSS;
        document.head.insertBefore(styleElement, document.head.firstChild);
    }

    tagElements() {
        document.querySelectorAll("*:not(script):not(style)").forEach((el, index) => {
            el.setAttribute("data-feedbackfin-serial", index.toString());
            el.addEventListener("click", (e) => this.open(e));
        });
    }

    createContainer() {
        this.containerElement = document.createElement("div");
        this.containerElement.id = "feedbackfin__container";
        document.body.appendChild(this.containerElement);

        this.trap = createFocusTrap(this.containerElement, {
            initialFocus: "#feedbackfin__radio--issue",
            allowOutsideClick: true,
        });
    }

    open(event) {
        if (!this.isEnabled) return;

        const target = event.target;
        this.containerElement.innerHTML = formHTML;
        this.containerElement.style.display = "block";

        computePosition(target, this.containerElement, {
            placement: "bottom",
            middleware: [flip(), shift({ crossAxis: true, padding: 8 })],
            strategy: "fixed",
        }).then(({ x, y }) => {
            Object.assign(this.containerElement.style, {
                left: `${x}px`,
                top: `${y}px`,
            });
        });

        this.trap.activate();

        document.getElementById("feedbackfin__close").addEventListener("click", () => this.close());

        Array.from(this.containerElement.getElementsByClassName("feedbackfin__radio")).forEach((el) => {
            el.addEventListener("change", (e) => this.changeType(e));
        });

        document.getElementById("feedbackfin__form").addEventListener("submit", (e) => this.submit(e));
    }

    close() {
        this.trap.deactivate();
        this.containerElement.innerHTML = "";
        this.containerElement.style.display = "none";
    }

    changeType(event) {
        const value = event.target.value;
        this.containerElement.setAttribute("data-feedback-type", value);

        let placeholder = "I think…";
        if (value === "issue") placeholder = "I’m having an issue with…";
        else if (value === "idea") placeholder = "I’d like to see…";

        document.getElementById("feedbackfin__message").setAttribute("placeholder", placeholder);
    }

    submit(event) {
        event.preventDefault();
        const form = event.target;

        const feedbackType = form.elements.feedbackType.value;
        const message = form.elements.message.value;

        console.log(`Feedback submitted: ${feedbackType} - ${message}`);

        this.containerElement.setAttribute("data-success", "");
    }

    createToggleButton() {
        const toggleButton = document.createElement("button");
        toggleButton.textContent = "Toggle Feedback";
        toggleButton.style.position = "fixed";
        toggleButton.style.bottom = "10px";
        toggleButton.style.right = "10px";
        toggleButton.addEventListener("click", () => this.toggleFeedback());
        document.body.appendChild(toggleButton);
    }

    toggleFeedback() {
        this.isEnabled = !this.isEnabled;
        alert(`Feedback is now ${this.isEnabled ? 'enabled' : 'disabled'}`);
    }
}

const feedbackCollector = new FeedbackCollector();
export default feedbackCollector;
