import { Pipe } from '@angular/core';

@Pipe({ name: 'questionChoice', standalone: true })
export class QuestionChoicePipe {
  transform(questionIndex: number): string {
    const choices: string[] = ['A', 'B', 'C', 'D'];
    return choices[questionIndex];
  }
}
