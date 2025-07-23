import { DashboardSchedule } from "./dashboardSchedule";

export type DashboardTrip = {
    id: number;
    title: string;
    description: string;
    mediaBase64: string;
    startDate: string;
    endDate: string;
    createdAt: string;
    schedules: DashboardSchedule[];
}