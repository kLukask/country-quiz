import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'quiz',
    pathMatch: 'full',
  },
  {
    path: 'quiz',
    loadComponent: () =>
      import('../app/quiz/quiz.component').then((m) => m.QuizComponent),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
