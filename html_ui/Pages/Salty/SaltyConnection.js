const getMetar = (dept, updateView) => {
    return SimBriefApi.getMetar(dept, updateView)
        .then(data => {
            console.log(data);
            fmc.showErrorMessage("METAR UPLINK");
            updateView();
        })
        .catch(_err => {
            fmc.showErrorMessage("METAR UPLINK FAILED");
            updateView();
        });
}
const getAtis = (dept, store, updateView) => {
    store.atis = "SENT";
    updateView();
    return SimBriefApi.getAtis(dept, updateView)
        .then(data => {
            store.atis = "RECEIVED";
            updateView();
            fmc.showErrorMessage("ACARS UPLINK");
            updateView();
        })
        .catch(_err => {
            store.atis = "FAILED";
            updateView();
            fmc.showErrorMessage("ACARS NOT AVAILABLE");
            updateView();
        });
}

const getSimBriefPlan = (fmc, store, updateView) => {
    const userid = SaltyDataStore.get("OPTIONS_SIMBRIEF_ID", "");

    if (!userid) {
        fmc.showErrorMessage("INVALID ROUTE UPLINK");
        throw ("No simbrief username provided");
    }

    return SimBriefApi.getFltPlan(userid)
        .then(data => {
            setTimeout(() => {
                fmc.simbrief["route"] = data.general.route;
                fmc.simbrief["cruiseAltitude"] = data.general.initial_altitude;
                fmc.simbrief["originIcao"] = data.origin.icao_code;
                fmc.simbrief["destinationIcao"] = data.destination.icao_code;
                fmc.simbrief["blockFuel"] = data.fuel.plan_ramp;
                fmc.simbrief["payload"] = data.weights.payload;
                fmc.simbrief["estZfw"] = data.weights.est_zfw;
                fmc.simbrief["costIndex"] = data.general.costindex;
                fmc.simbrief["navlog"] = data.navlog.fix;
                fmc.simbrief["icao_airline"] = typeof data.general.icao_airline === 'string' ? data.general.icao_airline : "";
                fmc.simbrief["flight_number"] = data.general.flight_number;
                fmc.simbrief["alternateIcao"] = data.alternate.icao_code;
                fmc.simbrief["avgTropopause"] = data.general.avg_tropopause;
                /* TIMES */
                fmc.simbrief["ete"] = data.times.est_time_enroute;
                fmc.simbrief["blockTime"] = data.times.est_block;
                fmc.simbrief["outTime"] = data.times.est_out;
                fmc.simbrief["onTime"] = data.times.est_on;
                fmc.simbrief["inTime"] = data.times.est_in;
                fmc.simbrief["offTime"] = data.times.est_off;
                /* FUEL */
                fmc.simbrief["taxiFuel"] = data.fuel.taxi;
                fmc.simbrief["tripFuel"] = data.fuel.enroute_burn;
                fmc.simbrief["altnFuel"] = data.fuel.alternate_burn;
                fmc.simbrief["finResFuel"] = data.fuel.reserve;
                fmc.simbrief["contFuel"] = data.fuel.contingency;
                /* DISTANCE */
                fmc.simbrief["route_distance"] = data.general.route_distance;
                fmc.simbrief.rteUplinkReady = true;
                fmc.simbrief.perfUplinkReady = true;
                store.requestData = "SENT\xa0";
                store.rteUplinkReady = true;
                updateView();
            }, 2000);
            return fmc.simbrief;
        })
        .catch(_err => {
            fmc.showErrorMessage("INVALID ROUTE UPLINK");
            store.requestData = "FAILED\xa0";
            store.rteUplinkReady = false;
            updateView();
        });
}