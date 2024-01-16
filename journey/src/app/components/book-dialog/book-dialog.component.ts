import { CommonModule } from "@angular/common"
import { Component, EventEmitter, Input, Output } from "@angular/core"
import { FormsModule } from "@angular/forms"
@Component({
  selector: "app-book-dialog",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./book-dialog.component.html",
  styleUrl: "./book-dialog.component.scss",
})
export class BookDialogComponent {
  @Output() bookEvent = new EventEmitter<{ id: string; num: number }>()

  @Input({ required: true }) booking!: string
}
