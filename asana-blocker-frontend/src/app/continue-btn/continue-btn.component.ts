import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ab-continue-btn',
  templateUrl: './continue-btn.component.html',
  styleUrls: ['./continue-btn.component.scss']
})
export class ContinueBtnComponent {
  @Input() label!: string;
  @Input() disabled = false;

  @Output() click: EventEmitter<any> = new EventEmitter<any>();

}
