import { HttpClient, HttpClientModule, HttpHeaders } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { throwError } from "rxjs"
import { retry, catchError } from "rxjs/operators"

export type Post = {
  userId: number
  id: number
  title: string
  body: string
}
export type Photo = {
  albumId: number
  id: number
  title: string
  url: string
  thumbnailUrl: string
}

const baseUrl = "https://jsonplaceholder.typicode.com/"

@Injectable({
  providedIn: "root",
  deps: [HttpClientModule],
})
export class JsonPlacehoderService {
  constructor(private http: HttpClient) {}

  private httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json; charset=UTF-8",
    }),
  }

  getPosts() {
    return this.http
      .get<Post[]>(baseUrl + "posts/")
      .pipe(retry(1), catchError(this.handleError))
  }

  getPost(id: number) {
    return this.http
      .get<Post>(baseUrl + "posts/" + id)
      .pipe(retry(1), catchError(this.handleError))
  }

  addPost(post: Post) {
    return this.http
      .post(baseUrl + "posts/", JSON.stringify(post), this.httpOptions)
      .pipe(retry(1), catchError(this.handleError))
  }

  getPhotos() {
    return this.http
      .get<Photo[]>(baseUrl + "photos/")
      .pipe(retry(1), catchError(this.handleError))
  }

  getPhoto(id: number) {
    return this.http
      .get<Photo>(baseUrl + "photos/" + id)
      .pipe(retry(1), catchError(this.handleError))
  }
  getUsers() {
    return this.http
      .get<Photo[]>(baseUrl + "photos/")
      .pipe(retry(1), catchError(this.handleError))
  }

  getUser(id: number) {
    return this.http
      .get<Photo>(baseUrl + "photos/" + id)
      .pipe(retry(1), catchError(this.handleError))
  }

  private handleError(error: any) {
    let errorMessage = ""
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`
    }
    window.alert(errorMessage)

    return throwError(() => {
      return errorMessage
    })
  }
}
