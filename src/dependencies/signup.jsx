import {doGet} from "../utils/apiRequestHandler";


const getAccountTypes = async () => {
    const res = await doGet('account_types')
    return res.results;
}

const getAcademicLevels = async () => {
    const res = await doGet('academic_levels')
    return  res.results;
};

const getAcademicSubjects = async () => {
    const res = await doGet('subjects');
    return  res.results;
};

const getCountries = async () => {
    const res = await doGet('countries');
    return  res.results;
};



export {getAccountTypes, getAcademicSubjects, getAcademicLevels, getCountries}
