import { Subscription, SubscriptionLike, ObservableLike, InteropObservable, Subject, BehaviorSubject, Observable } from "rxjs";
import React from "react";
import { Class } from "utility-types";
import _ from "lodash";
import UpdatingSubject from "../../../classes/rxjs-extending/UpdatingSubject";
export type SubscriptionStateMap<State extends Record<string, any>, Props> = {
  [i in keyof State]?: AcceptedObservables<State[i]> | CallbackWithProps<State[i], Props>;
};

export type CallbackWithProps<StateType, Props> = (props: Props) => AcceptedObservables<StateType>;

export type AcceptedObservables<T> = Subject<T> | Observable<T> | UpdatingSubject<T>;

/**
 * Maps the state to an observable,
 * on "next" event, update the state.
 * if the state is relative value and is the same as the old one, copy the object or the array
 * @param map
 */
const d_rxjsStateMap = <State extends Record<string, any>, Props = object>(map: SubscriptionStateMap<State, Props>) => <C extends Class<React.Component<any, State>>>(
  comp: C
) => {
  const subscriptions: SubscriptionLike[] = [];
  return class extends comp {
    constructor(...args: any[]) {
      super(...args);
      this.d_mapState();
    }
    d_mapState = () => {
      const states: Record<string, any> = {};
      const newMap: Record<string, AcceptedObservables<any>> = {};
      for (const state in map) {
        if (_.isFunction(map[state])) {
          const func = map[state] as Function;
          newMap[state] = func(this.props);
        } else {
          newMap[state] = map[state] as never;
        }
      }
      for (const state in newMap) {
        if (map[state] instanceof BehaviorSubject || UpdatingSubject) {
          const behaviour = newMap[state] as BehaviorSubject<unknown>;
          states[state] = behaviour.getValue() as never;
        } else {
          states[state] = null as never;
        }
      }
      this.state = { ...this.state, ...states };
      const didMountCopy = this.componentDidMount?.bind(this);
      this.componentDidMount = () => {
        didMountCopy && didMountCopy();
        for (const state in newMap) {
          const subject = newMap[state];
          const subscription = subject.subscribe({
            next: (value) => {
              if (value === null) {
                const stateObj = { [state]: value } as never;
                this.setState(stateObj);
                return;
              }
              if (this.state[state] === value && typeof this.state[state] === "object") {
                // Checking if it is an array, isArray or instaceof Array doesn't catch cases where arrays are created by Object.create
                if (value["push"]) {
                  const stateObj = { [state]: [...value] } as never;
                  this.setState(stateObj);
                } else {
                  const stateObj = { [state]: { ...value } } as never;
                  this.setState(stateObj);
                }
              } else {
                const stateObj = { [state]: value } as never;
                this.setState(stateObj);
              }
            },
          });
          subscriptions.push(subscription);
        }
        const willUnmountCopy = this.componentWillUnmount?.bind(this);
        this.componentWillUnmount = () => {
          willUnmountCopy && willUnmountCopy();
          subscriptions.forEach((s) => s.unsubscribe());
        };
      };
    };
  };
};
export default d_rxjsStateMap;
