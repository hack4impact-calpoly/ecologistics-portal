export interface Alert {
  userId: String; // cleark id
  title: String; // request was approved / denied
  description: String;
  date: Date; // date.now default when making schema
}
