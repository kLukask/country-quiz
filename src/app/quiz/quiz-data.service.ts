import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { QuizDataInterface } from './interfaces/quiz-data.interface';
import { Observable } from 'rxjs';

@Injectable()
export class QuizDataService {
  constructor(private http: HttpClient) {}

  getQuizData(): Observable<QuizDataInterface[]> {
    return this.http.get<QuizDataInterface[]>(
      'https://restcountries.com/v3.1/region/europe?fields=name,flags,capital'
    );
  }
}
