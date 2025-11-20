import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { ContactService } from '../../../core/services/contact.service';
import { Contact } from '../../../shared/models/contact.model';
import { ContactMapComponent } from '../contact-map/contact-map.component';
import { AuthService } from '../../../core/services/auth.service';


@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ContactMapComponent
  ],
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
})
export class ContactListComponent implements OnInit {
  private contactService = inject(ContactService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService: AuthService = inject(AuthService);

  displayedColumns = ['name', 'cpf', 'phone', 'actions'];

  contacts: Contact[] = [];
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  filterForm = this.fb.group({
    term: [''],
  });

  selectedContact: Contact | null = null;
  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(page: number = this.pageIndex): void {
    const term = this.filterForm.get('term')?.value || undefined;

    this.contactService
      .getContacts(page, this.pageSize, term || undefined)
      .subscribe((pageData) => {
        this.contacts = pageData.content;
        this.totalElements = pageData.totalElements;
        this.pageIndex = pageData.page;
        this.pageSize = pageData.size;
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadContacts(event.pageIndex);
  }

  onSearch(): void {
    this.pageIndex = 0;
    this.loadContacts(0);
  }

  clearSearch(): void {
    this.filterForm.reset();
    this.pageIndex = 0;
    this.loadContacts(0);
  }

  newContact(): void {
    this.router.navigate(['/contacts/new']);
  }

  editContact(contact: Contact): void {
    this.router.navigate(['/contacts', contact.id, 'edit']);
  }

  selectContact(contact: Contact): void {
    this.selectedContact = contact;
  }

  onMarkerSelected(contactId: number): void {
    const contact = this.contacts.find((c) => c.id === contactId);
    if (contact) {
      this.selectedContact = contact;
    }
  }

  deleteContact(contact: Contact): void {
    if (!contact.id) return;
    if (!confirm(`Excluir contato "${contact.name}"?`)) return;

    this.contactService.delete(contact.id).subscribe(() => {
      this.loadContacts();
    });
  }

  onDeleteAccount(): void {
    const password = prompt('Para excluir sua conta, digite sua senha:');

    if (!password || !password.trim()) {
      return;
    }

    if (!confirm('Tem certeza que deseja excluir sua conta? Todos os seus contatos serão apagados.')) {
      return;
    }

    this.authService.deleteAccount(password).subscribe({
      next: () => {},
      error: (err) => {
        if (err.status === 401) {
          alert('Senha inválida. Conta não foi excluída.');
        } else {
          alert('Erro ao excluir conta. Tente novamente.');
        }
      }
    });
  }
}
