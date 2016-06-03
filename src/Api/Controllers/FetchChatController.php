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

namespace PushEDX\Chat\Api\Controllers;

use PushEDX\Chat\Api\Serializers\FetchChatSerializer;
use PushEDX\Chat\Commands\FetchChat;
use Flarum\Api\Controller\AbstractResourceController;
use Illuminate\Contracts\Bus\Dispatcher;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class FetchChatController extends AbstractResourceController
{

    /**
     * The serializer instance for this request.
     *
     * @var ImageSerializer
     */
    public $serializer = FetchChatSerializer::class;


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

    static public function GetMessages($synchro)
    {
        $msgs = $synchro->messages;

        if (!$msgs)
        {
            $msgs = new \stdClass();
            $msgs->messages = [];
        }

        return $msgs;
    }

    static public function UpdateMessages($msg)
    {
        $synchro = new Synchro("/tmp/chatposts.sync");
        $msgs = FetchChatController::GetMessages($synchro);
        $keep = array_slice($msgs->messages, -9);
        $keep[] = $msg;
        $synchro->messages = ["messages" => $keep];
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
        $synchro = new Synchro("/tmp/chatposts.sync");
        $msgs = FetchChatController::GetMessages($synchro);

        return $this->bus->dispatch(
            new FetchChat($msgs)
        );
    }
}
