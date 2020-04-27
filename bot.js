webhookUrl = 'https:///';
    $this->token = '4b67069bfd27d211-2a1f1e8d9dd2e232-4c86d8a13012654c';
    $this->name = 'metyuriti';
    $this->avatar = 'https:///path/to/avatar.png';

    public function action_setup()
    {
        $this->webhookUrl .= 'viber/bot';

        try {
            $client = new Client([ 'token' => $this->token ]);
            $result = $client->setWebhook($this->webhookUrl);
            echo 'Success!';
        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }
    
    public function action_bot() {

        $botSender = new Sender([
            'name' => $this->name,
            'avatar' => $this->avatar,
        ]);

        try {
            $bot = new Bot(['token' => $this->token]);
            $bot->onSubscribe(function ($event) use ($bot, $botSender) {
                // Пользователь подписался на чат
                $receiverId = $event->getSender()->getId();
                $bot->getClient()->sendMessage(
                    (new \Viber\Api\Message\Text())
                        ->setSender($botSender)
                        ->setReceiver($receiverId)
                        ->setText('Thank you for subscribe!');
                );
            })
            ->onConversation(function ($event) use ($bot, $botSender) {
                // Пользователь вошел в чат
                // Разрешается написать только одно сообщение
                $receiverId = $event->getSender()->getId();
                $bot->getClient()->sendMessage(
                    (new \Viber\Api\Message\Text())
                        ->setSender($botSender)
                        ->setReceiver($receiverId)
                        ->setText('Welcome!');
                );
            })
            ->onText('|Hello|si', function ($event) use ($bot, $botSender) {
                // Напечатали 'Hello'
                $receiverId = $event->getSender()->getId();
                $user = $event->getSender()->getName();
                $answer = 'Hello, ' . $user;
                
                $bot->getClient()->sendMessage(
                    (new \Viber\Api\Message\Text())
                        ->setSender($botSender)
                        ->setReceiver($receiverId)
                        ->setText($answer);
                );
            })
            ->run();
        } catch (Exception $e) {
            Log::instance()->add(Log::ERROR, $e->getMessage());
        }
    }
}
