import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom'
import { Button } from 'reactstrap';
import { doGet } from '../../utils/apiRequestHandler';
import { useState } from 'react';

export default () => {
    const { id } = useParams();
    const history = useHistory();
    const [course, setCourse] = useState(null);

    useEffect(() => {
        doGet(`/courses/${id}`).then(res => {
            setCourse(res.results);
        })
    }, [id]);

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <Button type="button" color="secondary" outline size="sm" onClick={() => history.goBack()}>
                    Back
                </Button>
                <Button type="button" color="primary" disabled>
                    Begin course
                </Button>
            </div>
            {
                course && (
                    <>
                        <div className="mb-5">
                            <h4 className="mb-4">{course.type.name}</h4>
                            <p>{course.type.description}</p>
                        </div>
                        <div>
                            <h4 className="mb-4">Topics</h4>
                            <div className="accordion" id="accordion">
                                {
                                    course.syllabus.map((topic, i) => (
                                        <div className="card course-card hover" key={i}>
                                            <div className="card-header" id={`heading${i}`}>
                                                <h2 className="mb-0">
                                                    <button className="btn btn-link btn-block text-left"
                                                        type="button"
                                                        data-toggle="collapse"
                                                        data-target={`#collapse${i}`}
                                                        aria-expanded="true"
                                                        aria-controls={`collapse${i}`}
                                                    >
                                                        {topic.title}
                                                    </button>
                                                </h2>
                                            </div>

                                            <div id={`collapse${i}`} className="collapse show" aria-labelledby={`heading${topic._id}`} data-parent="#accordion">
                                                <div className="card-body">
                                                    {topic.description}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                            {
                                !course.syllabus.length && <p className="mt-4">No courses</p>
                            }
                        </div>
                    </>
                )
            }
        </>
    )
}