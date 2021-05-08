import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { ThrowStmt } from '@angular/compiler';

@Injectable()
export class PhotoService {

  private apiurl = environment.apiurl;
  photoUrl = environment.photourl;

  constructor(private http:HttpClient) {}

  listPhotos(){
    return this.http.get(this.apiurl + 'api/photos');
  }

  getPhoto(id){
    return this.http.get(this.apiurl + 'api/photos/' + id);
  }

  updatePhoto(id, data){
    return this.http.put(this.apiurl + 'api/photos/' + id, data);
  }

  createPhoto(photo: FormData){
    return this.http.post(this.apiurl+ 'api/photos', photo);
  }

  deletePhoto(id){
    return this.http.delete(this.apiurl + 'api/photos/'+ id);
  }
}

