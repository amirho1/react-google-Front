import React, { FC, useCallback, useEffect, useMemo } from "react";
import { FaPlus } from "react-icons/fa";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { ReduxStateI } from "../../redux";
import { CalendarsI, getCalendars } from "../../redux/sagas/calendars";
import HoverCircle from "../HoverCircle/HoverCircle";
import ULLinks, { CB, IItem } from "../ULLinks/ULLinks";
import styles from "./Calendars.module.scss";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link } from "react-router-dom";
import { getEvents } from "../../redux/sagas/events";

interface CalendarsProps {}

const Calendars: FC<CalendarsProps> = () => {
  const [calendars] = useSelector<ReduxStateI, [CalendarsI[]]>(state => [
    state.calendars.calendars,
  ]);
  const dispatch = useDispatch();

  useEffect(() => {
    // get calendars name and colors
    dispatch(getCalendars.ac());
  }, [dispatch]);

  const cb = useCallback<CB>(
    (value: IItem, _, index, setChildDisplay, childDisplay) => (
      <div
        className={`${styles.row} f-between`}
        onClick={() => setChildDisplay && setChildDisplay(current => !current)}>
        <span className={styles.tag}>{value.tag}</span>

        <div className="f-between">
          {value.tag === "تقویم های دیگر" ? (
            <HoverCircle
              width="30px"
              height="30px"
              dataTip="اضافه کردن تقویم جدید">
              <Link to="/settings/create-new-calendar">
                <FaPlus />
              </Link>
            </HoverCircle>
          ) : null}
          {childDisplay ? <RiArrowDownSLine /> : <RiArrowUpSLine />}{" "}
        </div>
      </div>
    ),
    []
  );

  const changeCalendarSelection = useCallback(() => {
    calendars.forEach(calendar => {
      // dispatch(getEvents.ac({ timeStamp, task }));
    });
  }, [dispatch]);

  const childCb = useCallback(
    (calendar: CalendarsI): CB =>
      item =>
        (
          <div className={`${styles.row} f-between`}>
            <input type="checkbox" name="" id="" checked={calendar.selected} />
            <div data-tip={item.tag} className={styles.myCalenders}>
              {item.tag}
            </div>

            <BsThreeDotsVertical
              className={styles.setting}
              data-tip={"Click to view"}
            />
          </div>
        ),
    []
  );

  const mappedCalenders = useMemo<IItem[]>(
    () =>
      calendars.map(calendar => ({
        tag: calendar.name,
        cb: childCb(calendar),
      })),
    [calendars, childCb]
  );

  const listOfItems = useMemo<IItem[]>(
    () => [
      {
        tag: "تقویم های من",
        cb: cb,
        children: [...mappedCalenders],
      },
      {
        tag: "تقویم های دیگر",
        cb: cb,
      },
    ],
    [cb, mappedCalenders]
  );

  return (
    <div className={styles.Calendars} data-testid="Calendars">
      <ULLinks listOfItems={listOfItems} />
    </div>
  );
};

export default Calendars;
