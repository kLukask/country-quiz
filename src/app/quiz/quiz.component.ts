import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizButtonComponent } from './shared/quiz-button.component';
import { QuizDataService } from './quiz-data.service';
import { HttpClientModule } from '@angular/common/http';
import { QuizDataInterface } from './interfaces/quiz-data.interface';
import { QuizQuestionsInterface } from './interfaces/quiz-question.interface';
import { filter, map, tap } from 'rxjs/operators';
import { QuestionChoicePipe } from './pipes/question-choice.pipe';

@Component({
  selector: 'app-quiz',
  standalone: true,
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
  imports: [
    CommonModule,
    QuizButtonComponent,
    HttpClientModule,
    QuestionChoicePipe,
  ],
  providers: [QuizDataService],
})
export class QuizComponent implements OnInit {
  constructor(private quizDataService: QuizDataService) {}

  questionAnswered: boolean = false;
  currentQuestion: number = 0;
  quizQuestions: QuizQuestionsInterface[] = [];
  correctAnswers: number = 0;
  questionsAnswered: number = 0;
  showResults: boolean = false;
  selectedAnswer: string = '';

  ngOnInit(): void {
    this.populateQuizQuestions();
  }

  onQuestionAnswered(selectedChoice: string): void {
    if (selectedChoice === this.quizQuestions[this.currentQuestion].answer) {
      this.correctAnswers++;
    }
    // Populate selectedAnswer with the selected choice to be able to highlight the selected answer
    this.selectedAnswer = selectedChoice;
    // toggle the value of questionAnswered
    this.questionAnswered = !this.questionAnswered;
    // Increment the number of questions answered
    this.questionsAnswered++;
  }

  nextQuestion(): void {
    // Increment the current question number
    this.currentQuestion++;
    // Reset the questionAnswered property
    this.questionAnswered = false;
    // Show results if all questions have been answered
    if (this.questionsAnswered === this.quizQuestions.length) {
      this.showResults = true;
    }
  }

  resetGame(): void {
    // Reset the properties
    this.showResults = false;
    this.questionAnswered = false;
    this.currentQuestion = 0;
    this.correctAnswers = 0;
    this.questionsAnswered = 0;
    // Reset the quiz questions array
    this.quizQuestions = [];
    // Populate the quiz questions array
    this.populateQuizQuestions();
  }

  populateQuizQuestions(): void {
    this.quizDataService
      .getQuizData()
      .pipe(
        // Make sure country has a capital
        map((countries: QuizDataInterface[]) =>
          countries.filter((country: QuizDataInterface) => country.capital[0])
        )
      )
      .subscribe((countries: QuizDataInterface[]) => {
        // Generate 10 quiz questions from the countries
        for (let i = 0; i < 10; i++) {
          // Create first 5 questions with flag
          if (i < 5) {
            this.buildFlagQuestion(countries);
          } else {
            // Create last 5 questions with text
            this.buildTextQuestion(countries);
          }
        }
      });
  }

  generateRandomNumber(): number {
    // 53 is the number of countries in the API returned
    return Math.floor(Math.random() * 53);
  }

  buildFlagQuestion(countries: QuizDataInterface[]): void {
    // Create a new question object
    let newQuestion: QuizQuestionsInterface = {
      question: '',
      answer: '',
      choices: [],
      flag: null,
    };

    const randomNumber = this.generateRandomNumber();
    // Set the question
    newQuestion.question = 'Which country does this flag belong to?';
    // Set the flag
    newQuestion.flag = countries[randomNumber].flags.svg;
    // Set the answer
    newQuestion.answer = countries[randomNumber].name.common;
    // Set the choices
    let countryNames = Object.values(countries).map(
      (country: QuizDataInterface) => country.name.common
    );

    this.quizQuestions.push(this.buildQuestion(countryNames, newQuestion));
  }

  buildTextQuestion(countries: QuizDataInterface[]): void {
    // Create a new question object
    let newQuestion: QuizQuestionsInterface = {
      question: '',
      answer: '',
      choices: [],
      flag: null,
    };
    const randomNumber = this.generateRandomNumber();

    // Set the question
    newQuestion.question =
      'What is the captital of ' + countries[randomNumber].name.common + '?';
    // Set the answer
    newQuestion.answer = countries[randomNumber].capital[0];
    // Set the choices
    // Create an array of capital names
    let capitalNames = Object.values(countries).map(
      (country: QuizDataInterface) => country.capital[0]
    );

    this.quizQuestions.push(this.buildQuestion(capitalNames, newQuestion));
  }

  private buildQuestion(
    quizChoices: string[],
    question: QuizQuestionsInterface
  ): QuizQuestionsInterface {
    // Remove the answer from the array of country names
    quizChoices = quizChoices.filter(
      (countryName: string) => countryName !== question.answer
    );
    // Shuffle the array of country names
    quizChoices = quizChoices.sort(() => Math.random() - 0.5);
    // Add the first 3 country names to the choices
    question.choices = quizChoices.slice(0, 3);
    // Add the answer to the choices
    question.choices.push(question.answer);
    // Shuffle the choices
    question.choices = question.choices.sort(() => Math.random() - 0.5);

    return question;
  }
}
