const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dataPath = path.join(__dirname, '../data/customers.json');

const getCustomers = () => {
    const jsonData = fs.readFileSync(dataPath);
    return JSON.parse(jsonData);
};

const saveCustomers = (customers) => {
    const jsonData = JSON.stringify(customers, null, 2);
    fs.writeFileSync(dataPath, jsonData);
};


//Get all customers
router.get('/', (req, res) => {
    try {
        const customers = getCustomers();
        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//Register a new customer
router.post('/new', (req, res) => {
    console.log({ req, res });
    try {
        const customers = getCustomers();
        const { name, dob, email, adharNumber, registrationDate, mobileNumber, planName, planCost, validity, planStatus } = req.body;

        // Validate the datapoints
        if (!name || !dob || !email || !adharNumber || !registrationDate || !mobileNumber || !planName || !planCost || !validity || !planStatus) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (adharNumber.length !== 12) {
            return res.status(400).json({ message: 'Adhar Number must be 12 digits' });
        }
        if (mobileNumber.length !== 10) {
            return res.status(400).json({ message: 'Mobile Number must be 10 digits' });
        }

        const newCustomer = {
            id: new Date().getTime().toString(),
            name,
            dob,
            email,
            adharNumber,
            registrationDate,
            mobileNumber,
            plan: {
                planName,
                planCost,
                validity,
                planStatus
            }
        };

        customers.push(newCustomer);
        saveCustomers(customers);
        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Renew plan for an existing customer
router.post('/renew/:id', (req, res) => {
    try {
        const customers = getCustomers();
        const customerId = req.params.id;
        const { renewalDate, planStatus } = req.body;

        const customerIndex = customers.findIndex(customer => customer.id === customerId);

        if (customerIndex !== -1) {
            customers[customerIndex].plan.renewalDate = renewalDate;
            customers[customerIndex].plan.planStatus = planStatus;

            saveCustomers(customers);
            res.json(customers[customerIndex]);
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Upgrade or downgrade plan for an existing customer
router.post('/upgradeDowngrade/:id', (req, res) => {
    try {
        const customers = getCustomers();
        const customerId = req.params.id;
        const { newPlanName, planCost, validity, planStatus } = req.body;

        const customerIndex = customers.findIndex(customer => customer.id === customerId);

        if (customerIndex !== -1) {
            customers[customerIndex].plan.planName = newPlanName;
            customers[customerIndex].plan.planCost = planCost;
            customers[customerIndex].plan.validity = validity;
            customers[customerIndex].plan.planStatus = planStatus;

            saveCustomers(customers);
            res.json(customers[customerIndex]);
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
