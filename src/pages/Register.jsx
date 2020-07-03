import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import Navbar from '../components/Navbar'

import useForm from '../hooks/useForm';
import { doPost } from "../utils/apiRequestHandler";
import { getAcademicSubjects, getAccountTypes, getCountries } from "../utils/dependencies";
import { useHistory } from "react-router-dom";
import Footer from '../components/Footer';

export default () => {
  const [accountTypes, setAccountTypes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [academicSubjects, setAcademicSubjects] = useState([]);

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [alert, setAlert] = useState({ color: '', message: '' });
  const [fields, handleChange, setField] = useForm({
    name: '',
    email: '',
    password: '',
    country_code: '',
    username: '',
    phone: '',
    account_type: '',
    academic_level: '',
    subject: ''
  });
  let history = useHistory();

  const successStatusCodes = [200, 201];

  useEffect(() => {
    if (accountTypes.length < 1) getAccountTypes().then(results => setAccountTypes(results));
    if (academicSubjects.length < 1) getAcademicSubjects().then(results => setAcademicSubjects(results));
    if (countries.length < 1) getCountries().then(results => setCountries(results));
  }, [accountTypes, academicSubjects, countries]);

  const register = async () => {
    setAlert({ color: '', message: '' });
    setLoading(true);
    const res = await doPost('signup', { ...fields })
    if (!res) {
      setLoading(false);
      return setAlert({ color: 'danger', message: "Internal Server error" });
    }
    if (!successStatusCodes.includes(res.reqStatus)) {
      setLoading(false);
      return setAlert({ color: 'danger', message: res.message });
    }
    setAlert({ color: 'success', message: 'Registration successful' });
    const token = res.results.auth_token;
    localStorage.setItem('token', token);
    // :TODO redirect to all courses page if course chosen has no teacher
    // if (res.results.course_status && res.results.course_status === "drafted"){
    //
    // }
    history.push('dashboard');
  }

  const goBack = () => {
    if (step === 1) return;
    setStep(step => step - 1);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ color: '', message: '' });
    setLoading(true);
    const reqData = { phone: fields.phone, email: fields.email, country_code: fields.country_code };
    const res = await doPost('check_exists', reqData);
    setLoading(false);
    if (!res) {
      return setAlert({ color: 'danger', message: "Internal Server error" });
    }
    if (!successStatusCodes.includes(res.reqStatus)) {
      return setAlert({ color: 'danger', message: res.message });
    }
    setStep(2);
  }

  const setAccountType = (value) => {
    const found = accountTypes.some(el => el.code === value.toLowerCase());
    if (!found) return;
    setField('account_type', value);
    setStep(3)
  };

  const setSubject = (value) => {
    const found = academicSubjects.some(el => el.code === value.toLowerCase());
    if (found) {
      setField('subject', value);
      setStep(4);
    }
  }

  return (
    <>
      <Container>
        <Navbar />
        <Row className="justify-content-center">
          <Col md="9" lg="7" xl="6">
            <Alert
              isOpen={!!alert.message}
              toggle={() => setAlert({ color: '', message: '' })}
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
                </div>
                  <Form onSubmit={handleSubmit}>
                    <InputGroup className="mb-2">
                      <Input value={fields.name} name="name" type="text" onChange={handleChange}
                        placeholder="Full name" required disabled={loading} />
                    </InputGroup>
                    <InputGroup className="mb-2">
                      <Input value={fields.email} name="email" type="text" onChange={handleChange}
                        placeholder="Email address" required disabled={loading} />
                    </InputGroup>
                    <InputGroup className="mb-2">
                      <Input value={fields.password} name="password" type="password"
                        onChange={handleChange} placeholder="Password" required
                        disabled={loading} />
                    </InputGroup>
                    <InputGroup className="mb-2">
                      <Input value={fields.username} name="username" type="text"
                        onChange={handleChange} placeholder="Username" required
                        disabled={loading} />
                    </InputGroup>
                    <InputGroup className="mb-2">
                      <Input value={fields.phone} name="phone" type="text" onChange={handleChange}
                        placeholder="Phone" required disabled={loading} />
                    </InputGroup>
                    <InputGroup className="mb-2">
                      <Input type="select" value={fields.country_code} name="country_code" onChange={handleChange}>
                        {
                          countries.map(country => <option value={country.code} key={country.code}>{country.name}</option>)
                        }
                        {
                          !countries.length && <option disabled>Loading</option>
                        }
                      </Input>
                    </InputGroup>
                    <Button type="submit" color="primary" size="lg" className="mt-5" disabled={loading}>
                      Continue
                  </Button>

                    <p className='pt-3'>
                      Already have an account? <Link to='/login'>Login here</Link>
                    </p>
                  </Form>
                </CardBody>
              </Card>
            }
            {
              step === 2 &&
              <Card>
                <CardBody>
                  <Button type="button" color="secondary" outline size="sm" className="mb-5" disabled={loading} onClick={() => goBack()}>
                    Back
                </Button>
                  <div className="card-title font-weight-bold mb-5">
                    Select the type of account you want to create
                </div>

                  <Row>
                    {accountTypes.map(accountType => (
                      <Col md="6" key={accountType.code}>
                        <Card className="cursor-pointer" onClick={() =>
                          setAccountType(accountType.code)}>
                          <CardBody>
                            <CardTitle>{accountType.name}</CardTitle>
                            <CardSubtitle>{accountType.description}</CardSubtitle>
                          </CardBody>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </CardBody>
              </Card>
            }
            {
              step === 3 &&
              <Card>
                <CardBody>
                  <Button type="button" color="secondary" outline size="sm" className="mb-5" disabled={loading} onClick={() => goBack()}>
                    Back
                </Button>
                  <div className="card-title font-weight-bold mb-5">
                    Select your preferred subject
                </div>
                  <Row>
                    {academicSubjects.map(academicSubject => (
                      <Col md="12" key={academicSubject.code}>
                        <Card className="cursor-pointer mb-4" onClick={() =>
                          setSubject(academicSubject.code)}>
                          <CardBody>
                            <CardTitle>{academicSubject.name}</CardTitle>
                            <CardSubtitle>{academicSubject.description}</CardSubtitle>
                          </CardBody>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </CardBody>
              </Card>
            }
            {
              step === 4 &&
              <Card>
                <CardBody>
                  <Button type="button" color="secondary" outline size="sm" className="mb-5" disabled={loading} onClick={() => goBack()}>
                    Back
                </Button>
                  <div className="card-title font-weight-bold mb-5">
                    Finally..
                </div>
                  <Button onClick={register} color="primary" size="lg" className="mt-5" disabled={loading}>
                    Create Account
                </Button>
                </CardBody>
              </Card>
            }
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}