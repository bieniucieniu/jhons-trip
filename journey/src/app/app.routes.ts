import { Routes } from "@angular/router"
import { AddJourneyComponent } from "./components/add-journey/add-journey.component"
import { BookingComponent } from "./components/booking/booking.component"

export const routes: Routes = [
  {
    path: "",
    component: BookingComponent,
  },

  {
    path: "add",
    component: AddJourneyComponent,
  },
]
