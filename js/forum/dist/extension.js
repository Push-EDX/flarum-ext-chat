'use strict';

System.register('pushedx/realtime-chat/components/ChatFrame', ['flarum/Component', 'flarum/helpers/icon', 'flarum/components/LoadingIndicator', 'flarum/helpers/avatar'], function (_export, _context) {
    var Component, icon, LoadingIndicator, avatar, ChatFrame;
    return {
        setters: [function (_flarumComponent) {
            Component = _flarumComponent.default;
        }, function (_flarumHelpersIcon) {
            icon = _flarumHelpersIcon.default;
        }, function (_flarumComponentsLoadingIndicator) {
            LoadingIndicator = _flarumComponentsLoadingIndicator.default;
        }, function (_flarumHelpersAvatar) {
            avatar = _flarumHelpersAvatar.default;
        }],
        execute: function () {
            function ChatMessage(user, message) {
                this.user = user;
                this.message = message;
            }

            _export('ChatMessage', ChatMessage);

            _export('ChatFrame', ChatFrame = function (_Component) {
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
                    key: 'scroll',
                    value: function scroll(e) {
                        if (this.status.autoScroll) {
                            e.scrollTop = e.scrollHeight;
                        } else {
                            e.scrollTop = this.status.oldScroll;
                        }

                        this.status.autoScroll = e.scrollTop + e.offsetHeight == e.scrollHeight;
                        this.status.oldScroll = e.scrollTop;
                    }
                }, {
                    key: 'disableAutoScroll',
                    value: function disableAutoScroll(e) {
                        e = e.target;
                        this.status.autoScroll = false;
                        this.status.oldScroll = e.scrollTop;
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
                        }), this.status.loading ? LoadingIndicator.component({ className: 'loading Button-icon' }) : m('span'), m('div', { className: 'wrapper', config: this.scroll.bind(this), onscroll: this.disableAutoScroll.bind(this) }, [this.status.messages.map(function (o) {
                            return m('div', { className: 'message-wrapper' }, [m('span', { className: 'avatar-wrapper' }, avatar(o.user, { className: 'avatar' })), m('span', { className: 'message' }, o.message), m('div', { className: 'clear' })]);
                        })])])]);
                    }
                }, {
                    key: 'process',
                    value: function process(e) {
                        if (e.keyCode == 13 && !this.status.loading) {
                            var data = new FormData();
                            data.append('msg', e.target.value);

                            this.status.loading = true;
                            e.target.value = '';
                            m.redraw();

                            app.request({
                                method: 'POST',
                                url: app.forum.attribute('apiUrl') + '/chat/post',
                                serialize: function serialize(raw) {
                                    return raw;
                                },
                                data: data
                            }).then(this.success.bind(this), this.failure.bind(this));
                        }
                    }
                }, {
                    key: 'failure',
                    value: function failure(message) {
                        // todo show popup
                        console.log("FAIL: " + message);
                        this.status.loading = false;
                        m.redraw();
                    }
                }, {
                    key: 'success',
                    value: function success(response) {
                        // Add to the status messages
                        var msg = response.data.id;
                        // Do note "messages" is a "set", thus = is a function
                        this.status.messages = new ChatMessage(app.session.user, msg);
                        // End loading
                        this.status.loading = false;

                        // Local storage can not save the complete use as JSON, so let's just
                        // save its "id", which we will load afterwards
                        var smallItem = new ChatMessage(app.session.user.id(), msg);

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
                            messages.push(smallItem);
                            // Save now
                            localStorage.setItem('messages', JSON.stringify(messages));
                        }

                        // Redraw now
                        m.redraw();
                    }
                }]);
                return ChatFrame;
            }(Component));

            _export('ChatFrame', ChatFrame);
        }
    };
});;
'use strict';

System.register('pushedx/realtime-chat/main', ['flarum/extend', 'flarum/components/HeaderSecondary', 'pushedx/realtime-chat/components/ChatFrame'], function (_export, _context) {
    var extend, HeaderSecondary, ChatFrame, ChatMessage;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumComponentsHeaderSecondary) {
            HeaderSecondary = _flarumComponentsHeaderSecondary.default;
        }, function (_pushedxRealtimeChatComponentsChatFrame) {
            ChatFrame = _pushedxRealtimeChatComponentsChatFrame.ChatFrame;
            ChatMessage = _pushedxRealtimeChatComponentsChatFrame.ChatMessage;
        }],
        execute: function () {

            app.initializers.add('pushedx-realtime-chat', function (app) {

                var status = {
                    loading: false,
                    autoScroll: true,
                    oldScroll: 0,
                    pusher: null,

                    _init: false,
                    _messages: [],

                    // Getter because app.store.getById returns null if executed now... Why??
                    get messages() {
                        if (!this._init) {
                            this._messages = (JSON.parse(localStorage.getItem('messages')) || []).map(function (message) {
                                if (message.user.data) return message;

                                return new ChatMessage(app.store.getById('users', message.user), message.message);
                            });

                            this._init = true;
                        }

                        return this._messages;
                    },

                    set messages(message) {
                        this._messages.push(message);
                    }
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