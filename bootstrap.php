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

namespace PushEDX\Chat;

//use Flagrow\ImageUpload\Providers\StorageServiceProvider;
use Flarum\Foundation\Application;
use Illuminate\Contracts\Events\Dispatcher;


return function (Dispatcher $events, Application $app) {

    // register the event listeners
    $events->subscribe(Listeners\AddClientAssets::class);
    // add attributes to API
    //$events->subscribe(Listeners\LoadSettingsFromDatabase::class);
    // registers the API endpoint and the permission send to the API
    $events->subscribe(Listeners\AddChatApi::class);

    // register the service provider
    //$app->register(StorageServiceProvider::class);
};
