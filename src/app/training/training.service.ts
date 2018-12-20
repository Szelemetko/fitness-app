import {Exercise} from './exercise.module';
import {Subscription} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {UiService} from '../shared/ui.service';
import {Store} from '@ngrx/store';
import * as UI from '../shared/ui.actions';
import * as Training from './training.actions';

import * as fromTraining from './training.reducer';

@Injectable()
export class TrainingService {

  private fbSubs: Subscription[] = [];

  constructor(private db: AngularFirestore,
              private uiService: UiService,
              private store: Store<fromTraining.State>) {
  }

  fetchAvailableExercises() {
    this.store.dispatch(new UI.StartLoading());
    this.fbSubs.push(
      this.db
        .collection('availableExcercises')
        .snapshotChanges()
        .pipe(
          map(
            docArray => {
              return docArray.map(doc => {
                return {
                  id: doc.payload.doc.id,
                  ...doc.payload.doc.data()
                };
              });
            })
        )
        .subscribe((exercises: Exercise[]) => {
          this.store.dispatch(new Training.SetAvailableTrainings(exercises));
          this.store.dispatch(new UI.StopLoading());
        }, error => {
          this.store.dispatch(new UI.StopLoading());
          this.uiService.showSnackbar(error.message, null, 3000);
        })
    );
  }

  startExercise(selectedId: string): void {
    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  completeExercise(): void {
    this.store.select(fromTraining.getActiveExercise).pipe(take(1))
      .subscribe(
      ex => {
        this.addDataToDatabase({
          ...ex,
          date: new Date(),
          state: 'completed'
        });
        this.store.dispatch(new Training.StopTraining());
      }
    );
  }

  cancelExercise(progress: number): void {
    this.store.select(fromTraining.getActiveExercise).pipe(take(1))
      .subscribe(
      ex => {
        this.addDataToDatabase({
          ...ex,
          duration: ex.duration * (progress / 100),
          calories: ex.calories * (progress / 100),
          date: new Date(),
          state: 'cancelled'
        });
        this.store.dispatch(new Training.StopTraining());
      }
    );

  }

  fetchFinishedExercises() {
    this.fbSubs.push(
      this.db.collection('pastExercises').valueChanges().subscribe(
        (exercises: Exercise[]) => {
          this.store.dispatch(new Training.SetFinishedTrainings(exercises));
        })
    );
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('pastExercises').add(exercise);
  }

  cancelSubscriptions() {
    this.fbSubs.forEach((sub) => sub.unsubscribe());
  }

}
