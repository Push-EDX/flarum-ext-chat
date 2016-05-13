import { extend } from 'flarum/extend';
import HeaderSecondary from 'flarum/components/HeaderSecondary';

import {ChatFrame,ChatMessage} from 'pushedx/realtime-chat/components/ChatFrame';

app.initializers.add('pushedx-realtime-chat', app => {

    let status = {
        loading: false,
        autoScroll: true,
        oldScroll: 0,
        pusher: null,

        _init: false,
        _messages: [],

        // Getter because app.store.getById returns null if executed now... Why??
        get messages() {
            if (!this._init) {
                this._messages = (JSON.parse(localStorage.getItem('messages')) || [])
                    .map(function(message){
                        if (message.user.data)
                            return message;

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
    extend(HeaderSecondary.prototype, 'items', function(items)
    {
        var chatFrame = new ChatFrame;
        chatFrame.status = status;
        items.add('pushedx-chat-frame', chatFrame);
    });
});
