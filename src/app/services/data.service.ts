import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  apiUrl = 'http://localhost:3000/';

  constructor(public httpClient: HttpClient) { }

  getContacts(): any {
    return this.httpClient.get(this.apiUrl + 'contacts');
  }

  getContact(id): any {
    return this.httpClient.get(this.apiUrl + 'contacts/' + id);
  }

  addContact(data): any {
    return this.httpClient.post(this.apiUrl + 'contacts', data);
  }

  getAddress(id): any {
    return this.httpClient.get(this.apiUrl + 'contacts/' + id + '/addresses');
  }

  saveAddress(id, data): any {
    return this.httpClient.post(this.apiUrl + 'contacts/' + id + '/addresses', data, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

  deleteAddress(id): any {
    return this.httpClient.delete(this.apiUrl + 'addresses/' + id);
  }

  updateAddress(id, data): any {
    return this.httpClient.put(this.apiUrl + 'contacts/' + id + '/addresses', data);
  }

  getCountries(): any {
    return this.httpClient.get(this.apiUrl + 'countries');
  }

}
