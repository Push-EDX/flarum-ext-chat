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

use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;
use Flarum\Api\Event\Serializing;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Settings\Event\Deserializing;
use Cloudinary;

class LoadSettingsFromDatabase
{
    protected $settings;
    // this is the prefix we use in the settings table in the database
    protected $packagePrefix = 'flagrow.image-upload.';
    // those are the fields we need to get from the database
    protected $fieldsToGet = array(
        'uploadMethod',
        'imgurClientId',
        'mustResize',
        'resizeMaxWidth',
        'resizeMaxHeight'
    );

    /**
     * Gets the settings variable. Called on Object creation.
     *
     * @param SettingsRepositoryInterface $settings
     */
    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    /**
     * Subscribes to the Flarum events.
     *
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(Deserializing::class, [$this, 'addUploadMethods']);
        $events->listen(Serializing::class, [$this, 'prepareApiAttributes']);
    }

    /**
     * Get the setting values from the database and make them available
     * in the forum.
     *
     * @param Serializing $event
     */
    public function prepareApiAttributes(Serializing $event)
    {
        if ($event->isSerializer(ForumSerializer::class)) {
            foreach ($this->fieldsToGet as $field) {
                $event->attributes[$this->packagePrefix . $field] = $this->settings->get($this->packagePrefix . $field);
            }
        }
    }

    /**
     * Check for installed packages and provide the upload methods option
     * in the admin page-
     *
     * @param Deserializing $event
     */
    public function addUploadMethods(Deserializing $event)
    {
        // these are the upload methods that doesn't require external libraries
        $methods = [
            'local',
            'imgur'
        ];

        // check for Cloudinary, if present add the method
        if (class_exists(Cloudinary::class)) {
            $methods[] = 'cloudinary';
        }

        // add the methods with the relative translations
        $event->settings['flagrow.image-upload.availableUploadMethods'] = [];
        foreach ($methods as $method) {
            $event->settings['flagrow.image-upload.availableUploadMethods'][$method] = app('translator')->trans('flagrow-image-upload.admin.upload_methods.' . $method);
        }
    }
}
