import { doGet } from "./apiRequestHandler";

const getAccountTypes = async () => {
    const res = await doGet('account_types')
    return res.results;
}

const getAcademicLevels = async () => {
    const res = await doGet('academic_levels')
    return res.results;
};

const getAcademicSubjects = async () => {
    const res = await doGet('available_courses');
    return res.results;
};

const getCountries = async () => {
    const res = await doGet('countries');
    return res.results;
};

const getAvailableCourses = async () => {
    const res = await doGet('available_courses');
    return res.results;
};

const getMyCourses = async () => {
    const res = await doGet('courses');
    return res.results;
};

export { getAccountTypes, getAcademicSubjects, getAcademicLevels, getCountries, getAvailableCourses, getMyCourses }
