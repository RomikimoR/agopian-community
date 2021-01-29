import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { FeedStore } from 'src/modules/feed/feed.store';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-room-page',
  templateUrl: './room-page.component.html',
  styleUrls: ['./room-page.component.less']
})
export class RoomPageComponent implements OnInit , OnDestroy{
  roomId$: Observable<string>;
  sub?: Subscription;

  constructor(private router: Router, private route: ActivatedRoute, private feedStore: FeedStore) {

  }

  ngOnInit(): void {
    console.log(this.feedStore.value.roomId)
    if(!this.feedStore.value.roomId) {
      this.router.navigate(['/app/default'])
    }
    this.roomId$ = this.route.params.pipe(map(p => p.roomId));
    this.sub = this.roomId$.subscribe({
      next: (roomId) => {
        this.feedStore.mutate(s => {
          return {
            ...s,
            roomId
          }
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
