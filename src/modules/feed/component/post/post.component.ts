import { Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Post } from '../../post.model';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.less']
})
export class PostComponent implements OnInit, AfterViewInit {
  @Input()
  post: Post;

  @ViewChild("anchor")
  anchor: ElementRef<HTMLDivElement>;

  constructor(
    private postService: PostService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.anchor.nativeElement.scrollIntoView();
  }

  async like() {
    await this.postService.like(this.post)
  }

  get colorMention() {
    let txt = this.post.message.text.content
    const mentionRegex = /@([^ ]*)+/g
    
    let out = txt.replace(mentionRegex, '<div inline=true; style="color: green;display: inline;">$&</div>')
    return this.sanitizer.bypassSecurityTrustHtml(out) ;
  }
}
