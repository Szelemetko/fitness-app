import {NgModule} from '@angular/core';
import {CurrentTrainingComponent} from './current-training/current-training.component';
import {TrainingComponent} from './training.component';
import {NewTrainingComponent} from './new-training/new-training.component';
import {PastTrainingComponent} from './past-training/past-training.component';
import {SharedModule} from '../shared/shared.module';
import {StopTrainingComponent} from './current-training/stop-training.component';
import {TrainingRoutingModule} from './training-routing.module';
import {AngularFirestoreModule} from '@angular/fire/firestore';

@NgModule({
  declarations: [
    TrainingComponent,
    CurrentTrainingComponent,
    NewTrainingComponent,
    PastTrainingComponent,
    StopTrainingComponent
  ],
  imports: [
    SharedModule,
    AngularFirestoreModule,
    TrainingRoutingModule
  ],
  exports: [],
  entryComponents: [StopTrainingComponent]
})
export class TrainingModule {
}
