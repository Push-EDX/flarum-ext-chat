import { extend } from 'flarum/extend';
import HeaderSecondary from 'flarum/components/HeaderSecondary';

import ChatFrame from 'pushedx/realtime-chat/components/ChatFrame';

app.initializers.add('pushedx-realtime-chat', app => {

    let status = {
        loading: false,
        autoScroll: true,
        pusher: null,
        messages: [],
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
