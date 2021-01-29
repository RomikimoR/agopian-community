import { NotificationService } from 'src/modules/notification/services/notification.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthenticationStore } from 'src/modules/authentication/authentication.store';
import { WebsocketConnection } from 'src/modules/common/WebsocketConnection';
import { NotificationSocketService } from 'src/modules/notification/services/notification.socket.service';
import { NotificationStore } from 'src/modules/notification/notification.store';
import { AnyNotification } from 'src/modules/notification/notification.model';
import { NzNotificationService } from 'ng-zorro-antd/notification'

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.less']
})
export class AppLayoutComponent implements OnInit, OnDestroy {
  sub?: Subscription;

  showDrawer: boolean = false;
  constructor(
    private service: NotificationService, 
    private socket: WebsocketConnection, 
    private authStore: AuthenticationStore,
    private notificationSocketService: NotificationSocketService,
    private notificationStore: NotificationStore,
    private nzNotification: NzNotificationService) {
  }

  ngOnInit(): void {
    this.sub = this.authStore.accessToken$.subscribe(accessToken => {
      if (accessToken) {
        this.socket.connect(accessToken);
      } else {
        this.socket.disconnect();
      }
    });
    this.notificationSocketService.onNewNotification( async (notif) => {
      await this.service.fetch();
      this.notificationStore.appendNotification( notif );
      this.newNotif( notif );
    } );

  }

  newNotif(notification: AnyNotification) {
    if( notification.subject === "new_user" ) {
      this.nzNotification.info('New user', `${notification.payload.user.username}`);
    } else if( notification.subject === "post_liked" ) {
      this.nzNotification.info('New like by', `${notification.payload.user.username} on : ${notification.payload.preview}`);
    } else {
      this.nzNotification.info('User', `${notification.payload.user.username} Create a new room : ${notification.payload.room.name}`);
    }
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
  onToggleNotifications() {
    this.showDrawer = !this.showDrawer
    if(!this.showDrawer){
      this.service.markAsViewed()
    }
    
  }
}
