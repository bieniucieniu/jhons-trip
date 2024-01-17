import { Component, Input, Output, EventEmitter } from "@angular/core"
import { Journey } from "../../journey"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

@Component({
  selector: "app-journey",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./journey.component.html",
  styleUrl: "./journey.component.scss",
})
export class JourneyComponent {
  @Input({ required: true }) journey!: Journey
  @Output() bookEvent = new EventEmitter<{ id: string; num: number }>()
  @Output() deleteEvent = new EventEmitter<{ id: string }>()
  open: boolean = false
  booking: boolean = false
  deleting: boolean = false

  forPeople: number = 0

  book() {
    this.bookEvent.emit({ id: this.journey.id, num: this.forPeople })
    this.booking = false
    this.forPeople = 0
  }

  delete() {
    this.deleteEvent.emit({ id: this.journey.id })
  }
  toggleOpen() {
    this.open = !this.open
  }

  toggleBooking() {
    this.booking = !this.booking
  }
  toggleDeleting() {
    this.deleting = !this.deleting
  }
}
