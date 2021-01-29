import { Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FeedStore } from 'src/modules/feed/feed.store';
import { Room } from '../../room.model';
import { RoomStore } from '../../room.store';
import { LocalStorageService } from '../../services/localStorage';
import { RoomQueries } from '../../services/room.queries';
import { RoomService } from '../../services/room.service';
import { RoomCreateModalComponent } from '../room-create-modal/room-create-modal.component';

import { RoomSocketService } from '../../services/room.socket.service';
@Component({
  selector: 'app-room-menu',
  templateUrl: './room-menu.component.html',
  styleUrls: ['./room-menu.component.less']
})
export class RoomMenuComponent implements OnInit {
  @ViewChild("modal")
  modal: RoomCreateModalComponent

  roomId$: Observable<string | undefined>;

  rooms: Room[];

  constructor(private feedStore: FeedStore, 
    private queries: RoomQueries, 
    private roomService: RoomService, 
    private router: Router, 
    private fb: FormBuilder, 
    private localStorageService: LocalStorageService,
    private roomSocketService: RoomSocketService) {
    this.roomId$ = feedStore.roomId$;
    this.rooms = [];
  }

  async ngOnInit() {
    await this.getRoom();
    this.roomService.refreshRoomMenu$.subscribe( async ( shouldFetch: boolean ) => {
      await this.getRoom();
    });

    let room = this.localStorageService.get('room_id');
    if(room != null) {
      this.goToRoom(room);
    }
  }

  async getRoom() {
    this.rooms =  await this.queries.getAll()
  }

  goToRoom(room: Room) {
    this.router.navigate(['/app/' + room.id])
    this.localStorageService.set('room_id', room)
  }

  createRoom() {
   this.modal.open()
  }

  async refreshRoomHandler() {
    this.rooms = await this.queries.getAll();
  }
}
