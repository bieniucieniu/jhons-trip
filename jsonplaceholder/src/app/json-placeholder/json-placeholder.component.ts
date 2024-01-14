import { HttpClientModule } from "@angular/common/http"
import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink } from "@angular/router"

@Component({
  selector: "app-json-placeholder",
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterLink],
  templateUrl: "./json-placeholder.component.html",
  styleUrl: "./json-placeholder.component.scss",
})
export class JsonPlaceholderComponent {}
