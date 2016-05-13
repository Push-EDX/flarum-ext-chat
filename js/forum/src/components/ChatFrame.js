import Component from 'flarum/Component';
import icon from 'flarum/helpers/icon';
import LoadingIndicator from 'flarum/components/LoadingIndicator';

export default class ChatFrame extends Component {

    /**
     * Load the configured remote uploader service.
     */
    init() {
        this.status = null;
    }

    /**
     * Gets the chat element from the current element
     */
    getChat(el) {
        return (el.id == 'chat') ? el :
            ((typeof el.parentNode !== 'undefined') ? this.getChat(el.parentNode) : null);
    }

    /**
     * If the chat is already focused, ignore this click!
     */
    checkFocus(e) {
        // Get the chat div from the event target
        var chat = this.getChat(e.target);

        if (chat.className.indexOf("active") >= 0) {
            e.preventDefault();
            e.stopPropagation();

            return;
        }
    }

    /**
     * Sets the focus to the input when clicking the chat
     */
    setFocus(e) {
        // Get the chat div from the event target
        var chat = this.getChat(e.target);

        // Find the input element
        for (let i = 0; i < chat.children.length; ++i) {
            let el = chat.children[i];
            if (el.tagName.toLowerCase() == 'input') {
                // Focus it
                el.focus();
            }
        }
    }

    /**
     * Sets the "active" class to the chat element
     */
    focus(e) {
        e.target.parentNode.className = "frame active";
    }

    /**
     * Remove the "active" class from the chat element
     */
    blur(e) {
        e.target.parentNode.className = "frame";
    }

    /**
     * Show the actual Chat Frame.
     *
     * @returns {*}
     */
    view() {
        return m('div', {className: 'chat left container'}, [
            m('div', {className: 'frame', id: 'chat', onmousedown: this.checkFocus.bind(this), onclick: this.setFocus.bind(this) }, [
                m('div', {id: 'chat-header'}, [
                    m('h2', 'PushEdx Chat'),
                ]),
                m('input', {
                    type: 'text',
                    id: 'chat-input',
                    onfocus: this.focus.bind(this),
                    onblur: this.blur.bind(this),
                    onkeyup: this.process.bind(this)
                }),
                this.status.loading ? LoadingIndicator.component({className: 'loading Button-icon'}) : m('span'),
                m('div', {className: 'wrapper'})
            ])
        ]);
    }

    /**
     * Process the upload event.
     *
     * @param e
     */
    process(e) {
        if (e.keyCode == 13 && !this.status.loading) {
            this.status.loading = true;
            let msg = e.target.value;
            e.target.value = '';
            m.redraw();

            app.request({
                method: 'POST',
                url: app.forum.attribute('apiUrl') + '/chat/post',
                serialize: raw => raw,
                msg
            }).then(
                this.success.bind(this),
                this.failure.bind(this)
            );
        }
    }

    /**
     * Handles errors.
     *
     * @param message
     */
    failure(message) {
        // todo show popup
        console.log(message);
    }

    /**
     * Appends the image's link to the body of the composer.
     *
     * @param image
     */
    success(message) {
        console.log(message);
        /*
        var link = image.data.attributes.url;

        // create a markdown string that holds the image link
        var markdownString = '\n![image ' + link + '](' + link + ')\n';

        // place the Markdown image link in the Composer
        this.textAreaObj.insertAtCursor(markdownString);

        // if we are not starting a new discussion, the variable is defined
        if (typeof this.textAreaObj.props.preview !== 'undefined') {
            // show what we just uploaded
            this.textAreaObj.props.preview();
        }

        // reset the button for a new upload
        setTimeout(() => {
            document.getElementById("flagrow-image-upload-form").reset();
            this.loading = false;
        }, 1000);
        */
    }
}
