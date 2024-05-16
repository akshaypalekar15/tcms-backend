const request = require('supertest');
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = require('./customers');

const app = express();
app.use(express.json());
app.use('/api/customers', router);

jest.mock('fs');

const dataPath = path.join(__dirname, '../data/customers.json');

const mockCustomers = [
    {
        id: "1",
        name: "John Doe",
        dob: "1990-01-01",
        email: "john@example.com",
        adharNumber: "123456789012",
        registrationDate: "2023-01-01",
        mobileNumber: "9876543210",
        plan: {
            planName: "Gold180",
            planCost: 299,
            validity: 180,
            planStatus: "Active",
        }
    }
];

beforeEach(() => {
    fs.readFileSync.mockReturnValue(JSON.stringify(mockCustomers));
    fs.writeFileSync.mockClear();
});

describe('GET /api/customers', () => {
    it('should get all customers', async () => {
        const res = await request(app).get('/api/customers');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockCustomers);
    });
});

describe('POST /api/customers/new', () => {
    it('should register a new customer', async () => {
        const newCustomer = {
            name: "Jane Doe",
            dob: "1992-02-02",
            email: "jane@example.com",
            adharNumber: "098765432109",
            registrationDate: "2023-02-02",
            mobileNumber: "8765432109",
            planName: "Platinum365",
            planCost: 499,
            validity: 365,
            planStatus: "Active"
        };

        const res = await request(app)
            .post('/api/customers/new')
            .send(newCustomer);

        expect(res.statusCode).toEqual(200);
        expect(fs.writeFileSync).toHaveBeenCalledTimes(1);

        const savedCustomers = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
        expect(savedCustomers.length).toEqual(2);
        expect(savedCustomers[1]).toMatchObject({
            name: newCustomer.name,
            dob: newCustomer.dob,
            email: newCustomer.email,
            adharNumber: newCustomer.adharNumber,
            registrationDate: newCustomer.registrationDate,
            mobileNumber: newCustomer.mobileNumber,
            plan: {
                planName: newCustomer.planName,
                planCost: newCustomer.planCost,
                validity: newCustomer.validity,
                planStatus: newCustomer.planStatus
            }
        });
    });
});

describe('POST /api/customers/renew/:id', () => {
    it('should renew plan for an existing customer', async () => {
        const renewalData = {
            renewalDate: "2024-01-01",
            planStatus: "Active"
        };

        const res = await request(app)
            .post('/api/customers/renew/1')
            .send(renewalData);

        expect(res.statusCode).toEqual(200);
        expect(res.body.plan.renewalDate).toEqual(renewalData.renewalDate);
        expect(res.body.plan.planStatus).toEqual(renewalData.planStatus);
    });

    it('should return 404 if customer not found', async () => {
        const renewalData = {
            renewalDate: "2024-01-01",
            planStatus: "Active"
        };

        const res = await request(app)
            .post('/api/customers/renew/999')
            .send(renewalData);

        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual('Customer not found');
    });
});

describe('POST /api/customers/upgradeDowngrade/:id', () => {
    it('should upgrade/downgrade plan for an existing customer', async () => {
        const upgradeDowngradeData = {
            newPlanName: "Silver90",
            planCost: 199,
            validity: 90,
            planStatus: "Active"
        };

        const res = await request(app)
            .post('/api/customers/upgradeDowngrade/1')
            .send(upgradeDowngradeData);

        expect(res.statusCode).toEqual(200);
        expect(res.body.plan.planName).toEqual(upgradeDowngradeData.newPlanName);
        expect(res.body.plan.planCost).toEqual(upgradeDowngradeData.planCost);
        expect(res.body.plan.validity).toEqual(upgradeDowngradeData.validity);
        expect(res.body.plan.planStatus).toEqual(upgradeDowngradeData.planStatus);
    });

    it('should return 404 if customer not found', async () => {
        const upgradeDowngradeData = {
            newPlanName: "Silver90",
            planCost: 199,
            validity: 90,
            planStatus: "Active"
        };

        const res = await request(app)
            .post('/api/customers/upgradeDowngrade/999')
            .send(upgradeDowngradeData);

        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual('Customer not found');
    });
});
