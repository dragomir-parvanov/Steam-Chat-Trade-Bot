import ERegisteredUserClaim from "../../../models/site/enums/ERegisteredUserClaim";
import { Class } from "utility-types";
import o_currentUser from "../../globals/observables/o_currentUser";
import Title from "antd/lib/typography/Title";
import React from "react";
import { Subscription } from "rxjs";

const d_userHasClaim = (claim: ERegisteredUserClaim | ERegisteredUserClaim[]) => {
  return <Component extends Class<React.Component>>(component: Component) => {
    let subscription: Subscription;
    return class extends component {
      constructor(...args: any[]) {
        super(...args);

        if (this.componentDidMount) {
          const copy = this.componentDidMount.bind(this);

          this.componentDidMount = () => {
            copy();
            this.d_bindUserChecker();
          };
        } else {
          this.d_bindUserChecker();
        }
      }
      private d_bindUserChecker = () => {
        const cachedRender = this.render;
        const claimCheck = () => {
          const user = o_currentUser.getValue();
          console.log(user);
          if (!user) {
            return (this.render = () => {
              return <Title>You are not logged in</Title>;
            });
          } else {
            if (user.claims.some((c) => c === ERegisteredUserClaim.Admin)) {
              return (this.render = cachedRender);
            }
            if (Array.isArray(claim)) {
              const missingClaims = claim.filter((c) => !user.claims.some((uc) => uc === c));
              if (missingClaims.length > 1) {
                return (this.render = () => {
                  return <Title>User is missing one of these claims: {missingClaims.map((c) => ERegisteredUserClaim[c]).join()}</Title>;
                });
              }
            } else {
              if (!user.claims.some((c) => c === claim)) {
                return (this.render = () => {
                  return <Title>You are missing claim:{ERegisteredUserClaim[claim]}</Title>;
                });
              }
            }
          }
          this.render = cachedRender;
        };
        claimCheck();
        subscription = o_currentUser.subscribe({
          next: () => {
            claimCheck();
            this.forceUpdate();
          },
        });
      };
      componentWillUnmount() {
        this.componentWillMount && this.componentWillMount();
        subscription.unsubscribe();
      }
    };
  };
};

export default d_userHasClaim;
