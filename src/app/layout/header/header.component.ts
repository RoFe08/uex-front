import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [MatIconModule]
})
export class HeaderComponent {

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
