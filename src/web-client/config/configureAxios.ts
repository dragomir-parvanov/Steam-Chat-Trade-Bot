import Axios from "axios";
import o_currentUser from "../globals/observables/o_currentUser";

/**
 * Handling every error in Axios, if its authentication error, try to get the user from the server.
 */
export default function configureAxios() {
  Axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        console.log(error.request);
        const url = error.request.responseURL as string;
        if (!url.endsWith("/auth/user")) {
          Axios.get("/auth/user")
            .then((r) => o_currentUser.next(r.data))
            .catch((error) => o_currentUser.next(null));
        }
      }

      if (error) return Promise.reject(error);
    }
  );
}
