import { Component, EventEmitter, Output } from "@angular/core"
import { FormBuilder, ReactiveFormsModule } from "@angular/forms"
import { Journey } from "../../journey"
import { v4 } from "uuid"
interface FormData extends Omit<Journey, "id" | "booked" | "start" | "end"> {
  start: string
  end: string
}

@Component({
  selector: "app-add-journey",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./add-journey.component.html",
  styleUrl: "./add-journey.component.scss",
})
export class AddJourneyComponent {
  constructor(private formBuilder: FormBuilder) {}
  @Output() submitEvent = new EventEmitter<Journey>()
  error: string = ""
  newJourneyContrills = this.formBuilder.group<FormData>({
    name: "",
    country: "",
    city: "",
    start: "",
    end: "",
    price: 0,
    maxPeople: 0,
    description: "",
    img: "",
  })

  onSubmit() {
    if (!this.newJourneyContrills.valid) return
    const value = this.newJourneyContrills.value
    this.error = ""
    const validValues: Journey = {
      id: v4(),
      name: "",
      country: "",
      city: "",
      start: 0,
      end: 0,
      price: 0,
      maxPeople: 0,
      description: "",
      img: "",
      booked: 0,
    }
    if (typeof value.name === "string" && value.name !== "") {
      validValues.name = value.name
    } else {
      this.error = "invalid name"
      return
    }
    if (typeof value.country === "string" && value.country !== "") {
      validValues.country = value.country
    } else {
      this.error = "invalid country"
      return
    }
    if (typeof value.city === "string" && value.city !== "") {
      validValues.city = value.city
    } else {
      this.error = "invalid city"
      return
    }
    if (typeof value.start === "string" && value.start !== "") {
      validValues.start = new Date(value.start).getTime()
    } else {
      this.error = "invalid start date"
      return
    }
    if (typeof value.end === "string" && value.end !== "") {
      validValues.end = new Date(value.end).getTime()
    } else {
      this.error = "invalid end date"
      return
    }
    if (value.start > value.end) {
      this.error = "start > end date"
      return
    }
    if (typeof value.price === "number" && value.price > 0) {
      validValues.price = value.price
    } else {
      this.error = "invalid price"
      return
    }
    if (typeof value.maxPeople === "number" && value.maxPeople > 0) {
      validValues.maxPeople = value.maxPeople
    } else {
      this.error = "invalid max people"
      return
    }
    if (typeof value.description === "string" && value.description !== "") {
      validValues.description = value.description
    } else {
      this.error = "invalid description"
      return
    }
    if (typeof value.img === "string" && value.img !== "") {
      try {
        new URL(value.img)
        validValues.img = value.img
      } catch {
        this.error = "invalid img url"
        return
      }
    } else {
      this.error = "invalid img url"
      return
    }

    this.submitEvent.emit(validValues)
    this.newJourneyContrills.reset()
  }
}
