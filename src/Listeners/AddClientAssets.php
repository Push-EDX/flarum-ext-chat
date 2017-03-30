<?php
/*
 * This file is part of push-edx/flarum-ext-restricted-reply.
 *
 * Copyright (c) gpascualg.
 *
 * http://pushedx.net
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace PushEDX\Chat\Listeners;

use DirectoryIterator;
use Flarum\Event\ConfigureWebApp;
use Flarum\Event\ConfigureLocales;
use Illuminate\Contracts\Events\Dispatcher;

class AddClientAssets
{

    /**
    * Subscribes to the Flarum events.
    *
    * @param Dispatcher $events
    */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureWebApp::class, [$this, 'addForumAssets']);
        $events->listen(ConfigureWebApp::class, [$this, 'addAdminAssets']);
        $events->listen(ConfigureLocales::class, [$this, 'addLocales']);
    }

    /**
    * Modifies the client view for the Forum.
    *
    * @param ConfigureWebApp $event
    */
    public function addForumAssets(ConfigureWebApp $event)
    {
        if ($event->isForum()) {
            $event->addAssets([
                __DIR__ . '/../../less/forum/chat.less',
                __DIR__ . '/../../js/forum/dist/extension.js'
            ]);
            $event->addBootstrapper('pushedx/realtime-chat/main');
        }
    }

    /**
    * Modifies the client view for the Admin.
    *
    * @param ConfigureWebApp $event
    */
    public function addAdminAssets(ConfigureWebApp $event)
    {
        if ($event->isAdmin()) {
            $event->addAssets([
                __DIR__ . '/../../less/admin/settingsPage.less',
                __DIR__ . '/../../js/admin/dist/extension.js'
            ]);
            $event->addBootstrapper('pushedx/realtime-chat/main');
        }
    }

    /**
    * Provides i18n files.
    *
    * @param ConfigureLocales $event
    */
    public function addLocales(ConfigureLocales $event)
    {
        foreach (new DirectoryIterator(__DIR__.'/../../locale') as $file) {
            if ($file->isFile() && $file->getExtension() === 'yaml') {
                $event->locales->addTranslations($file->getBasename('.'.$file->getExtension()), $file->getPathname());
            }
        }
    }
}
