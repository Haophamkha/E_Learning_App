import { useMemo } from "react";
import { User, Course } from "../types/type";

export const useUserCourseStatus = (user: User | null, courses: Course[]) => {
  const parseDuration = (duration: string | number | undefined): number => {
    if (!duration) return 0;
    if (typeof duration === "number") return duration;
    const clean = duration.replace(/\s+/g, "");
    const h = clean.match(/(\d+)h/);
    const m = clean.match(/(\d+)m/);
    return (h ? parseInt(h[1]) * 60 : 0) + (m ? parseInt(m[1]) : 0);
  };

  const ongoingCourses = useMemo(() => {
    if (!user) return [];
    return Object.entries(user.purchasecourse || {})
      .map(([courseId, progressData]) => {
        const course = courses.find((c) => String(c.id) === String(courseId));
        if (!course) return null;

        const totalMinutes = parseDuration(course.duration);
        const watched = progressData.time_watched || 0;
        const progress = totalMinutes ? (watched / totalMinutes) * 100 : 0;

        return progress < 100 ? { ...course, time_watched: watched } : null;
      })
      .filter((c): c is Course & { time_watched: number } => c !== null);
  }, [user, courses]);

  const completedCourses = useMemo(() => {
    if (!user) return [];
    return Object.entries(user.purchasecourse || {})
      .map(([courseId, progressData]) => {
        const course = courses.find((c) => String(c.id) === String(courseId));
        if (!course) return null;

        const totalMinutes = parseDuration(course.duration);
        const watched = progressData.time_watched || 0;
        const progress = totalMinutes ? (watched / totalMinutes) * 100 : 0;

        return progress >= 100 ? { ...course, time_watched: watched } : null;
      })
      .filter((c): c is Course & { time_watched: number } => c !== null);
  }, [user, courses]);

  return { ongoingCourses, completedCourses };
};
