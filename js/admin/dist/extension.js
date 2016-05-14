'use strict';

System.register('pushedx/realtime-chat/main', ['flarum/extend', 'flarum/app', 'flarum/utils/saveSettings', 'flarum/components/PermissionGrid'], function (_export, _context) {
    var extend, app, saveSettings, PermissionGrid;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumUtilsSaveSettings) {
            saveSettings = _flarumUtilsSaveSettings.default;
        }, function (_flarumComponentsPermissionGrid) {
            PermissionGrid = _flarumComponentsPermissionGrid.default;
        }],
        execute: function () {

            app.initializers.add('pushedx-realtime-chat', function (app) {
                // add the permission option to the relative pane
                extend(PermissionGrid.prototype, 'startItems', function (items) {
                    items.add('realtimeChat', {
                        icon: 'weixin',
                        label: 'Realtime Chat',
                        permission: 'pushedx.chat.post'
                    });
                });
            });
        }
    };
});