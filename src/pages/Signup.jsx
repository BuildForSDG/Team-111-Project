import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {
    Alert,
    Button,
    Card,
    CardBody,
    Col,
    Container,
    Form,
    Input,
    InputGroup,
    Row,
    CardTitle,
    CardSubtitle
} from 'reactstrap';

import useForm from '../hooks/useForm';

export default () => {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [alert, setAlert] = useState({color: '', message: ''});
    const [fields, handleChange, setField] = useForm({
        name: '',
        email: '',
        password: '',
        country: '',
        username: '',
        phone: '',
        account_type: '',
        academic_level: '',
        subject: ''
    });

    const register = async () => {
        setAlert({color: '', message: ''});
        setLoading(true);
        try {
            console.log("this are the fields", fields);
            await axios({

                method: 'POST',
                url: 'https://whispering-forest-37838.herokuapp.com/signup',
                data: {...fields, country_code: 'NG'}
            });
            setAlert({color: 'success', message: 'Registration successful'});
            setLoading(false);
        } catch (error) {
            setAlert({color: 'danger', message: 'An error occured'});
            setLoading(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // register();
        console.log(step, "this is the stepp");
        setStep(2);

    }

    const goBack = () => {
        if (step && step < 1) {
            setStep(1);
            return
        }
        setStep(step - 1);
    }


    const accountTypes = () => {
        return [{"name": "Student", "code": "student"}, {"name": "Teacher", "code": "teacher"}]
    }

    const academicLevels = () => {
        return [{"name": "Primary", "code": "primary"}, {"name": "Secondary", "code": "secondary"}]
    }

    const academicSubjects = () => {
        return [{"name": "Math", "code": "math"}, {"name": "English", "code": "english"}]
    }

    const setAccountType = (value) => {
        console.log("in srt t")
        setField('account_type', value);
        (value === 'student' || value === 'teacher') && setStep(3);
    }

    const setAcademicLevel = (value) => {
        setField('academic_level', value);
        setStep(4);
    }

    const setSubject = (value) => {
        setField('subject', value);
        setStep(5);
    }

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md="9" lg="7" xl="6">


                                <Alert
                                    isOpen={alert.message}
                                    toggle={() => setAlert({color: '', message: ''})}
                                    color={alert.color || 'warning'}
                                >
                                    {alert.message}
                                </Alert>

                          {
            step === 1 &&
            <Card>
              <CardBody>
                <div className="card-title font-weight-bold mb-5">
                  Create your free account today!
                </div>      <Form onSubmit={handleSubmit}>
                                    <InputGroup className="mb-2">
                                        <Input value={fields.name} name="name" type="text" onChange={handleChange}
                                               placeholder="Full name" required disabled={loading}/>
                                    </InputGroup>
                                    <InputGroup className="mb-2">
                                        <Input value={fields.email} name="email" type="text" onChange={handleChange}
                                               placeholder="Email address" required disabled={loading}/>
                                    </InputGroup>
                                    <InputGroup className="mb-2">
                                        <Input value={fields.password} name="password" type="password"
                                               onChange={handleChange} placeholder="Password" required
                                               disabled={loading}/>
                                    </InputGroup>
                                    <InputGroup className="mb-2">
                                        <Input value={fields.country} name="country" type="text" onChange={handleChange}
                                               placeholder="Country" required disabled={loading}/>
                                    </InputGroup>
                                    <InputGroup className="mb-2">
                                        <Input value={fields.username} name="username" type="text"
                                               onChange={handleChange} placeholder="Username" required
                                               disabled={loading}/>
                                    </InputGroup>
                                    <InputGroup className="mb-2">
                                        <Input value={fields.phone} name="phone" type="text" onChange={handleChange}
                                               placeholder="Phone" required disabled={loading}/>
                                    </InputGroup>
                                    <Button type="submit" color="primary" size="lg" className="mt-5" disabled={loading}>
                                        Continue
                                    </Button>


                                    <p className='pt-3'>
                                        Already have an account? <Link to='/'>Login</Link>
                                    </p>
                                </Form>
                            </CardBody>
                        </Card>
                    }
                    {
                        step === 2 &&
                        <Card>
                            <CardBody>
                                <div className="card-title font-weight-bold mb-5">
                                    Select the type of account you want to create
                                </div>

                                <Row>
                                    {accountTypes().map(accountType => (
                                        <Col md="6" key={accountType.code}>
                                            <Card className="cursor-pointer" onClick={() =>
                                                setAccountType(accountType.code)}>
                                                <CardBody>
                                                    <CardTitle>{accountType.name}</CardTitle>
                                                    <CardSubtitle>Create a learning account</CardSubtitle>
                                                </CardBody>
                                            </Card>
                                        </Col>

                                    ))}
                                </Row>
                                <Button type="button" color="primary" size="lg" className="mt-5" disabled={loading}
                                        onClick={() => goBack()}>
                                    Go back
                                </Button>

                            </CardBody>


                        </Card>

                    }
                    {
                        step === 3 &&
                        <Card>
                            <CardBody>
                                <div className="card-title font-weight-bold mb-5">
                                    Select your current academic level
                                </div>

                                <Row>
                                    {academicLevels().map(academicLevel => (
                                        <Col md="6" key={academicLevel.code}>
                                            <Card className="cursor-pointer" onClick={() =>
                                                setAcademicLevel(academicLevel.code)}>
                                                <CardBody>
                                                    <CardTitle>{academicLevel.name}</CardTitle>
                                                    <CardSubtitle>Create a learning account</CardSubtitle>
                                                </CardBody>
                                            </Card>
                                        </Col>

                                    ))};
                                </Row>
                                <Button type="button" color="primary" size="lg" className="mt-5" disabled={loading}
                                        onClick={() => goBack()}>
                                    Go back
                                </Button>

                            </CardBody>
                        </Card>
                    }
                    {
                        step === 4 &&
                        <Card>
                            <CardBody>
                                <div className="card-title font-weight-bold mb-5">
                                    Select your preferred subject
                                </div>

                                <Row>
                                    {academicSubjects().map(academicSubject => (
                                        <Col md="6" key={academicSubject.code}>
                                            <Card className="cursor-pointer" onClick={() =>
                                                setSubject(academicSubject.code)}>
                                                <CardBody>
                                                    <CardTitle>{academicSubject.name}</CardTitle>
                                                    <CardSubtitle>Create a learning account</CardSubtitle>
                                                </CardBody>
                                            </Card>
                                        </Col>

                                    ))}
                                </Row>
                                <Button type="button" color="primary" size="lg" className="mt-5" disabled={loading}
                                        onClick={() => goBack()}>
                                    Go back
                                </Button>

                            </CardBody>
                        </Card>
                    }
                    {
                        step === 5 &&
                        <Card>
                            <CardBody>
                                <div className="card-title font-weight-bold mb-5">
                                    Finally..
                                </div>
                                <Button type="button" color="primary" size="lg" className="mt-5" disabled={loading}
                                        onClick={() => goBack()}>
                                    Go back
                                </Button>
                                <Button onClick={register} color="primary" size="lg" className="mt-5"
                                        disabled={loading}>
                                    Create Account
                                </Button>
                            </CardBody>
                        </Card>
                    }
                </Col>
            </Row>
        </Container>
    );
}