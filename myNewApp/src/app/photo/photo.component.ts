import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PhotoService } from '../photo.service';

@Component({
    selector: 'app-photo',
    templateUrl: './photo.component.html',
    styleUrls: ['./photo.component.css']
})
export class PhotoComponent implements OnInit {

    @Input() photo;

    @Input() baseUrl;

    @Output() deletedPhoto = new EventEmitter<string>();

    @Output() upvotedEvent = new EventEmitter<string>();
    
    votes:number = 0;

    constructor() {
        
    }

    upvote(title):void{
        this.votes+=1;
        this.upvotedEvent.emit(title);
    }
    
    ngOnInit() {
        this.photo.displayUrl = this.baseUrl + this.photo.imageurl;
    }

    delete(photoId):void{
        this.deletedPhoto.emit(photoId);
    }
}