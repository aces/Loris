class AppointmentApi {
    getOrFetchSites() {
        if (this._sites != undefined) {
            return Promise.resolve(this._sites);
        }
        return fetch(
            '/schedule_module/ajax/list_sites.php',
            {
                credentials: 'include',
                method: 'GET',
            }
        ).then((res) => {
            return res.json();
        }).then((data) => {
            console.log(data);
            this._sites = data;
            return data;
        });
    }
    getOrFetchVisitLabels() {
        if (this._visitLabels != undefined) {
            return Promise.resolve(this._visitLabels);
        }
        return fetch(
            '/schedule_module/ajax/list_visit_labels.php',
            {
                credentials: 'include',
                method: 'GET',
            }
        ).then((res) => {
            return res.json();
        }).then((data) => {
            console.log(data);
            this._visitLabels = data;
            return data;
        });
    }
    getOrFetchProjects() {
        if (this._projects != undefined) {
            return Promise.resolve(this._projects);
        }
        return fetch(
            '/schedule_module/ajax/list_projects.php',
            {
                credentials: 'include',
                method: 'GET',
            }
        ).then((res) => {
            return res.json();
        }).then((data) => {
            console.log(data);
            this._projects = data;
            return data;
        });
    }
    getOrFetchSubprojects() {
        if (this._subprojects != undefined) {
            return Promise.resolve(this._subprojects);
        }
        return fetch(
            '/schedule_module/ajax/list_subprojects.php',
            {
                credentials: 'include',
                method: 'GET',
            }
        ).then((res) => {
            return res.json();
        }).then((data) => {
            console.log(data);
            this._subprojects = data;
            return data;
        });
    }
    getOrFetchAppointmentTypes() {
        if (this._appointmentTypes != undefined) {
            return Promise.resolve(this._appointmentTypes);
        }
        return fetch(
            '/schedule_module/ajax/list_appointment_types.php',
            {
                credentials: 'include',
                method: 'GET',
            }
        ).then((res) => {
            return res.json();
        }).then((data) => {
            console.log(data);
            this._appointmentTypes = data;
            return data;
        });
    }
    fetchAppointments(filters = {}) {
        const queryString = Object.keys(filters)
            .map((key) => {
                const value = filters[key];
                if (value == undefined) {
                    return '';
                }
                if (value instanceof Array) {
                    if (value.length == 0) {
                        return '';
                    }
                    return value
                        .map((v) => `${key}[]=${encodeURIComponent(v)}`)
                        .join('&');
                } else {
                    return `${key}=${encodeURIComponent(value)}`;
                }
            })
            .filter((part) => {
                return part != '';
            })
            .join('&');
        return fetch(
            `/schedule_module/ajax/list_appointments.php?${queryString}`,
            {
                credentials: 'include',
                method: 'GET',
            }
        ).then((res) => {
            return res.json();
        });
    }
    fetchSessionsOfCandidate(candId, pscId) {
        const query = {
            'CandID': candId,
            'PSCID': pscId,
        };
        const queryString = Object.keys(query)
            .map((key) => `${key}=${encodeURIComponent(query[key])}`)
            .join('&');
        return fetch(
            `/schedule_module/ajax/list_sessions_of_candidate.php?${queryString}`,
            {
                credentials: 'include',
                method: 'GET',
            }
        ).then((res) => {
            return res.json()
                .then((json) => {
                    return {
                        status: res.status,
                        json: json,
                    };
                });
        });
    }
}

export const Api = new AppointmentApi();
