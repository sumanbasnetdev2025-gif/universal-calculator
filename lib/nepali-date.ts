import NepaliDate from "nepali-date-converter";

export function adToBS(date: Date): { year: number; month: number; day: number; formatted: string } {
  const nd = new NepaliDate(date);
  return {
    year: nd.getYear(),
    month: nd.getMonth() + 1,
    day: nd.getDate(),
    formatted: nd.format("YYYY-MM-DD"),
  };
}

export function bsToAD(year: number, month: number, day: number): Date {
  const nd = new NepaliDate(year, month - 1, day);
  return nd.toJsDate();
}

export function calculateAge(birthDate: Date): { years: number; months: number; days: number } {
  const today = new Date();
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  return { years, months, days };
}

export function calculateAgeInBS(bsYear: number, bsMonth: number, bsDay: number) {
  const birthDateAD = bsToAD(bsYear, bsMonth, bsDay);
  return calculateAge(birthDateAD);
}

export function dateDifference(date1: Date, date2: Date) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const totalDays = Math.abs(Math.floor((date2.getTime() - date1.getTime()) / msPerDay));
  const years = Math.floor(totalDays / 365);
  const months = Math.floor((totalDays % 365) / 30);
  const days = totalDays % 30;
  return { years, months, days, totalDays };
}

export const NEPALI_MONTHS = [
  "Baishakh", "Jestha", "Ashadh", "Shrawan",
  "Bhadra", "Ashwin", "Kartik", "Mangsir",
  "Poush", "Magh", "Falgun", "Chaitra",
];

export const NEPALI_MONTHS_NP = [
  "बैशाख", "जेठ", "असार", "श्रावण",
  "भाद्र", "आश्विन", "कार्तिक", "मंसिर",
  "पौष", "माघ", "फाल्गुन", "चैत्र",
];