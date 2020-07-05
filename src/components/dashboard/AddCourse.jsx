import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'
import { Button, Input, FormGroup, Label } from 'reactstrap';

export default () => {
    const history = useHistory();

    const [topics, setTopics] = useState([
        { _id: 1, title: '', details: '' },
    ]);

    const addTopic = () => {
        setTopics([...topics, { _id: topics.length + 1, title: '', details: '' }])
    }

    const deleteTopic = (id) => {
        setTopics([...topics.splice(id, 1)])
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <Button type="button" color="danger" outline size="sm" onClick={() => history.goBack()}>
                    Cancel
                </Button>
            </div>
            <div className="mb-5">
                <FormGroup>
                    <Label for="exampleEmail">Course Title</Label>
                    <Input size="large" placeholder="Course title" />
                </FormGroup>

                <FormGroup>
                    <Label for="exampleText">Course description</Label>
                    <Input type="textarea" name="text" id="exampleText" />
                </FormGroup>
            </div>
            <div>
                <h4 className="mb-4">Topics</h4>
                {
                    topics.map((topic, i) => (
                        <div className="card mb-4">
                            <div className="p-4">
                                <FormGroup>
                                    <Label for="exampleText">Topic</Label>
                                    <Input type="text" value={topics[i].title} onChange={(e) => { topics[i].title = e.target.value }} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="exampleText">Details</Label>
                                    <Input type="textarea" value={topics[i].details} onChange={(e) => { topics[i].details = e.target.value }} />
                                </FormGroup>
                                <Button type="button" color="danger" outline size="sm"  onClick={() => deleteTopic(i)}>
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))
                }
                <Button className="mb-4" outline type="button" color="primary" onClick={addTopic}>
                    Add Topic
                </Button>
            </div>
        </>
    )
}