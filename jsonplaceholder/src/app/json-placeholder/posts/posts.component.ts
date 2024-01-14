import { CommonModule } from "@angular/common"
import { Component } from "@angular/core"
import {
  JsonPlacehoderService,
  Post,
} from "../../services/json-placehoder.service"
import { Subscription } from "rxjs"

@Component({
  selector: "app-posts",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./posts.component.html",
  styleUrl: "./posts.component.scss",
})
export class PostsComponent {
  constructor(private JsonPlaceholder: JsonPlacehoderService) {}

  limit: number = 20
  posts: Post[] = []

  loadPosts() {
    return this.JsonPlaceholder.getPosts().subscribe(
      (data) => (this.posts = data.slice(0, this.limit)),
    )
  }
  postsSub: Subscription | undefined
  ngOnInit() {
    this.postsSub = this.loadPosts()
  }
  ngOnDestroy() {
    this.postsSub?.unsubscribe()
  }
}
