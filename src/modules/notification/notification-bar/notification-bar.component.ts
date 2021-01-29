import { Component, OnInit } from '@angular/core';
import { AnyNotification } from '../notification.model';
import { NotificationQueries } from '../services/notification.queries';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-notification-bar',
  templateUrl: './notification-bar.component.html',
  styleUrls: ['./notification-bar.component.less']
})
export class NotificationBarComponent implements OnInit {
  notifications: AnyNotification[];
  constructor(private queries: NotificationQueries, private service: NotificationService,) { }

  async ngOnInit() {
    this.notifications = await this.queries.getNotifications()
    console.log(this.notifications)
  }




}
