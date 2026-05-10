
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';

@singleton()
export class EventEmitterService extends EventEmitter { }