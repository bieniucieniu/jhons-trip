import { Component } from "@angular/core"
import { RouterLink } from "@angular/router"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./root.component.html",
  styleUrl: "./root.component.scss",
})
export class RootComponent {}
