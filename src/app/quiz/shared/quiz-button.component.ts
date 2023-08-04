import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiz-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-button.component.html',
  styleUrls: ['./quiz-button.component.scss'],
})
export class QuizButtonComponent {
  @Input() questionAnswer: string = '';
  @Input() buttonState: string = '';
  @Input() questionChoice: string = '';
}
