import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoomType } from '../../room.model';
import { RoomService } from '../../services/room.service';

export class CreateRoomFormModel {
  name: string = "";
  type: RoomType = RoomType.Text;
}

@Component({
  selector: 'app-room-create-modal',
  templateUrl: './room-create-modal.component.html',
  styleUrls: ['./room-create-modal.component.less']
})
export class RoomCreateModalComponent implements OnInit {
  createRoom: FormGroup;

  isVisible: boolean = false;
  model = new CreateRoomFormModel();
  constructor(private roomService: RoomService, private fb: FormBuilder) {
    this.createRoom = this.fb.group({
      selector: [''],
      name: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    
  }

  async onOk() {
    console.log(event)
    for (const i in this.createRoom.controls) {
      this.createRoom.controls[i].markAsDirty();
      this.createRoom.controls[i].updateValueAndValidity();
    }
    if (this.createRoom.valid) {
      const rep = await this.roomService.create(
        this.createRoom.get("name")!.value,
        this.createRoom.get("selector")!.value
      )
      this.close();
      this.roomService.setRefreshRoomMenu(true)      
    }
  }

  onCancel() {
    this.close();
  }

  open() {
    this.isVisible = true;
    this.createRoom.reset(new CreateRoomFormModel());
  }

  close() {
    this.isVisible = false;
  }
}
