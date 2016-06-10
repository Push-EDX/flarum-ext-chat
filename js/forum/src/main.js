import { extend } from 'flarum/extend';
import HeaderPrimary from 'flarum/components/HeaderPrimary';

import {ChatFrame,ChatMessage} from 'pushedx/realtime-chat/components/ChatFrame';

app.initializers.add('pushedx-realtime-chat', app => {

    let showStatus = localStorage.getItem('beingShown');
    let isMuted = localStorage.getItem('isMuted');
    let notify = localStorage.getItem('notify');

    let status = {
        loading: false,
        autoScroll: true,
        oldScroll: 0,
        callback: null,
        beingShown: showStatus === null ? true : JSON.parse(showStatus),
        isMuted: isMuted === null ? true : JSON.parse(isMuted),
        notify: notify === null ? false : JSON.parse(notify),

        _init: false,
        _messages: [],

        get messages() {
            return this._messages;
        },

        set messages(message) {
            this._messages.push(message);
        }
    };

    extend(HeaderPrimary.prototype, 'config', function(x, isInitialized, context) {
        if (isInitialized) return;

        app.pusher.then(channels => {
            channels.main.bind('newChat', data => {
                status.forwardMessage(data);
            });

            extend(context, 'onunload', () => channels.main.unbind('newChat'));
        });

        // Just loaded? Fetch last 10 messages
        if (status.messages.length == 0)
        {
            const data = new FormData();
            data.append('id', -1)

            app.request({
                method: 'POST',
                url: app.forum.attribute('apiUrl') + '/chat/fetch',
                serialize: raw => raw,
                data
            }).then(
                function (response) {
                    for (var i = 0; i < response.data.attributes.messages.length; ++i) {
                        status.forwardMessage(response.data.attributes.messages[i], false);
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
        var realView = chatFrame.view;
        chatFrame.view = () => {
            return realView.call(chatFrame);
        };
        chatFrame.status = status;
        status.forwardMessage = chatFrame.forwardMessage.bind(chatFrame);
        items.add('pushedx-chat-frame', chatFrame);
    });
});
