<?php

/*
* This file is part of flarum-latex.
*
* (c) Matteo Pompili <matpompili@gmail.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

use Illuminate\Contracts\Events\Dispatcher;
use Flarum\Event\ConfigureClientView;
use Flarum\Event\PostWillBeSaved;
use Flarum\Api\Serializer\DiscussionBasicSerializer;

return function (Dispatcher $events) {
	
	
  $events->listen(ConfigureClientView::class, function (ConfigureClientView $event) {
    if ($event->isForum()) {
            $user_id = $event->view->getActor()->username;
		//echo $event->view->getActor();
		              $event->addAssets([
                __DIR__.'\chat.js',
				__DIR__.'\chat.less'

            ]);

		//include 'chat.php';
		
		
		
		

	
    }
  });
  /*
  * This one get every new comment, post, or answer before it is saved,
  * and check if there are latex formulas in it. If there are it adds code
  * markers so that it doesn't get processed by the Markdown extension.
  */
  
  
    $events->listen(DiscussionBasicSerializer::class, function (DiscussionBasicSerializer $event) {
	echo $event->getActor;
  });
  
  
  
  $events->listen(PostWillBeSaved::class, function (PostWillBeSaved $event) {
	  
	if($event->post->discussion->title == "chat"){
		    //Get the text from the post, comment or answer
		$text = $event->post->content;
		
		$event->post->discussion_id = -1;
		//This is the regular expresssion used. To check what it does use regex101.com
		//Run the replace and edit the post content
		$event->post->content = $event->post;
	   


		 
	}
	
	
	

  });
};
