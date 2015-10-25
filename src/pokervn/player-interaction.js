const rx = require('rx');
const _ = require('underscore-plus');

class PlayerInteraction {

	/*
	* Public: Poll players that want to join the game during a specified period
  	* of time.
  	*
  	* messages - An {Observable} representing new messages sent to the channel
  	* channel - The {Channel} object, used for posting messages
  	* scheduler - (Optional) The scheduler to use for timing events
  	* timeout - (Optional) The amount of time to conduct polling, in seconds
  	* maxPlayers - (Optional) The maximum number of players to allow
  	*
  	* Returns an {Observable} that will `onNext` for each player that joins and
  	* `onCompleted` when time expires or the max number of players join.
  	*/
	static pollPotentialPlayers(messages, channel, scheduler=rx.Scheduler.timeout, timeout=30, maxPlayers=10) {
		let formatMessage = t => `Who wants to play Black Jack? Respond with 'yes' in this channel in next ${t} seconds.`;
		let timeExpired = PlayerInteraction.postMessageWithTimeout(channel, formatMessage, scheduler, timeout);

		// Check messages contains the word 'yes' and map them to a unique user ID, check with maxPlayers
		let newPlayers = messages.where(m => m.text && m.text.toLowerCase().match(/\byes\b/))
								 .map(m => m.user)
								 .distinct()
								 .take(maxPlayers)
								 .publish();

		newPlayers.connect();
		timeExpired.connect();

		// Once timer has expired, not allow accept new players
		return newPlayers.takeUntil(timeExpired);

	}

	/*
	* Public: Poll a specific player to take a poker action, within a timeout.
  	*
  	* messages - An {Observable} representing new messages sent to the channel
  	* channel - The {Channel} object, used for posting messages
  	* player - The player being polled
  	* previousActions - A map of players to their most recent action
  	* scheduler - (Optional) The scheduler to use for timing events
  	* timeout - (Optional) The amount of time to conduct polling, in seconds
  	*
  	* Returns an {Observable} indicating the action the player took. If time
  	* expires, a 'timeout' action is returned.
  	*/
	static getActionForPlayer(messages, channel, player, previousActions,
						scheduler = rx.Scheduler.timeout, timeout = 30) {

	}

	/*
	* Private: Posts a message to the channel with some timeout, that edits
  	* itself each second to provide a countdown.
  	*
  	* channel - The channel to post in
  	* formatMessage - A function that will be invoked once per second with the
  	*                 remaining time, and returns the formatted message content
  	* scheduler - The scheduler to use for timing events
  	* timeout - The duration of the message, in seconds
  	*
  	* Returns an {Observable} sequence that signals expiration of the message
	*/
	static postMessageWithTimeout(channel, formatMessage, scheduler, timeout) {
		let timeoutMessage = channel.send(formatMessage(timeout));

		let timeExpired = rx.Observable.timer(0, 1000, scheduler)
							.take(timeout + 1)
							.do((x) => timeoutMessage.updateMessage(formatMessage(`${timeout - x}`)))
							.publishLast();

		return timeExpired;

	}

}

module.exports = PlayerInteraction;