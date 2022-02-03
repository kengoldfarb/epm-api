import {
	ETwitterStreamEvent,
	TweetStream,
	TweetV2SingleStreamResult,
	TwitterApi
} from 'twitter-api-v2'

export default class TwitterListener {
	private stream!: TweetStream<TweetV2SingleStreamResult>

	public async start() {
		this.setupListners()
			.then(() => {})
			.catch(e => {
				log.crit(e)
			})
	}

	private async setupListners() {
		const client = new TwitterApi(config.TWITTER_BEARER_TOKEN)
		try {
			await services.twitter.checkForMissedTweets()
			this.stream = await client.v2.searchStream({
				'tweet.fields': ['created_at', 'entities'],
				'user.fields': ['profile_image_url'],
				expansions: ['author_id', 'in_reply_to_user_id', 'referenced_tweets.id']
			})

			// Awaits for a tweet
			this.stream.on(
				// Emitted when Node.js {response} emits a 'error' event (contains its payload).
				ETwitterStreamEvent.ConnectionError,
				err => log.crit('Tweet stream connection error!', err)
			)

			this.stream.on(
				// Emitted when Node.js {response} is closed by remote or using .close().
				ETwitterStreamEvent.ConnectionClosed,
				() => log.crit('Tweet stream connection has been closed.')
			)

			this.stream.on(
				// Emitted when a Twitter payload (a tweet or not, given the endpoint).
				ETwitterStreamEvent.Data,
				async eventData => {
					try {
						services.twitter.mintAndStoreTweet(
							eventData.data,
							eventData.includes
						)
					} catch (err) {
						log.crit('Error minting tweet.', err)
					}
				}
			)

			this.stream.on(
				// Emitted when a Twitter sent a signal to maintain connection active
				ETwitterStreamEvent.DataKeepAlive,
				() => log.trace('Tweet stream sent a keep-alive packet.')
			)

			// Enable reconnect feature
			this.stream.autoReconnect = true
			this.stream.autoReconnectRetries = Infinity

			log.info('Twitter listeners set up')
		} catch (e) {
			log.crit('Error connecting to Twitter stream', e)
			throw new Error('Error connecting to Twitter stream')
		}
	}
}
