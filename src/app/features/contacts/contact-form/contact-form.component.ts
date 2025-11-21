import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { ContactService } from '../../../core/services/contact.service';
import { AddressService, AddressSuggestion } from '../../../core/services/address.service';
import { Contact } from '../../../shared/models/contact.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
})
export class ContactFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private contactService = inject(ContactService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private addressService = inject(AddressService);
  private toastrService = inject(ToastrService);

  addressSuggestions: AddressSuggestion[] = [];
  loadingAddress = false;

  isEdit = false;
  contactId?: number;

  form = this.fb.group({
    name: ['', [Validators.required]],
    cpf: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    cep: ['', [Validators.required]],
    street: ['', [Validators.required]],
    number: ['', [Validators.required]],
    complement: [''],
    neighborhood: ['', [Validators.required]],
    city: ['', [Validators.required]],
    state: ['', [Validators.required]],
  });

  get name() { return this.form.get('name'); }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.contactId = +idParam;
      this.loadContact(this.contactId);
    }
  }

  loadContact(id: number): void {
    this.contactService.getById(id).subscribe((contact) => {
      this.form.patchValue(contact);
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  
    const contact: Contact = this.form.value as Contact;
    this.isEdit && this.contactId
      ? this.updateContact(contact)
      : this.createContact(contact);
  }

  private createContact(contact: Contact): void {
    this.contactService.create(contact).subscribe({
      next: () => {
        this.navigateToContactsList();
        this.toastrService.success('Contato cadastrado com sucesso.');
      },
      error: (err) => this.handleError(err, 'Erro ao cadastrar contato. Tente novamente.')
    });
  }
  
  private updateContact(contact: Contact): void {
    this.contactService.update(this.contactId!, contact).subscribe({
      next: () => {
        this.navigateToContactsList();
        this.toastrService.success('Contato atualizado com sucesso.');
      },
      error: (err) => this.handleError(err, 'Erro ao atualizar contato. Tente novamente.')
    });
  }

  private handleError(err: any, fallbackMessage: string): void {
    if (err.status === 409) {
      this.toastrService.error(err.error?.message || '');
    } else {
      alert(fallbackMessage);
    }
  }
  
  private navigateToContactsList(): void {
    this.router.navigate(['/contacts']);
  }  
  
  searchAddress(): void {
    const uf = this.form.get('state')?.value;
    const city = this.form.get('city')?.value;
    const street = this.form.get('street')?.value;

    if (!uf || !city || !street) {
      alert('Preencha UF, cidade e rua antes de buscar no ViaCEP.');
      return;
    }

    this.loadingAddress = true;
    this.addressSuggestions = [];

    this.addressService.search(uf, city, street).subscribe({
      next: (suggestions) => {
        this.loadingAddress = false;
        this.addressSuggestions = suggestions;
      },
      error: () => {
        this.loadingAddress = false;
        alert('Erro ao buscar endereços no ViaCEP.');
      },
    });
  }

  applySuggestion(suggestion: AddressSuggestion): void {
    this.form.patchValue({
      cep: suggestion.cep,
      street: suggestion.street,
      neighborhood: suggestion.neighborhood,
      city: suggestion.city,
      state: suggestion.state,
    });
  }

  onCepBlur(): void {
    const cepRaw = this.form.get('cep')?.value;

    if (!cepRaw) {
      return;
    }

    const cep = cepRaw.replace(/\D/g, '');

    if (cep.length !== 8) {
      return;
    }

    this.loadingAddress = true;

    this.addressService.findByCep(cep).subscribe({
      next: (suggestion) => {
        this.loadingAddress = false;
        if (!suggestion) {
          return;
        }

        this.form.patchValue({
          cep: suggestion.cep,
          street: suggestion.street,
          neighborhood: suggestion.neighborhood,
          city: suggestion.city,
          state: suggestion.state,
        });
      },
      error: () => {
        this.loadingAddress = false;
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/contacts']);
  }
}
