import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from '../../shared/models/contact.model';

export interface ContactPage {
  content: Contact[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/contacts';

  getContacts(
    page = 0,
    size = 10,
    term?: string
  ): Observable<ContactPage> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (term && term.trim()) {
      params = params.set('term', term.trim());
    }

    return this.http.get<ContactPage>(this.baseUrl, { params });
  }

  getById(idContact: number): Observable<Contact> {
    return this.http.get<Contact>(`${this.baseUrl}/${idContact}`);
  }

  create(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(this.baseUrl, contact);
  }

  update(idContact: number, contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${this.baseUrl}/${idContact}`, contact);
  }

  delete(idContact: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${idContact}`);
  }
}
