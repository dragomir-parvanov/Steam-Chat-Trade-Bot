import { BehaviorSubject } from "rxjs";

export default class UpdatingSubject<T = object> extends BehaviorSubject<T> {
  update = (func: (value: T) => T | void) => {
    const oldValue = this.getValue();
    const newValue = func(oldValue);
    if (newValue) {
      this.next(newValue);
    } else {
      this.next(oldValue);
    }
  };
}
