import {Exercise} from './exercise.module';
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable()
export class TrainingService {

  exercisesChanged = new Subject<Exercise[]>();
  exerciseChanged = new Subject<Exercise>();
  finishedExercisesChanged = new Subject<Exercise[]>();

  private availableExercises: Exercise[] = [];
  private currentExercise: Exercise;

  constructor (private db: AngularFirestore) {};

  fetchAvailableExercises() {
    this.db
      .collection('availableExcercises')
      .snapshotChanges()
      .pipe(
        map(docArray => {
          return docArray.map(doc => {
            return {
              id: doc.payload.doc.id,
              ...doc.payload.doc.data()
            };
          });
        })
      )
      .subscribe((exercises: Exercise[]) => {
        this.availableExercises = exercises;
        this.exercisesChanged.next([...this.availableExercises]);
      });
  }

  startExercise(selectedId: string): void {
    this.currentExercise = this.availableExercises.find(ex => {
      return ex.id === selectedId;
    });
    this.exerciseChanged.next({...this.currentExercise});
  }

  completeExercise(): void {
    this.addDataToDatabase({
      ...this.currentExercise,
      date: new Date(),
      state: 'completed'});
    this.currentExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number): void {
    this.addDataToDatabase({
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

  fetchFinishedExercises() {
    this.db.collection('pastExercises').valueChanges().subscribe(
      (exercises: Exercise[]) => {
        this.finishedExercisesChanged.next(exercises);
    });
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('pastExercises').add(exercise);
  }
}
