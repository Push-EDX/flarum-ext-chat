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
                    key: 'focusIn',
                    value: function focusIn(e) {
                        // Get the chat div from the event target
                        var chat = this.getChat(e.target);
                        chat.className = "frame active";
                    }
                }, {
                    key: 'focusInput',
                    value: function focusInput(e) {
                        // Skip if it was a drag
                        if (this.status.dragFlagged) {
                            this.status.dragFlagged = false;
                            return;
                        }

                        // Get the chat div from the event target
                        var chat = this.getChat(e.target);

                        // Find the input element
                        for (var i = 0; i < chat.children.length; ++i) {
                            var el = chat.children[i];
                            if (el.tagName.toLowerCase() == 'input') {
                                // Skip if already in
                                if (e.target == el) {
                                    return;
                                }

                                // Focus it
                                el.focus();
                            }
                        }
                    }
                }, {
                    key: 'focusOut',
                    value: function focusOut(e) {
                        // Get the chat div from the event target
                        var chat = this.getChat(e.target);
                        chat.className = "frame";
                    }
                }, {
                    key: 'flagDrag',
                    value: function flagDrag(e) {
                        this.status.dragFlagged = this.status.downFlagged && true;
                    }
                }, {
                    key: 'flagDown',
                    value: function flagDown(e) {
                        this.status.downFlagged = true;
                    }
                }, {
                    key: 'flagUp',
                    value: function flagUp(e) {
                        this.status.downFlagged = false;
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
                        var el = e.target;
                        this.status.autoScroll = false;
                        this.status.oldScroll = el.scrollTop;
                    }
                }, {
                    key: 'toggle',
                    value: function toggle(e) {
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
                }, {
                    key: 'view',
                    value: function view() {
                        return m('div', { className: 'chat left container ' + (this.status.beingShown ? '' : 'hidden') }, [m('div', {
                            tabindex: 0,
                            className: 'frame',
                            id: 'chat',
                            onfocusin: this.focusIn.bind(this),
                            onfocusout: this.focusOut.bind(this),
                            onclick: this.focusInput.bind(this),
                            onmousedown: this.flagDown.bind(this),
                            onmousemove: this.flagDrag.bind(this),
                            onmouseup: this.flagUp.bind(this)
                        }, [m('div', { id: 'chat-header', onclick: this.toggle.bind(this) }, [m('h2', 'PushEdx Chat')]), this.status.loading ? LoadingIndicator.component({ className: 'loading Button-icon' }) : m('span'), m('div', { className: 'wrapper', config: this.scroll.bind(this), onscroll: this.disableAutoScroll.bind(this) }, [this.status.messages.map(function (o) {
                            return m('div', { className: 'message-wrapper' }, [m('span', { className: 'avatar-wrapper' }, avatar(o.user, { className: 'avatar' })), m('span', { className: 'message' }, o.message), m('div', { className: 'clear' })]);
                        })]), m('input', {
                            type: 'text',
                            id: 'chat-input',
                            disabled: !app.forum.attribute('canPostChat'),
                            placeholder: app.forum.attribute('canPostChat') ? '' : 'Solo los usuarios registrados pueden usar el chat',
                            onkeyup: this.process.bind(this)
                        })])]);
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
                        // End loading
                        this.status.loading = false;

                        // Redraw now
                        m.redraw();
                    }
                }, {
                    key: 'addMessage',
                    value: function addMessage(msg, user) {
                        // Do note "messages" is a "set", thus = is a function
                        var obj = new ChatMessage(user, msg);
                        this.status.messages = obj;

                        // End loading
                        this.status.loading = false;

                        // Redraw now
                        m.redraw();

                        // Return the object
                        return obj;
                    }
                }]);
                return ChatFrame;
            }(Component));

            _export('ChatFrame', ChatFrame);
        }
    };
});;
'use strict';

System.register('pushedx/realtime-chat/main', ['flarum/extend', 'flarum/components/HeaderPrimary', 'pushedx/realtime-chat/components/ChatFrame'], function (_export, _context) {
    var extend, HeaderPrimary, ChatFrame, ChatMessage;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumComponentsHeaderPrimary) {
            HeaderPrimary = _flarumComponentsHeaderPrimary.default;
        }, function (_pushedxRealtimeChatComponentsChatFrame) {
            ChatFrame = _pushedxRealtimeChatComponentsChatFrame.ChatFrame;
            ChatMessage = _pushedxRealtimeChatComponentsChatFrame.ChatMessage;
        }],
        execute: function () {

            app.initializers.add('pushedx-realtime-chat', function (app) {

                var showStatus = localStorage.getItem('beingShown');

                var status = {
                    loading: false,
                    autoScroll: true,
                    oldScroll: 0,
                    callback: null,
                    beingShown: showStatus === null ? true : JSON.parse(showStatus),

                    _init: false,
                    _messages: [],

                    get messages() {
                        return this._messages;
                    },

                    set messages(message) {
                        this._messages.push(message);
                    }
                };

                function forwardMessage(message) {
                    var user = app.store.getById('users', message.actorId);
                    var obj = status.callback(message.message, user);

                    if (user == undefined) {
                        app.store.find('users', message.actorId).then(function (user) {
                            obj.user = user;
                            m.redraw();
                        });
                    }
                }

                extend(HeaderPrimary.prototype, 'config', function (x, isInitialized, context) {
                    if (isInitialized) return;

                    app.pusher.then(function (channels) {
                        channels.main.bind('newChat', function (data) {
                            forwardMessage(data);
                        });

                        extend(context, 'onunload', function () {
                            return channels.main.unbind('newChat');
                        });
                    });

                    // Just loaded? Fetch last 10 messages
                    if (status.messages.length == 0) {
                        app.request({
                            method: 'POST',
                            url: app.forum.attribute('apiUrl') + '/chat/fetch',
                            serialize: function serialize(raw) {
                                return raw;
                            }
                        }).then(function (response) {
                            for (var i = 0; i < response.data.attributes.messages.length; ++i) {
                                forwardMessage(response.data.attributes.messages[i]);
                            }
                        }, function (response) {});
                    }
                });

                /**
                 * Add the upload button to the post composer.
                 */
                extend(HeaderPrimary.prototype, 'items', function (items) {
                    var chatFrame = new ChatFrame();
                    chatFrame.status = status;
                    status.callback = chatFrame.addMessage.bind(chatFrame);
                    items.add('pushedx-chat-frame', chatFrame);
                });
            });
        }
    };
});