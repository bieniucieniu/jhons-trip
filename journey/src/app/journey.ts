export interface Journey {
  id: string
  name: string
  country: string
  city: string
  start: number // timestamp
  end: number // timestamp
  price: number
  maxPeople: number
  description: string
  img: string
  booked: number
}
