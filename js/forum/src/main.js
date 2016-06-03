import { extend } from 'flarum/extend';
import HeaderPrimary from 'flarum/components/HeaderPrimary';

import {ChatFrame,ChatMessage} from 'pushedx/realtime-chat/components/ChatFrame';

app.initializers.add('pushedx-realtime-chat', app => {

    let status = {
        loading: false,
        autoScroll: true,
        oldScroll: 0,
        callback: null,
        beingShown: JSON.parse(localStorage.getItem('beingShown')) || false,

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

        if (user == undefined)
        {
            app.store.find('users', message.actorId).then(function(user){
                obj.user = user;
                m.redraw();
            });
        }
    }

    extend(HeaderPrimary.prototype, 'config', function(x, isInitialized, context) {
        if (isInitialized) return;

        app.pusher.then(channels => {
            channels.main.bind('newChat', data => {
                forwardMessage(data);
            });

            extend(context, 'onunload', () => channels.main.unbind('newChat'));
        });

        // Just loaded? Fetch last 10 messages
        if (status.messages.length == 0)
        {
            app.request({
                method: 'POST',
                url: app.forum.attribute('apiUrl') + '/chat/fetch',
                serialize: raw => raw
            }).then(
                function (response) {
                    for (var i = 0; i < response.data.attributes.messages.length; ++i) {
                        forwardMessage(response.data.attributes.messages[i]);
                    }
                },
                function (response) {

                }
            );
        }
    });

    /**
     * Add the upload button to the post composer.
     */
    extend(HeaderPrimary.prototype, 'items', function(items) {
        var chatFrame = new ChatFrame;
        chatFrame.status = status;
        status.callback = chatFrame.addMessage.bind(chatFrame);
        items.add('pushedx-chat-frame', chatFrame);
    });
});
