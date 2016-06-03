<?php
/*
 * This file is part of flagrow/flarum-ext-image-upload.
 *
 * Copyright (c) Flagrow.
 *
 * http://flagrow.github.io
 *
 * For the full copyright and license information, please view the license.md
 * file that was distributed with this source code.
 */

namespace PushEDX\Chat\Commands;

use Flarum\Core\User;

class FetchChat
{
    /**
     * The chat message
     *
     * @var array
     */
    public $msgs;

    public $id = "asd";

    /**
     * @var string
     */
    protected $type = 'chat';

    /**
     * @param int                          $postId The ID of the post to upload the image for.
     * @param UploadedFileInterface|string $file   The avatar file to upload.
     * @param User                         $actor  The user performing the action.
     */
    public function __construct(/*\array*/ $msgs)
    {
        $this->msgs = $msgs;
    }
}
