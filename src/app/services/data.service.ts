import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly API_URL = 'https://api.coincap.io/v2/assets';

  constructor(private http: HttpClient) {}

  /**
   * Fetches the asset data.
   */
  fetchAssets(): Observable<any> {
    return this.http.get<any>(this.API_URL);
  }
}
