import { CommonModule } from '@angular/common';
import { Component, Input,} from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.html',
  styleUrls: ['./toast.scss'],
  imports: [CommonModule]
})
export class ToastComponent {
  @Input() show = false;
  @Input() message = '';
  @Input() type: 'success' | 'error' = 'success';

  get alertClass() {
    return this.type === 'success' ? 'alert-success' : 'alert-error';
  }
}
