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

use \PDO;
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

    static public function GetDB()
    {
        $db = new PDO('sqlite:/tmp/chatposts.db');
        $db->exec('CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                 actorId INTEGER,
                                                 message varchar(2048))');

        return $db;
    }

    static public function GetMessages($db)
    {
        $stmt = $db->prepare('SELECT actorId, message FROM posts ORDER BY id DESC LIMIT 20;');
        $result = $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_ASSOC);

        $msgs = new \stdClass();
        $msgs->messages = [];
        while ($row = $stmt->fetch())
        {
            $msgs->messages[] = $row;
        }

        return $msgs;
    }

    static public function UpdateMessages($msg)
    {
        $db = FetchChatController::GetDB();
        $stmt = $db->prepare('INSERT INTO posts (actorId, message) VALUES (?, ?);');
        $stmt->execute([$msg['actorId'], $msg['message']]);
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
        $msgs = FetchChatController::GetMessages(FetchChatController::GetDB());

        return $this->bus->dispatch(
            new FetchChat($msgs)
        );
    }
}
