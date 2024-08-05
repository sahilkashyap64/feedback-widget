class FeedbackCollector {
    constructor() {
        this.serialNumber = 1;
        this.isEnabled = true;
        this.init();
    }

    init() {
        this.tagElements();
        document.addEventListener('click', (e) => this.handleClick(e));
        this.createToggleButton();
    }

    tagElements() {
        const elements = document.querySelectorAll('h1, h2, h3, p, img');
        elements.forEach(element => {
            const span = document.createElement('span');
            span.textContent = `[${this.serialNumber}] `;
            span.style.cursor = 'pointer';
            span.dataset.serial = this.serialNumber;
            element.insertBefore(span, element.firstChild);
            this.serialNumber++;
        });
    }

    handleClick(event) {
        if (!this.isEnabled) return;
        const target = event.target;
        if (target.dataset.serial) {
            this.openFeedbackWidget(target);
        }
    }

    openFeedbackWidget(target) {
        this.closeExistingWidget();
        
        const widget = document.createElement('div');
        widget.className = 'feedback-widget';
        widget.innerHTML = `
            <div>
                <label><input type="radio" name="feedbackType" value="idea" checked> Idea</label>
                <label><input type="radio" name="feedbackType" value="issue"> Issue</label>
                <label><input type="radio" name="feedbackType" value="other"> Other</label>
            </div>
            <textarea placeholder="Enter your feedback"></textarea>
            <button>Send</button>
        `;

        widget.style.position = 'absolute';
        widget.style.top = `${target.getBoundingClientRect().top + window.scrollY + 20}px`;
        widget.style.left = `${target.getBoundingClientRect().left}px`;
        widget.querySelector('button').addEventListener('click', () => this.submitFeedback(target.dataset.serial, widget));
        
        document.body.appendChild(widget);
    }

    closeExistingWidget() {
        const existingWidget = document.querySelector('.feedback-widget');
        if (existingWidget) {
            existingWidget.remove();
        }
    }

    submitFeedback(serial, widget) {
        const feedbackType = widget.querySelector('input[name="feedbackType"]:checked').value;
        const feedbackText = widget.querySelector('textarea').value;
        
        console.log(`Feedback for element [${serial}]: ${feedbackType} - ${feedbackText}`);
        
        widget.remove();
    }

    createToggleButton() {
        const toggleButton = document.createElement('button');
        toggleButton.textContent = 'Toggle Feedback';
        toggleButton.style.position = 'fixed';
        toggleButton.style.bottom = '10px';
        toggleButton.style.right = '10px';
        toggleButton.addEventListener('click', () => this.toggleFeedback());
        
        document.body.appendChild(toggleButton);
    }

    toggleFeedback() {
        this.isEnabled = !this.isEnabled;
        alert(`Feedback is now ${this.isEnabled ? 'enabled' : 'disabled'}`);
    }
}

const feedbackCollector = new FeedbackCollector();
