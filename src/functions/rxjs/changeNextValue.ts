import { Subscription, Observable, BehaviorSubject, Subject } from "rxjs";
import UpdatingSubject from "../../classes/rxjs-extending/UpdatingSubject";

export function changeNextValue<OldValue, NewValue>(
  observable: Observable<OldValue>,
  edit: (value: OldValue) => NewValue
): BehaviorSubject<NewValue> | Subject<NewValue> {
  function bindSubject(s: Subject<any>) {
    observable.subscribe({
      next: (v) => s.next(edit(v)),
    });
  }
  if (observable instanceof UpdatingSubject || observable instanceof BehaviorSubject) {
    const newSubject = new BehaviorSubject(observable.getValue());
    bindSubject(newSubject);
    return newSubject;
  } else {
    const newSubject = new Subject() as never;
    bindSubject(newSubject);
    return newSubject;
  }
}
