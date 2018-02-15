import { Component, Input, Output, EventEmitter  } from '@angular/core';

/**
 * Generated class for the MessageScreenComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'message-screen',
  templateUrl: 'message-screen.html'
})
export class MessageScreenComponent {

  @Input('arrayData') arrayData: any[] = [];
  @Input('title') title: string = '';
  @Input('showEdit') showEdit: boolean = true;
  @Output('') addMessage: EventEmitter<{}> = new EventEmitter();
  @Output('') removeItem: EventEmitter<{}> = new EventEmitter();
  @Output('') dismiss: EventEmitter<{}> = new EventEmitter();

  constructor() {
  }

	// dismiss
	dismissView(): void {
		this.dismiss.emit();
	}

	removeItemFromList(post: any): void{
		this.removeItem.emit(post);
	}

  showAddMessenger(): void {
    this.addMessage.emit();
  }

}
