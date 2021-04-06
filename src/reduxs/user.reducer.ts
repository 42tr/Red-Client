export interface UserState {
  user: any;
  userName: string;
}

const initialState: UserState = {
  user: null,
  userName: "",
};

const SET_USER_DETAIL = "user/setUserDetail";

interface SetUserDetailAction {
  type: typeof SET_USER_DETAIL;
  payload: any;
}

export const setUserDetail = (user: any) => {
  return {
    type: SET_USER_DETAIL,
    payload: user,
  };
};

export default function userReducer(state: UserState = initialState, action: SetUserDetailAction) {
  switch (action.type) {
    case SET_USER_DETAIL:
      return { user: action.payload, userName: action.payload.name };
    default:
      return state;
  }
}

