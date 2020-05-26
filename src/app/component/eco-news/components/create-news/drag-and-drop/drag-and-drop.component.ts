import { Component, OnInit } from '@angular/core';
import { FileHandle } from '../../../models/create-news-interface';
import { CreateEcoNewsService } from '../../../services/create-eco-news.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.scss']
})
export class DragAndDropComponent implements OnInit {
  public selectedFile: File = null;
  public selectedFileUrl: string;
  private imageChangedEvent: FileHandle[];
  private isCropper: boolean = true;
  public files: FileHandle[] = [];
  public isWarning: boolean = false;
  private croppedImage: string;

  constructor(private createEcoNewsService: CreateEcoNewsService ) {}

  ngOnInit() {}

  private stopCropping(): void {
    this.files.forEach(item => {
      item.url = this.croppedImage;
    });

    this.isCropper = false;
  }

  private cancelChanges(): void {
    this.isCropper = false;
  }

  private imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64;
  }

  public filesDropped(files: FileHandle[]): void {
    this.files = files;
    this.createEcoNewsService.files = files;
    this.isCropper = true;
    this.showWarning();
    this.createEcoNewsService.isImageValid = this.isWarning;
  }

  private onFileSelected(event): void {
    this.selectedFile = <File>event.target.files[0];

    let reader: FileReader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload =this.handleFile.bind(this);

    this.createEcoNewsService.files = this.files;
  }

  private handleFile(event): void {
    let binaryString = event.target.result;
    this.selectedFileUrl = binaryString;
    this.files[0] = {url: this.selectedFileUrl, file: this.selectedFile};
    this.showWarning();
    this.createEcoNewsService.fileUrl = this.selectedFileUrl;
   }

  public showWarning(): void {
    this.files.forEach(item => {
      let imageValCondition = item.file.type === 'image/jpeg' || item.file.type === 'image/png';
      this.isWarning = !(item && imageValCondition);
    });
  }
}

