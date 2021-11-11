import { EventSource } from '../api.shared'

export namespace UnubscribeAck {
	export const eventSource = EventSource.Server

	export interface ISubscribePayload {}

	export interface IEventPayload {
		// @ts-ignore
		events: SubscribeType[]
	}
}
