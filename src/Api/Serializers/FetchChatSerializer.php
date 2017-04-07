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

namespace PushEDX\Chat\Api\Serializers;

use Flarum\Api\Serializer\AbstractSerializer;

class FetchChatSerializer extends AbstractSerializer
{

    /**
     * @var string
     */
    protected $type = 'chat';

    /**
     * Get the default set of serialized attributes for a model.
     *
     * @param object|array $model
     * @return array
     */
    protected function getDefaultAttributes($model)
    {
        $ret = ['messages' => []];

        foreach ($model->msgs as $msg) {
            $ret['messages'][] = $msg;
        }

        return $ret;
    }
}
