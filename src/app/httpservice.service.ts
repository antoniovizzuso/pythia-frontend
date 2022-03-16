import { Injectable, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { formatNumber } from '@angular/common';

@Injectable({
    providedIn: 'root'
})

export class HttpService {

    rootUrl: string = "http://127.0.0.1:8080/api/";

    constructor(public http: HttpClient) {}

    // get(url: string): Observable<HttpResponse> {
    //     let response = new HttpResponse();
    //     return this.http.get<HttpResponse>(this.rootUrl + url).subscribe();
    // }

    post(url: string, content: Object): Observable<any> {
        return this.http.post(this.rootUrl + url, content);
    }

    upload (url: string, file: File): Observable<any> {
        const formData = new FormData();
        formData.append("file", file, file.name);
        return this.post(url, formData);
    }

    // uploadFiles (url: string, files: File[]): Promise<any> {
    //     return new Promise((resolve, reject) => {
    //         let formData: FormData = new FormData(),
    //             xhr: XMLHttpRequest = new XMLHttpRequest();
    
    //         for (let i = 0; i < files.length; i++) {
    //             formData.append("uploads[]", files[i], files[i].name);
    //         }
    
    //         xhr.onreadystatechange = () => {
    //             if (xhr.readyState === 4) {
    //                 if (xhr.status === 200) {
    //                     resolve(JSON.parse(xhr.response));
    //                 } else {
    //                     reject(xhr.response);
    //                 }
    //             }
    //         };
    
    //         xhr.open('POST', url, true);
    //         xhr.send(formData);
    //     });
    // }

}