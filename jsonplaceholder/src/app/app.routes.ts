import { Routes } from "@angular/router"
import { JsonPlaceholderComponent } from "./json-placeholder/json-placeholder.component"
import { PostsComponent } from "./json-placeholder/posts/posts.component"
import { PhotosComponent } from "./json-placeholder/photos/photos.component"
import { RootComponent } from "./root/root.component"

export const routes: Routes = [
  { path: "", component: RootComponent },
  { path: "json-placeholder", component: JsonPlaceholderComponent },
  { path: "json-placeholder/posts", component: PostsComponent },
  { path: "json-placeholder/photos", component: PhotosComponent },
]
