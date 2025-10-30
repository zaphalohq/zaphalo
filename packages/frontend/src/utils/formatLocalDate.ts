import { format } from "date-fns"

export function formatLocalDate(utcString) {
  if (!utcString) return "";
  const date = new Date(utcString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // months start from 0
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // convert 0 → 12 for midnight

  const hh = String(hours).padStart(2, "0");

  return `${day}/${month}/${year} ${hh}:${minutes}:${seconds} ${ampm}`;
}

export function formatUTCDate(utcString) {
  if (!utcString) return "";

  const date = new Date(utcString)
  return date
}