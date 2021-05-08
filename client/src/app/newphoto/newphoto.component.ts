import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PhotoService } from '../photo.service';

@Component({
  selector: 'app-newphoto',
  templateUrl: './newphoto.component.html',
  styleUrls: ['./newphoto.component.css']
})
export class NewphotoComponent implements OnInit {


  @Output() newPhoto = new EventEmitter();

  photo:any = {};

  fileInputField:string = "";

  fileToUpload: File = null;
  handleFileInput(files):void{
    this.fileToUpload = files.item(0);
  }

  constructor(private photoService:PhotoService) { }

    // called onSubmit
    save(newPhotoForm) : void {
    // since we have file upload, we'll use FormData here rather than JSON
    let formData = new FormData();
    formData.append('image', this.fileToUpload, this.fileToUpload.name);
    formData.append('title', this.photo.title);
    formData.append('description', this.photo.description);

    this.photoService.createPhoto(formData)
      .subscribe((photo)=>{
        console.log(photo);
        this.newPhoto.emit();
        newPhotoForm.reset();
        //this.fileInputField.value="";
   });
  }

  ngOnInit() {
  }

}
