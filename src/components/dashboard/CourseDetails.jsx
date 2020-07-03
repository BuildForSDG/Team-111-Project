import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom'
import { Button } from 'reactstrap';

export default () => {
    const { id } = useParams();
    const history = useHistory();

    const topics = [
        { _id: 1, title: 'One', description: 'First number before 2' },
        { _id: 2, title: 'Two', description: 'Second number after 0' },
        { _id: 2, title: 'Three', description: 'Second number after 1' },
        { _id: 2, title: 'Four', description: 'Second number after 2' },
        { _id: 2, title: 'Five', description: 'Second number after 3' },
        { _id: 2, title: 'Six', description: 'Second number after 4' },
    ]

    useEffect(() => {
        console.log({ id });
    }, [id]);

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <Button type="button" color="secondary" outline size="sm" onClick={() => history.goBack()}>
                    Back
                </Button>
                <Button type="button" color="primary" onClick={() => history.goBack()}>
                    Begin course
                </Button>
            </div>
            <div className="mb-5">
                <h4 className="mb-4">Course title</h4>
                <p>Course description but Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque libero molestias et porro! Itaque laboriosam enim dignissimos quas aliquid voluptatibus iure, debitis exercitationem error possimus esse qui dolor atque voluptates nulla, neque, deserunt voluptatem eveniet reiciendis sunt laudantium cumque? Ipsa?</p>
            </div>
            <div>
                <h4 className="mb-4">Topics</h4>
                <div className="accordion" id="accordion">
                    {
                        topics.map(topic => (
                            <div className="card course-card hover">
                                <div className="card-header" id={`heading${topic._id}`}>
                                    <h2 className="mb-0">
                                        <button className="btn btn-link btn-block text-left"
                                            type="button"
                                            data-toggle="collapse"
                                            data-target={`#collapse${topic._id}`}
                                            aria-expanded="true"
                                            aria-controls={`collapse${topic._id}`}
                                        >
                                            {topic.title}
                                        </button>
                                    </h2>
                                </div>

                                <div id={`collapse${topic._id}`} className="collapse show" aria-labelledby={`heading${topic._id}`} data-parent="#accordion">
                                    <div className="card-body">
                                        {topic.description}
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    )
}