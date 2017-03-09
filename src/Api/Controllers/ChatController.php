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

namespace PushEDX\Chat\Api\Controllers;

use PushEDX\Chat\Api\Serializers\ChatSerializer;
use PushEDX\Chat\Commands\PostChat;
use Flarum\Api\Controller\AbstractResourceController;
use Illuminate\Contracts\Bus\Dispatcher;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class ChatController extends AbstractResourceController
{

    /**
     * The serializer instance for this request.
     *
     * @var ImageSerializer
     */
    public $serializer = ChatSerializer::class;


    /**
     * @var Dispatcher
     */
    protected $bus;

    /**
     * @param Dispatcher $bus
     */
    public function __construct(Dispatcher $bus)
    {
        $this->bus = $bus;
    }
    /**
     * Get the data to be serialized and assigned to the response document.
     *
     * @param ServerRequestInterface $request
     * @param Document               $document
     * @return mixed
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $msg = array_get($request->getParsedBody(), 'msg');
        $actor = $request->getAttribute('actor');

        return $this->bus->dispatch(
            new PostChat($msg, $actor)
        );
    }
}
