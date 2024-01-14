import { HttpClient } from "@angular/common/http"
import { Component } from "@angular/core"
import { Journey } from "../../journey"
import { CommonModule } from "@angular/common"
import { JourneyComponent } from "../journey/journey.component"

@Component({
  selector: "app-journeys",
  standalone: true,
  imports: [CommonModule, JourneyComponent],
  templateUrl: "./journeys.component.html",
  styleUrl: "./journeys.component.scss",
})
export class JourneysComponent {
  constructor(private http: HttpClient) {}
  journeys: Journey[] = []

  ngOnInit() {
    this.getJourneys().subscribe((data) => {
      this.journeys = data
    })
  }

  getJourneys() {
    return this.http.get<Journey[]>(`../assets/trips.json`)
  }
}
