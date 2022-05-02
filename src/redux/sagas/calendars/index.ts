import {
  call,
  delay,
  Effect,
  put,
  takeEvery,
  takeLatest,
} from "redux-saga/effects";
import { Api } from "../../../hooks/useFetch";
import {
  saveAddedCalendarAction,
  SAVE_CALENDARS,
} from "../../reducers/calendars";
import {
  CLOSE_NOTIFICATION,
  OPEN_NOTIFICATION,
  SAVE_ADDED_NOTIFICATION,
} from "../../reducers/notifications/notifications";

export interface TaskI {
  dateFrom: string;
  dateTill: string;
  title: string;
  description: string;
}

export interface CalendarsI {
  id?: number;
  description?: string;
  name: string;
  color: string;
  selected: boolean;
}

async function fetchCalenders() {
  const data = await Api({ method: "get", url: "/calendars" });
  return data.data;
}

async function createCalendar(body: CalendarsI) {
  const data = await Api({ method: "POST", url: "calendars", data: body });

  return data.data;
}

export function* addCalendar(effect: Effect<string, CalendarsI>) {
  const newCalendar: CalendarsI = yield call(createCalendar, effect.payload);
  yield put(saveAddedCalendarAction(newCalendar));
  yield put(SAVE_ADDED_NOTIFICATION({ message: "تقویم با موفقیت اضافی شد " }));
  yield put(OPEN_NOTIFICATION());
  yield delay(1000);
  yield put(CLOSE_NOTIFICATION());
}

addCalendar.ac = (newCalendar: CalendarsI) => ({
  type: addCalendar.type,
  payload: newCalendar,
});
addCalendar.type = "ADD_CALENDAR";

export function* getCalendars() {
  const calendars: CalendarsI[] = yield call(fetchCalenders);

  yield put({ type: SAVE_CALENDARS, payload: calendars });
}

getCalendars.type = "GET_CALENDARS";
getCalendars.ac = () => ({ type: getCalendars.type });

export default function* watchGettingCalenders() {
  yield takeLatest(getCalendars.type, getCalendars);
}

export function* watchAddingCalendar() {
  yield takeEvery(addCalendar.type, addCalendar);
}
