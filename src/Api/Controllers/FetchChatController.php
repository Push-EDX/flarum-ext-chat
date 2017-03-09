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

    static public function GetMessages($db, $id)
    {
        if ($id == -1)
        {
            $stmt = $db->prepare('SELECT id, actorId, message FROM posts ORDER BY id DESC LIMIT 20;');
            $result = $stmt->execute();
        }
        else
        {
            $stmt = $db->prepare('SELECT id, actorId, message FROM posts WHERE id < :id ORDER BY id DESC LIMIT 20;');
            $result = $stmt->execute(['id' => $id]);
        }

        $stmt->setFetchMode(PDO::FETCH_ASSOC);

        $msgs = new \stdClass();
        $msgs->messages = [];
        while ($row = $stmt->fetch())
        {
            array_unshift($msgs->messages, $row);
        }

        return $msgs;
    }

    static public function UpdateMessages($msg)
    {
        $db = FetchChatController::GetDB();

        $db->beginTransaction();
        $stmt = $db->prepare('INSERT INTO posts (actorId, message) VALUES (?, ?);');
        $stmt->execute([$msg['actorId'], $msg['message']]);
        $id = $db->lastInsertId();
        $db->commit();

        return $id;
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
        $id = $request->getParsedBody()['id'];
        $msgs = FetchChatController::GetMessages(FetchChatController::GetDB(), $id);

        return $this->bus->dispatch(
            new FetchChat($msgs)
        );
    }
}
