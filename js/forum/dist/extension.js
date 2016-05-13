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
                        this.status = null;
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
                        return m('div', { className: 'chat left container' }, [m('div', { className: 'frame', id: 'chat', onmousedown: this.checkFocus.bind(this), onclick: this.setFocus.bind(this) }, [m('div', { id: 'chat-header' }, [m('h2', 'PushEdx Chat')]), m('input', {
                            type: 'text',
                            id: 'chat-input',
                            onfocus: this.focus.bind(this),
                            onblur: this.blur.bind(this),
                            onkeyup: this.process.bind(this)
                        }), this.status.loading ? LoadingIndicator.component({ className: 'loading Button-icon' }) : m('span'), m('div', { className: 'wrapper' })])]);
                    }
                }, {
                    key: 'process',
                    value: function process(e) {
                        if (e.keyCode == 13 && !this.status.loading) {
                            this.status.loading = true;
                            var msg = e.target.value;
                            e.target.value = '';
                            m.redraw();

                            app.request({
                                method: 'POST',
                                url: app.forum.attribute('apiUrl') + '/chat/post',
                                serialize: function serialize(raw) {
                                    return raw;
                                },
                                msg: msg
                            }).then(this.success.bind(this), this.failure.bind(this));
                        }
                    }
                }, {
                    key: 'failure',
                    value: function failure(message) {
                        // todo show popup
                        console.log(message);
                    }
                }, {
                    key: 'success',
                    value: function success(message) {
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
                }]);
                return ChatFrame;
            }(Component);

            _export('default', ChatFrame);
        }
    };
});;
'use strict';

System.register('pushedx/realtime-chat/main', ['flarum/extend', 'flarum/components/HeaderSecondary', 'pushedx/realtime-chat/components/ChatFrame'], function (_export, _context) {
    var extend, HeaderSecondary, ChatFrame;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumComponentsHeaderSecondary) {
            HeaderSecondary = _flarumComponentsHeaderSecondary.default;
        }, function (_pushedxRealtimeChatComponentsChatFrame) {
            ChatFrame = _pushedxRealtimeChatComponentsChatFrame.default;
        }],
        execute: function () {

            app.initializers.add('pushedx-realtime-chat', function (app) {

                var status = {
                    loading: false,
                    pusher: null
                };

                /**
                 * Add the upload button to the post composer.
                 */
                extend(HeaderSecondary.prototype, 'items', function (items) {
                    var chatFrame = new ChatFrame();
                    chatFrame.status = status;
                    items.add('pushedx-chat-frame', chatFrame);
                });
            });
        }
    };
});