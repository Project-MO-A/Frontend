import { atom } from "recoil";
import { recruitDummy } from "./DummyData";

export const postData = atom({
  key: "postData",
  default: recruitDummy,
});

export const titleState = atom({
  key: "titleState",
  default: "1",
});

export const ScheduleUser = atom({
  key: "ScheduleUser",
  default: "user1",
});

export const ScheduleHover = atom({
  key: "ScheduleHover",
  default: false,
});

export const ScheduleSelect = atom({
  key: "ScheduleSelect",
  default: { date: "", time: "", value: false },
});
