import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-document-previewer',
  imports: [CommonModule],
  templateUrl: './document-previewer.html',
  styleUrl: './document-previewer.scss',
})
export class DocumentPreviewer {
@Input() docUrl: SafeResourceUrl | null = null;
  @Input() isPdf: boolean = false;
  @Input() fileName: string = 'Document Preview';
  
  @Output() onClose = new EventEmitter<void>();

  close() {
    this.onClose.emit();
  }
}
