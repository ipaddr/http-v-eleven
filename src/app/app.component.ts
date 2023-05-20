import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {Post} from './post.model';
import { PostService } from './post.service';
import { title } from 'process';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('putForm') putForm: NgForm;

  loadedPosts = [];
  showLoading = false;
  error = null;

  errorSub: Subscription;

  constructor(private postService: PostService) {}

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }

  ngOnInit() {
    this.errorSub = this.postService.errorHandling.subscribe(
      error => {
        this.error = error;
      }
    );

    this.fecthPosts();
  }

  itemClicked(postData: Post){
    console.log(postData);
    console.log(this.putForm);
    this.putForm.setValue({
      id: postData.id,
      title: postData.title,
      content: postData.content
    });
  }

  onCreatePost(postData: Post) {
    // Send Http 
    this.postService.createAndPost(postData);
  }

  onUpdatePost(postData: Post){
    console.log(postData);
    this.postService.updatePost(postData).subscribe(
      response => {
        console.log(response);
      }
    );
  }

  onFetchPosts() {
    // Send Http request
    this.fecthPosts();
  }

  onClearPosts() {
    // Send Http request
    this.showLoading = true;
    this.postService.deletePosts().subscribe(
      (data) => {
        this.showLoading = false;
        this.loadedPosts = [];
      }
    );
  }

  private fecthPosts(){
    this.showLoading = true;
    this.error = null;
    this.postService.fetchPosts()
    .subscribe(
      posts => {
        this.showLoading = false;
        this.loadedPosts = posts;
      },
      error => {
        console.log(error);
        this.error = error;
      }
    );
  }
}
