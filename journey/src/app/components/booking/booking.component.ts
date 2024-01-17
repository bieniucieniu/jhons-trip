import { Component } from "@angular/core"
import { JourneysComponent } from "../journeys/journeys.component"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"

@Component({
  selector: "app-booking",
  standalone: true,
  imports: [CommonModule, JourneysComponent, RouterModule],
  templateUrl: "./booking.component.html",
  styleUrl: "./booking.component.scss",
})
export class BookingComponent {}
