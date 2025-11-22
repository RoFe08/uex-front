import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { Contact } from '../../../shared/models/contact.model';
import { GoogleMap } from '@angular/google-maps';

interface ContactMarker {
  position: google.maps.LatLngLiteral;
  title: string;
  contactId?: number;
  isSelected?: boolean;
}

@Component({
  selector: 'app-contact-map',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule],
  templateUrl: './contact-map.component.html',
  styleUrls: ['./contact-map.component.scss'],
})
export class ContactMapComponent implements OnChanges {

  @ViewChild(GoogleMap) map!: GoogleMap;

  @Output() markerSelected = new EventEmitter<number>(); 

  @Input() contacts: Contact[] = [];
  @Input() selectedContact: Contact | null = null;
  @Input() icon = '';

  center: google.maps.LatLngLiteral = { lat: -25.4284, lng: -49.2733 };
  zoom = 12;

  markers: ContactMarker[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contacts'] || changes['selectedContact']) {
      this.buildMarkers();
      this.updateCenter();
    }
  }

  private buildMarkers(): void {
    this.markers = this.contacts
      .filter((c) => c.latitude != null && c.longitude != null)
      .map((c) => ({
        position: {
          lat: c.latitude as number,
          lng: c.longitude as number,
        },
        title: `${c.name} - ${c.city}/${c.state}`,
        contactId: c.id,
        isSelected: this.selectedContact?.id === c.id,
      }));
  }

  private updateCenter(): void {
    if (this.selectedContact?.latitude != null && this.selectedContact?.longitude != null) {
      this.center = {
        lat: this.selectedContact.latitude as number,
        lng: this.selectedContact.longitude as number,
      };
      this.zoom = 15;
      return;
    }

    if (this.markers.length > 0) {
      this.center = this.markers[0].position;
      this.zoom = 12;
      return;
    }

    this.center = { lat: -25.4284, lng: -49.2733 };
    this.zoom = 12;
  }

  markerIcon(marker: ContactMarker): google.maps.Icon | google.maps.Symbol | undefined {
    if (!marker.isSelected) return undefined;
  
    const nerdMode = document.body.classList.contains('nerd-mode');
  
    return nerdMode ? this.nerdIcon : this.defaultIcon;
  }  

  onMarkerClick(marker: ContactMarker): void {
    
    this.center = { ...marker.position };
  
    this.zoom = 17;
    
    if (marker.contactId != null) {
        this.markerSelected.emit(marker.contactId);
      }
  }

  defaultIcon: google.maps.Symbol = {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 8,
    fillColor: '#1976d2',
    fillOpacity: 1,
    strokeColor: '#ffffff',
    strokeWeight: 2,
  };
  
  nerdIcon: google.maps.Icon = {
    url: 'https://i.pinimg.com/originals/1b/99/ae/1b99ae9c671f4fe720b1af04c1ca053c.gif',
    scaledSize: new google.maps.Size(50, 50)
  };  
  
}
