class FacilityController {
    constructor() {
        this.facilities = []; // In-memory storage for facilities
    }

    getFacility(req, res) {
        const { id } = req.params;
        const facility = this.facilities.find(fac => fac.id === id);
        if (facility) {
            res.status(200).json(facility);
        } else {
            res.status(404).json({ message: 'Facility not found' });
        }
    }

    createFacility(req, res) {
        const { id, phoneNumber } = req.body;
        const newFacility = { id, phoneNumber };
        this.facilities.push(newFacility);
        res.status(201).json(newFacility);
    }
}

export default FacilityController;