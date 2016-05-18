import Component from 'flarum/Component';
import icon from 'flarum/helpers/icon';
import LoadingIndicator from 'flarum/components/LoadingIndicator';
import avatar from 'flarum/helpers/avatar';

export function ChatMessage(user, message) {
    this.user = user;
    this.message = message;
}

export class ChatFrame extends Component {

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

    scroll(e) {
        if (this.status.autoScroll) {
            e.scrollTop = e.scrollHeight;
        } else {
            e.scrollTop = this.status.oldScroll;
        }

        this.status.autoScroll = (e.scrollTop + e.offsetHeight == e.scrollHeight);
        this.status.oldScroll = e.scrollTop;
    }

    disableAutoScroll(e) {
        let el = e.target;
        this.status.autoScroll = false;
        this.status.oldScroll = el.scrollTop;
    }

    toggle(e) {
        var chat = this.getChat(e.target).parentNode;
        var classes = chat.className;
        var showing = false;

        if (classes.indexOf(' hidden') >= 0) {
            classes = classes.substr(0, classes.indexOf(' hidden'));
            showing = true;
        } else {
            classes += ' hidden';
        }

        chat.className = classes;
        this.status.beingShown = showing;
        localStorage.setItem('beingShown', JSON.stringify(showing));
    }

    /**
     * Show the actual Chat Frame.
     *
     * @returns {*}
     */
    view() {
        return m('div', {className: 'chat left container ' + (this.status.beingShown ? '' : 'hidden')}, [
            m('div', {className: 'frame', id: 'chat', onmousedown: this.checkFocus.bind(this), onclick: this.setFocus.bind(this) }, [
                m('div', {id: 'chat-header', onclick: this.toggle.bind(this)}, [
                    m('h2', 'PushEdx Chat'),
                ]),
                this.status.loading ? LoadingIndicator.component({className: 'loading Button-icon'}) : m('span'),
                m('div', {className: 'wrapper', config: this.scroll.bind(this), onscroll: this.disableAutoScroll.bind(this) }, [
                    this.status.messages.map(function(o) {
                        return m('div', {className: 'message-wrapper'}, [
                            m('span', {className: 'avatar-wrapper'}, avatar(o.user, {className: 'avatar'})),
                            m('span', {className: 'message'}, o.message),
                            m('div', {className: 'clear'})
                        ])
                    })
                ]),
                m('input', {
                    type: 'text',
                    id: 'chat-input',
                    disabled: !app.forum.attribute('canPostChat'),
                    placeholder: app.forum.attribute('canPostChat') ? '' : 'Solo los usuarios registrados pueden usar el chat',
                    onfocus: this.focus.bind(this),
                    onblur: this.blur.bind(this),
                    onkeyup: this.process.bind(this)
                })
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
            const data = new FormData();
            data.append('msg', e.target.value);

            this.status.loading = true;
            e.target.value = '';
            m.redraw();

            app.request({
                method: 'POST',
                url: app.forum.attribute('apiUrl') + '/chat/post',
                serialize: raw => raw,
                data
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
        console.log("FAIL: " + message);
        this.status.loading = false;
        m.redraw();
    }

    /**
     * Appends the image's link to the body of the composer.
     *
     * @param image
     */
    success(response) {
        // End loading
        this.status.loading = false;

        // Redraw now
        m.redraw();

        // Do nothing, pusher will
        //let msg = response.data.id;
        //this.addMessage(msg, app.session.user)
    }

    addMessage(msg, user, userId) {
        // Do note "messages" is a "set", thus = is a function
        var obj = new ChatMessage(user, msg);
        this.status.messages = obj;

        // Local storage can not save the complete use as JSON, so let's just
        // save its "id", which we will load afterwards
        let smallItem = new ChatMessage(userId, msg);

        // Get the saved array so far
        messages = localStorage.getItem('messages');
        if (messages === null) {
            // First item, add it as is
            localStorage.setItem('messages', JSON.stringify([smallItem]));
        } else {
            // Get all items
            messages = JSON.parse(messages);
            // Only save the last 9
            messages = messages.splice(-9);
            // Add the current
            messages.push(smallItem)
            // Save now
            localStorage.setItem('messages', JSON.stringify(messages));
        }

        // End loading
        this.status.loading = false;

        // Redraw now
        m.redraw();

        // Return the object
        return obj;
    }
}
