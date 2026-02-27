import { Component, inject } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.scss'],
  imports: [],
})
export class PropertyDetailsComponent {
  private readonly ref = inject(DynamicDialogRef);

  closeDialog(isConfirmed: boolean = false) {
    this.ref.close({ confirmed: isConfirmed });
  }
}
