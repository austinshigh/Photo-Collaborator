import { Component, OnInit } from '@angular/core';
import { PhotoService } from'../photo.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

    constructor(private photoService:PhotoService){
  }

  coursename = "CSCI E31";

  numPhotos:number = 0;
  
  totalVotes:number = 0;
  mostRecentVotedOn:string = '';

  addNew:boolean = false;

  setAddMode(mode):void{
    this.addNew = (mode ? true : false);
  }

  handleUpvoted(e):void{
    console.log("app-component gets upvoted:" + e);
    this.totalVotes += 1;
    this.mostRecentVotedOn = e;
  }

  photoList = null;
  photoUrl = '';
  photo = null;

  ngOnInit(){
    this.updatePhotoList();
    this.photoUrl = this.photoService.photoUrl;
  }

  updatePhotoList():void{
    this.photoService.listPhotos().subscribe((photos)=>{
    this.photoList = photos;
    this.numPhotos = this.photoList.length;
  });
  }

}
