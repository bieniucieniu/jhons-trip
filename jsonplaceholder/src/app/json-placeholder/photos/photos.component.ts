import { Component } from "@angular/core"
import {
  JsonPlacehoderService,
  Photo,
} from "../../services/json-placehoder.service"
import { Subscription } from "rxjs"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-photos",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./photos.component.html",
  styleUrl: "./photos.component.scss",
})
export class PhotosComponent {
  constructor(private JsonPlaceholder: JsonPlacehoderService) {}

  limit: number = 20
  photos: Photo[] = []

  loadPhotos() {
    return this.JsonPlaceholder.getPhotos().subscribe(
      (data) => (this.photos = data.slice(0, this.limit)),
    )
  }
  photosSub: Subscription | undefined
  ngOnInit() {
    this.photosSub = this.loadPhotos()
  }
  ngOnDestroy() {
    this.photosSub?.unsubscribe()
  }
}
