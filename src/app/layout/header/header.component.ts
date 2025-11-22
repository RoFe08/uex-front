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

  nerdMode = false;

  constructor(private authService: AuthService) {}

  toggleNerdMode() {
    this.nerdMode = !this.nerdMode;

    if (this.nerdMode) {
      document.body.classList.add('nerd-mode');
      document.querySelectorAll('.mdc-button__label').forEach(icon => {
        icon.setAttribute('style', 'color: white;');
      });
    } else {
      document.body.classList.remove('nerd-mode');
    }
  }

  logout() {
    this.authService.logout();
  }
}
