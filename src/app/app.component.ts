import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatIconModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  nerdMode = false;

  toggleNerdMode() {
    this.nerdMode = !this.nerdMode;

    if (this.nerdMode) {
      document.body.classList.add('nerd-mode');
    } else {
      document.body.classList.remove('nerd-mode');
    }
  }

}