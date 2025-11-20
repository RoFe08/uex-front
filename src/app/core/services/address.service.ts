import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AddressSuggestion {
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

@Injectable({ providedIn: 'root' })
export class AddressService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/address';

  search(uf: string, city: string, street: string): Observable<AddressSuggestion[]> {
    let params = new HttpParams()
      .set('uf', uf)
      .set('city', city)
      .set('street', street);

    return this.http.get<AddressSuggestion[]>(`${this.baseUrl}/search`, { params });
  }

  findByCep(cep: string) {
    const params = new HttpParams().set('cep', cep);
    return this.http.get<AddressSuggestion>(`${this.baseUrl}/by-cep`, { params });
  }
}
