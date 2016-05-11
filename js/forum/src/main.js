import { extend } from 'flarum/extend';
import IndexPage from 'flarum/components/IndexPage';

import ChatFrame from 'pushedx/realtime-chat/components/ChatFrame';

app.initializers.add('pushedx-realtime-chat', app => {
    /**
     * Add the upload button to the post composer.
     */
    extend(IndexPage.prototype, 'viewItems', function(items)
    {
        let chatFrame = new ChatFrame;
        items.add('pushedx-chat-frame', chatFrame)
    });
});
