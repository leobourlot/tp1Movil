import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiHotelService {
  private apiUrl = 'hotels-com6.p.rapidapi.com';
  private apiKey = 'b099ec4476msh09e41e1b9e030bap118effjsna822773b1d0c';

  constructor(private http: HttpClient) {}

  buscarHotelesEnConcordia() {
    const headers = new HttpHeaders({
      'X-RapidAPI-Key': this.apiKey,
      'X-RapidAPI-Host': 'hotels-com-free.p.rapidapi.com',
    });

    const params = {
      query: 'Concordia, Entre Ríos',
      // checkIn: '2024-10-20',
      // checkOut: '2024-10-22',
      currency: 'USD',
      locale: 'es_ES',
    };

    return this.http.get(this.apiUrl, { headers, params });
  }
}
