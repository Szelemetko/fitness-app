import {Exercise} from './exercise.module';
import {Subject} from 'rxjs';

export class TrainingService {
  availableExercises: Exercise[] = [
    { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
    { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
    { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
    { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 }
  ];
  exerciseChanged = new Subject<Exercise>();
  private currentExercise: Exercise;
  private completedExercises = [];

  getAvailableExercises(): Exercise[] {
    return this.availableExercises.slice();
  }

  startExercise(selectedId: string): void {
    this.currentExercise = this.availableExercises.find(ex => {
      return ex.id === selectedId;
    });
    this.exerciseChanged.next({...this.currentExercise});
  }

  completeExercise(): void {
    this.completedExercises.push({
      ...this.currentExercise,
      date: new Date(),
      state: 'completed'});
    this.currentExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number): void {
    this.completedExercises.push({
      ...this.currentExercise,
      duration: this.currentExercise.duration * (progress / 100),
      calories: this.currentExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled'});
    this.currentExercise = null;
    this.exerciseChanged.next(null);
  }

  getCurrentExercise(): Exercise {
    return {...this.currentExercise};
  }

  getCompletedExercises(): Exercise[] {
    return this.completedExercises.slice();
  }
}
