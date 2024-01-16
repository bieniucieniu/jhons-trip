import { Component, Input } from "@angular/core"
import { Journey } from "../../journey"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-journey",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./journey.component.html",
  styleUrl: "./journey.component.scss",
})
export class JourneyComponent {
  @Input() journey!: Journey
  open: boolean = false

  toggleOpen() {
    this.open = !this.open
  }
}
