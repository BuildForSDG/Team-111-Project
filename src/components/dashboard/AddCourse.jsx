import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'
import { Button, Input, FormGroup, Label } from 'reactstrap';
import { useEffect } from 'react';
import { doPost } from '../../utils/apiRequestHandler';

export default () => {
    const history = useHistory();

    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [canSubmit, setCanSubmit] = useState(false);
    const [topics, setTopics] = useState([
        { _id: 1, title: '', details: '' },
    ]);

    useEffect(() => {
        const allTopicsProvided = topics.every((topic) => topic.title && topic.details);
        setCanSubmit(title && description && allTopicsProvided);
    }, [canSubmit, title, description, topics]);

    const addTopic = () => {
        setTopics([...topics, { id: topics.length + 1, title: '', details: '' }])
    }

    const deleteTopic = (id) => {
        setTopics(topics.filter(topic => topic.id !== id));
    }

    const handleTopicChange = (id, field, value) => {
        setTopics(topics.map((topic) => (topic.id === id) ? { ...topic, [field]: value } : topic));
    }

    const handleSubmit = async () => {
        setLoading(true);
        const syllabus = topics.map(topic => ({ title: topic.title, description: topic.details }));
        await doPost('/courses', { name: title, description, syllabus });
        setLoading(false);
        history.goBack();
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <Button type="button" color="danger" outline size="sm" onClick={() => history.goBack()} disabled={loading}>
                    Cancel
                </Button>
            </div>
            <div className="mb-5">
                <FormGroup>
                    <Label for="exampleEmail">Course Title</Label>
                    <Input bsSize="large" placeholder="Course title" value={title} onChange={(e) => setTitle(e.target.value)} disabled={loading} />
                </FormGroup>

                <FormGroup>
                    <Label for="exampleText">Course description</Label>
                    <Input type="textarea" value={description} onChange={(e) => setDescription(e.target.value)} disabled={loading} />
                </FormGroup>
            </div>
            <div>
                <h4 className="mb-4">Topics</h4>
                {
                    topics.map((topic, i) => (
                        <div className="card mb-4" key={i}>
                            <div className="p-4">
                                <FormGroup>
                                    <Label for="exampleText">Topic</Label>
                                    <Input type="text" value={topics[i].title} onChange={(e) => handleTopicChange(topic.id, 'title', e.target.value)} disabled={loading} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="exampleText">Details</Label>
                                    <Input type="textarea" value={topics[i].details} onChange={(e) => handleTopicChange(topic.id, 'details', e.target.value)} disabled={loading} />
                                </FormGroup>
                                <Button type="button" color="danger" outline size="sm" onClick={() => deleteTopic(i)} disabled={loading}>
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))
                }
                <Button className="mb-4" outline type="button" color="primary" onClick={addTopic} disabled={loading}>
                    Add Topic
                </Button>
                <div className="mt-5">
                    <Button type="button" color="primary" onClick={handleSubmit} disabled={!canSubmit || loading}>
                        Submit
                    </Button>
                </div>
            </div>
        </>
    )
}