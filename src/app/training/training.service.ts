import {Exercise} from './exercise.module';
import {Subject} from 'rxjs';

export class TrainingService {
  availableExercises: Exercise[] = [
    { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
    { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
    { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
    { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 }
  ];
  private currentExercise: Exercise;
  exerciseChanged = new Subject<Exercise>();

  getAvailableExercises() {
    return this.availableExercises.slice();
  }

  startExercise(selectedId: string) {
    this.currentExercise = this.availableExercises.find(ex => {
      return ex.id === selectedId;
    });
    this.exerciseChanged.next({...this.currentExercise});
  }
}
