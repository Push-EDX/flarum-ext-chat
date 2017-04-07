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

use Carbon\Carbon;
use Flarum\Core\User;
use Flarum\Database\AbstractModel;

/**
 * @property int        $id
 *
 * @property string     $message
 *
 * @property int        $actorId
 * @property User       $actor
 *
 * @property Carbon     $created_at
 */
class Message extends AbstractModel
{
    protected $table = 'pushedx_messages';

    /**
     * Create a new message.
     *
     * @param string $message
     * @param int $actorId
     * @param Carbon $created_at
     */
    public static function build($message, $actorId, $created_at)
    {
        $msg = new static;

        $msg->message = $message;
        $msg->actorId = $actorId;
        $msg->created_at = $created_at;

        return $msg;
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function actor()
    {
        return $this->belongsTo(User::class, 'actorId');
    }
}
