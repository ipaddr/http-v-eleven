import {HttpInterceptor, HttpRequest, HttpHandler, HttpEventType} from '@angular/common/http'
import {tap} from 'rxjs/operators'

export class LoggingInterceptorService implements HttpInterceptor{
    intercept(req: HttpRequest<any>, fwrd: HttpHandler){
        console.log('from logging interceptor');
        console.log(req.url);
        return fwrd.handle(req).pipe(
            tap(
                event => {
                    if(event.type === HttpEventType.Response){
                        console.log(event.body)
                    }
                }
            )
        );
    }
}