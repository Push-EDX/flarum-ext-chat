import { extend } from 'flarum/extend';
import app from 'flarum/app';
import saveSettings from 'flarum/utils/saveSettings';
import PermissionGrid from 'flarum/components/PermissionGrid';

app.initializers.add('pushedx-realtime-chat', app => {
    // add the permission option to the relative pane
    extend(PermissionGrid.prototype, 'startItems', items => {
        items.add('realtimeChat', {
            icon: 'weixin',
            label: 'Realtime Chat',
            permission: 'pushedx.chat.post'
        });
    });
});
