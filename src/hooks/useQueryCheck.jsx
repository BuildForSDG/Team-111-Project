
import { useState } from "react";

export default initialValues => {

    const [values, setValues] = useState(initialValues);
    console.log(values)
    setValues(values.results)
    return [
        // values,
        // e => {
        //     setValues({
        //         ...values,
        //         [e.target.name]: e.target.value
        //     });
        // },
        // (key, value) => {
        //     setValues({ ...values, [key]: value })
        // }
    ];
};