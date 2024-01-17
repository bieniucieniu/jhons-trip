import { HttpClient } from "@angular/common/http"
import { Component } from "@angular/core"
import { Journey } from "../../journey"
import { CommonModule } from "@angular/common"
import { JourneyComponent } from "../journey/journey.component"
import { v4 as uuidv4 } from "uuid"

@Component({
  selector: "app-journeys",
  standalone: true,
  imports: [CommonModule, JourneyComponent],
  templateUrl: "./journeys.component.html",
  styleUrl: "./journeys.component.scss",
})
export class JourneysComponent {
  constructor(private http: HttpClient) {}
  journeys: Journey[] | undefined = undefined
  booking: string = ""

  ngOnInit() {
    this.getJourneys().subscribe((data) => {
      this.journeys = data.journeys.map((e) => ({
        ...e,
        id: uuidv4(),
        booked: 0,
      }))
    })
  }

  book(param: { id: string; num: number }) {
    if (param.num <= 0) return
    if (!this.journeys || this.journeys.length <= 0) return

    const journey = this.journeys?.find((e) => e.id === param.id)
    if (!journey) return

    if (journey.maxPeople >= journey.booked + param.num) {
      journey.booked += param.num

      this.journeys = this.journeys.map((e) => {
        if (e.id === param.id) return journey
        return e
      })
    }
  }

  delateJourney(param: { id: string }) {
    if (!this.journeys || this.journeys.length <= 0) return
    this.journeys = this.journeys.filter((e) => {
      if (e.id === param.id) return false
      return true
    })
  }

  getJourneys() {
    return this.http.get<{ journeys: Journey[] }>(`../assets/data.json`)
  }
}
