'use strict';

System.register('pushedx/realtime-chat/components/ChatFrame', ['flarum/Component', 'flarum/helpers/icon', 'flarum/components/LoadingIndicator'], function (_export, _context) {
    var Component, icon, LoadingIndicator, ChatFrame;
    return {
        setters: [function (_flarumComponent) {
            Component = _flarumComponent.default;
        }, function (_flarumHelpersIcon) {
            icon = _flarumHelpersIcon.default;
        }, function (_flarumComponentsLoadingIndicator) {
            LoadingIndicator = _flarumComponentsLoadingIndicator.default;
        }],
        execute: function () {
            ChatFrame = function (_Component) {
                babelHelpers.inherits(ChatFrame, _Component);

                function ChatFrame() {
                    babelHelpers.classCallCheck(this, ChatFrame);
                    return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(ChatFrame).apply(this, arguments));
                }

                babelHelpers.createClass(ChatFrame, [{
                    key: 'init',
                    value: function init() {
                        // initial state of the button
                        this.loading = false;
                    }
                }, {
                    key: 'getChat',
                    value: function getChat(el) {
                        return el.id == 'chat' ? el : typeof el.parentNode !== 'undefined' ? this.getChat(el.parentNode) : null;
                    }
                }, {
                    key: 'checkFocus',
                    value: function checkFocus(e) {
                        // Get the chat div from the event target
                        var chat = this.getChat(e.target);

                        if (chat.className.indexOf("active") >= 0) {
                            e.preventDefault();
                            e.stopPropagation();

                            return;
                        }
                    }
                }, {
                    key: 'setFocus',
                    value: function setFocus(e) {
                        // Get the chat div from the event target
                        var chat = this.getChat(e.target);

                        // Find the input element
                        for (var i = 0; i < chat.children.length; ++i) {
                            var el = chat.children[i];
                            if (el.tagName.toLowerCase() == 'input') {
                                // Focus it
                                el.focus();
                            }
                        }
                    }
                }, {
                    key: 'focus',
                    value: function focus(e) {
                        e.target.parentNode.className = "frame active";
                    }
                }, {
                    key: 'blur',
                    value: function blur(e) {
                        e.target.parentNode.className = "frame";
                    }
                }, {
                    key: 'view',
                    value: function view() {
                        return m('div', { className: 'chat left container' }, [m('div', { className: 'frame', id: 'chat', onmousedown: this.checkFocus.bind(this), onclick: this.setFocus.bind(this) }, [m('div', { id: 'chat-header' }, [m('h2', 'PushEdx Chat')]), m('input', { type: 'text', id: 'chat-input', onfocus: this.focus.bind(this), onblur: this.blur.bind(this) }), this.loading ? LoadingIndicator.component({ className: 'loading Button-icon' }) : m('span'), m('div', { className: 'wrapper' })])]);
                    }
                }, {
                    key: 'process',
                    value: function process(e) {}
                    /*
                    // get the file from the input field
                    const data = new FormData();
                    data.append('image', $(e.target)[0].files[0]);
                      // set the button in the loading state (and redraw the element!)
                    this.loading = true;
                    m.redraw();
                      // send a POST request to the api
                    app.request({
                        method: 'POST',
                        url: app.forum.attribute('apiUrl') + '/image/upload',
                        serialize: raw => raw,
                        data
                    }).then(
                        this.success.bind(this),
                        this.failure.bind(this)
                    );
                    */


                    /**
                     * Handles errors.
                     *
                     * @param message
                     */

                }, {
                    key: 'failure',
                    value: function failure(message) {}
                    // todo show popup


                    /**
                     * Appends the image's link to the body of the composer.
                     *
                     * @param image
                     */

                }, {
                    key: 'success',
                    value: function success(image) {
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
                }]);
                return ChatFrame;
            }(Component);

            _export('default', ChatFrame);
        }
    };
});;
'use strict';

System.register('pushedx/realtime-chat/main', ['flarum/extend', 'flarum/components/HeaderPrimary', 'pushedx/realtime-chat/components/ChatFrame'], function (_export, _context) {
    var extend, HeaderPrimary, ChatFrame;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumComponentsHeaderPrimary) {
            HeaderPrimary = _flarumComponentsHeaderPrimary.default;
        }, function (_pushedxRealtimeChatComponentsChatFrame) {
            ChatFrame = _pushedxRealtimeChatComponentsChatFrame.default;
        }],
        execute: function () {

            app.initializers.add('pushedx-realtime-chat', function (app) {
                /**
                 * Add the upload button to the post composer.
                 */
                extend(HeaderPrimary.prototype, 'items', function (items) {
                    var chatFrame = new ChatFrame();
                    items.add('pushedx-chat-frame', chatFrame);
                });
            });
        }
    };
});