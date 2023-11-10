import { Component, Input } from '@angular/core';
import { map, takeWhile, timer } from 'rxjs';

@Component({
  selector: 'app-count-down',
  templateUrl: './count-down.component.html',
  styleUrls: ['./count-down.component.css'],
})
export class CountDownComponent {
  @Input({ required: true }) public seconds!: number;

  public timeRemaining$ = timer(0, 1000).pipe(
    map((n) => (this.seconds - n) * 1000),
    takeWhile((n) => n >= 0)
  );
}
