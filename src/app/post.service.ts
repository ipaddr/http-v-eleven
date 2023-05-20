import {Injectable} from '@angular/core'
import {HttpClient, HttpHeaders, HttpParams, HttpEventType} from '@angular/common/http'
import {Post} from './post.model'
import {map, catchError, tap} from 'rxjs/operators'
import {Subject, throwError} from 'rxjs';

@Injectable({providedIn: 'root'})
export class PostService{

    endPointURL:string = 'https://nama-project-saya-default-rtdb.asia-southeast1.firebasedatabase.app/';
    postURL: string = this.endPointURL+'post.json';

    errorHandling = new Subject<any>();

    constructor(private http: HttpClient){}

    // for posting data
    createAndPost(postData: Post){
        this.http.post<{name : string}>(this.postURL, postData, {
            observe: 'response', // default is body 
            responseType: 'json'
        })
        .subscribe(
            (data) => {
              console.log(data);
              this.errorHandling.next(null);
            },
            (error) => {
                this.errorHandling.next(error);
            }
          );
    }

    // for fetching data
    fetchPosts(){
        let customParam = new HttpParams();
        customParam = customParam.append('print', 'pretty');
        customParam = customParam.append('custom-param', 'custom-param-value');
        return this.http.get<{[key: string] : Post}>(this.postURL, {
            headers: new HttpHeaders({
                'custom-header' : 'hello from custom header'
            }),
            params: customParam,
            responseType: 'json'
        })
        .pipe(
            map( responseData => {
                const postArray: Post[] = [];
                for(const key in responseData){
                if(responseData.hasOwnProperty(key)){
                    postArray.push({...responseData[key], id: key})
                }
                }
                return postArray;
            }),
            catchError(
                errorRes => {
                    return throwError(errorRes);
                }
            )
        );
    }

    // for update data
    updatePost(postData: Post){
        const data = { [postData.id] : {
            title: postData.title,
            content: postData.content
        }};
        return this.http.put(this.postURL, data);
    }

    // for deleting data
    deletePosts(){
        return this.http.delete(this.postURL, {
            observe: 'events'
        }).pipe(
            tap(
                event => {
                    console.log(event);
                    if(event.type === HttpEventType.Sent){

                    }

                    if(event.type === HttpEventType.Response){
                        console.log(event.body)
                    }
                }
            )
        );
    }

}