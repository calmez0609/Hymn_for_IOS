export interface SchedulePlanItem {
  id: string;
  bookId: number;
  number: number;
  title: string;
}

export interface SchedulePlan {
  id: string;
  name: string;
  scheduledAt: string;
  items: SchedulePlanItem[];
  createdAt: string;
}

export function isPlanExpired(plan: SchedulePlan, now: Date = new Date()): boolean {
  return new Date(plan.scheduledAt).getTime() < now.getTime();
}

export function isSameDate(dateA: Date, dateB: Date): boolean {
  return (
    dateA.getFullYear() === dateB.getFullYear()
    && dateA.getMonth() === dateB.getMonth()
    && dateA.getDate() === dateB.getDate()
  );
}

export function isPlanToday(plan: SchedulePlan, now: Date = new Date()): boolean {
  return isSameDate(new Date(plan.scheduledAt), now);
}
