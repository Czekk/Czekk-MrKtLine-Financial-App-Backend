import DataDAO from "../dao/dataDAO.js";

export default class DataController {
    static async apiGetData(req, res){
        let filters= {}
        if (req.query.period){
            filters.period = req.query.period
        }
        const data = await DataDAO.getData({filters});

        res.json(data)
    }
}